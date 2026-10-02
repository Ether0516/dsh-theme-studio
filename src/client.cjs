const React = require('react');
const h = React.createElement;
const ENTRY_ID = 'dsh-theme-studio';

class ThemeController {
  constructor(ctx) {
    this.ctx = ctx;
    this.form = ctx.configForms.get(ENTRY_ID);
    this.nativeForm = ctx.configForms.get('ui-theme');
    this.listeners = new Set();
    this.state = {theme:'catppuccin-mocha', polish:true, accent:'', background:'', foreground:'', font:'system', codeFont:'system', saving:false, error:'', ready:false};
    this.generation = 0;
    this.disposed = false;
    this.queued = false;
    this.nativePreference = ctx.theme.getTheme().preference;
    this.offOverride = null;
    this.overrideKey = '';
    this.getSnapshot = () => this.state;
    this.subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
    this.unregister = THEMES.map(theme => ctx.theme.register({id:'theme-studio/' + theme.id, colorScheme:'dark', tokens:tokensFor(theme, false)}));
    this.offForm = this.form.subscribe(() => { if (!this.state.saving) this.adopt(); });
    this.offTheme = ctx.on('theme/change', () => {
      if (this.disposed || this.queued || this.state.theme === 'original') return;
      this.queued = true;
      queueMicrotask(() => { this.queued = false; if (!this.disposed) this.applyTheme(); });
    });
    this.adopt();
  }
  publish(next) {
    this.state = {...this.state, ...next};
    for (const listener of this.listeners) listener();
  }
  adopt() {
    const snapshot = this.form.getSnapshot();
    const value = snapshot.value;
    if (value && (value.theme === 'original' || CHOICES.some(t => t.id === value.theme))) {
      const nativeId = this.ctx.theme.getTheme().active.colorScheme === 'dark' ? 'dsh-dark' : 'dsh-light';
      this.publish({theme:value.theme === 'original' ? nativeId : value.theme, polish:value.polish !== false,
        ...Object.fromEntries(['accent','background','foreground'].map(key=>[key,isColor(value[key])?value[key]: ''])),
        ...Object.fromEntries(['font','codeFont'].map(key=>[key,normalizeFont(value[key])])),
        ready:snapshot.writable, saving:false});
    } else this.publish({ready:false});
    this.applyTheme();
  }
  applyTheme() {
    const {theme, polish} = this.state;
    const selected = THEMES.find(t=>t.id===theme);
    const active = !!selected;
    document.body.toggleAttribute('data-dsh-theme-studio', active);
    if (active) document.body.dataset.dshThemeStudio = theme;
    const key = JSON.stringify([theme,polish,this.state.accent,this.state.background,this.state.foreground,this.state.font,this.state.codeFont]);
    if (key !== this.overrideKey) {
      this.overrideKey = key;
      if (this.offOverride) { this.offOverride(); this.offOverride = null; }
      const tokens = {...(active ? tokensFor(customize(selected,this.state),polish) : {}),...fontTokens(this.state)};
      if (Object.keys(tokens).length) {
        const pairs = Object.fromEntries(Object.entries(tokens).map(([name,value])=>[name,{light:value,dark:value}]));
        this.offOverride = this.ctx.theme.overrideTokens(ENTRY_ID,pairs);
      }
    }
    const id = active ? 'theme-studio/' + theme : NATIVE_THEMES.find(t=>t.id===theme)?.native || this.nativeForm.getSnapshot().value?.preference || this.nativePreference;
    if (this.ctx.theme.getTheme().preference !== id) this.ctx.theme.setTheme(id);
  }
  async update(next) {
    if (this.disposed || !this.state.ready) return;
    for (const key of ['accent','background','foreground']) {
      if (key in next && next[key] !== '' && !isColor(next[key])) return;
    }
    for (const key of ['font','codeFont']) if (key in next && !FONTS.some(font=>font.id===next[key])) return;
    if ('theme' in next && next.theme !== 'original' && !CHOICES.some(theme=>theme.id===next.theme)) return;
    const generation = ++this.generation;
    const reset = next.theme && next.theme !== this.state.theme ? {accent:'',background:'',foreground:''} : {};
    this.publish({...reset,...next, saving:true, error:''});
    this.applyTheme();
    try {
      const accepted = await this.form.mutate(['theme','polish','accent','background','foreground','font','codeFont'].map(key=>({op:'set',path:[key],value:this.state[key]})));
      if (this.disposed || generation !== this.generation) return;
      this.publish({saving:false,error:accepted ? '' : '未能保存主题，已恢复上次设置。请稍后重试。'});
      this.adopt();
    } catch {
      if (this.disposed || generation !== this.generation) return;
      this.publish({saving:false,error:'连接暂时不可用，已恢复上次设置。请稍后重试。'});
      this.adopt();
    }
  }
  dispose() {
    this.disposed = true;
    this.offForm();
    this.offTheme();
    if (this.offOverride) this.offOverride();
    const native = this.nativeForm.getSnapshot().value?.preference || this.nativePreference;
    if (this.ctx.theme.getTheme().preference.startsWith('theme-studio/')) this.ctx.theme.setTheme(native);
    for (const off of this.unregister.reverse()) off();
    document.body.removeAttribute('data-dsh-theme-studio');
    this.listeners.clear();
  }
}

function PaletteIcon({size=18}) {
  return h('svg',{width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6,'aria-hidden':true},
    h('path',{d:'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.5 1.5 0 0 1 1.1-2.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z'}),
    ...[[7.5,10],[10,6.8],[14.5,7],[17,10.4]].map(([cx,cy],i) => h('circle',{key:i,cx,cy,r:1,fill:'currentColor',stroke:'none'})));
}
function CheckIcon() { return h('svg',{width:14,height:14,viewBox:'0 0 16 16',fill:'none','aria-hidden':true},h('path',{d:'m3 8 3 3 7-7',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'})); }
function vars(theme) { return Object.fromEntries(Object.entries(theme.p).map(([k,v]) => ['--ts-'+k,v])); }
function Preview({theme}) {
  const p = theme.p;
  return h('div',{className:'ts-preview',style:vars(theme),'aria-hidden':true},
    h('aside',{className:'ts-mini-sidebar'},
      h('div',{className:'ts-mini-brand'},h(PaletteIcon,{size:10})),
      h('div',{className:'ts-mini-new'},h('span')),
      h('div',{className:'ts-mini-line'}),h('div',{className:'ts-mini-line ts-short'}),
      h('div',{className:'ts-mini-active'}),
      h('div',{className:'ts-mini-line ts-short'})),
    h('div',{className:'ts-mini-main'},
      h('div',{className:'ts-mini-heading'},h('span')),
      h('div',{className:'ts-mini-code'},h('span',{style:{color:p.pink}},'const '),h('span',{style:{color:p.text}},'theme '),h('span',{style:{color:p.sub}},'= '),h('span',{style:{color:p.green}},'"'+theme.name+'"'),h('span',{style:{color:p.sub}},';')),
      h('div',{className:'ts-mini-composer'},h('span'),h('b',null,'↑'))));
}
function ColorField({label,field,value,disabled,controller}) {
  const [draft,setDraft] = React.useState(value.toUpperCase());
  React.useEffect(()=>setDraft(value.toUpperCase()),[value]);
  const valid = isColor(draft);
  const commit = () => { if (valid && draft.toLowerCase() !== value.toLowerCase()) controller.update({[field]:draft}); };
  return h('div',{className:'ts-row'},h('span',null,label),
    h('div',{className:'ts-color-control'},
      h('label',{className:'ts-color-swatch',style:{'--color':value},title:'选择'+label},
        h('input',{type:'color',value,disabled,'aria-label':'选择'+label,onChange:e=>controller.update({[field]:e.target.value})})),
      h('input',{className:'ts-hex',type:'text',value:draft,disabled,maxLength:7,spellCheck:false,'aria-label':label+'色值','aria-invalid':!valid,
        onChange:e=>setDraft(e.target.value),onBlur:commit,onKeyDown:e=>{if(e.key==='Enter'){e.preventDefault();commit();}if(e.key==='Escape')setDraft(value.toUpperCase());}})));
}
function FontPicker({label,value,disabled,onChange}) {
  const id = React.useId();
  const trigger = React.useRef(null);
  const menu = React.useRef(null);
  const [open,setOpen] = React.useState(false);
  const selected = FONTS.find(font=>font.id===value) || FONTS[0];
  const close = (restoreFocus=false) => {
    menu.current?.hidePopover();
    if (restoreFocus) trigger.current?.focus();
  };
  const show = () => {
    if (disabled) return;
    const bounds = trigger.current.getBoundingClientRect();
    const width = Math.min(Math.max(bounds.width,260),window.innerWidth-20);
    const height = FONTS.length*38+12;
    const popup = menu.current;
    popup.style.width = width+'px';
    popup.style.left = Math.max(10,Math.min(bounds.right-width,window.innerWidth-width-10))+'px';
    popup.style.top = Math.max(10,bounds.bottom+height+8>window.innerHeight ? bounds.top-height-6 : bounds.bottom+6)+'px';
    popup.showPopover();
    popup.querySelector('[aria-selected="true"]')?.focus();
  };
  React.useEffect(()=>{
    if (!open) return;
    const dismiss = event => { if (!menu.current?.contains(event.target)) close(); };
    const resize = () => close();
    document.addEventListener('scroll',dismiss,true);
    window.addEventListener('resize',resize);
    return () => { document.removeEventListener('scroll',dismiss,true);window.removeEventListener('resize',resize); };
  },[open]);
  const keys = event => {
    if (event.key==='Escape') { event.preventDefault();event.stopPropagation();close(true); }
    if (event.key==='Tab') close(true);
    if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
    event.preventDefault();event.stopPropagation();
    const options = [...menu.current.querySelectorAll('[role="option"]')];
    const index = options.indexOf(document.activeElement);
    const next = event.key==='Home' ? 0 : event.key==='End' ? options.length-1 : (index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;
    options[next]?.focus();
  };
  return h('div',{className:'ts-font-picker'},
    h('button',{ref:trigger,type:'button',className:'ts-select',role:'combobox',disabled,'aria-label':label,'aria-expanded':open,'aria-controls':id,'aria-haspopup':'listbox',style:{fontFamily:selected.family || 'system-ui'},
      onClick:()=>open ? close() : show(),onKeyDown:event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();show();}}},
      h('span',null,selected.name),h('svg',{width:14,height:14,viewBox:'0 0 16 16',fill:'none','aria-hidden':true},h('path',{d:'m4 6 4 4 4-4',stroke:'currentColor',strokeWidth:1.5,strokeLinecap:'round',strokeLinejoin:'round'}))),
    h('div',{ref:menu,id,popover:'auto',role:'listbox',className:'ts-font-menu','aria-label':label,onKeyDown:keys,onToggle:event=>setOpen(event.newState==='open')},
      ...FONTS.map(font=>h('button',{key:font.id,type:'button',role:'option','aria-selected':value===font.id,className:'ts-font-option',style:{fontFamily:font.family || 'system-ui'},
        onClick:()=>{onChange(font.id);close(true);}},h('span',null,font.name),value===font.id?h(CheckIcon):h('span',{className:'ts-font-check-space'})))));
}
// Dsh 0.2's settings rows have a fixed icon map with a gear fallback. Mark
// only our row for a CSS palette mask; retain React's SVG and remove the
// marker on unload. No application files or other settings rows are changed.
function appearanceNavIcon() {
  const mark = () => {
    for (const button of document.querySelectorAll('[data-shortcut-modal="settings"] nav button')) {
      if (button.querySelector('span')?.textContent==='外观') button.setAttribute('data-dsh-appearance-nav','');
    }
  };
  const observer = new MutationObserver(mark);
  observer.observe(document.body,{childList:true,subtree:true});
  mark();
  return () => {
    observer.disconnect();
    for (const button of document.querySelectorAll('[data-dsh-appearance-nav]')) button.removeAttribute('data-dsh-appearance-nav');
  };
}
function ThemePage({controller,embedded=false}) {
  const state = React.useSyncExternalStore(controller.subscribe,controller.getSnapshot,controller.getSnapshot);
  const active = CHOICES.find(t => t.id === state.theme);
  const custom = active && !active.native;
  const effective = active ? customize(active,state) : null;
  return h('section',{className:'ts-page'+(embedded?' ts-embedded':''),'aria-label':'外观'},
    h('div',{className:'ts-content'},
      h('h1',null,'外观'),h('h2',null,'主题'),
      h('div',{className:'ts-grid','aria-label':'主题'},...CHOICES.map(theme => {
        const selected = state.theme === theme.id;
        const preview = selected ? effective : theme;
        return h('div',{key:theme.id,className:'ts-card'+(selected?' ts-selected':''),style:vars(preview)},
          h('button',{type:'button',className:'ts-theme-button','aria-label':'应用 '+theme.name+' 主题','aria-pressed':selected,disabled:!state.ready,onClick:()=>controller.update({theme:theme.id})},
            h(Preview,{theme:preview}),
            h('div',{className:'ts-card-title'},h('strong',null,theme.name),h('span',{className:'ts-check'},selected?h(CheckIcon):null))),
          h('div',{className:'ts-swatches'},...[...new Set([theme.p.accent,theme.p.blue,theme.p.green,theme.p.pink,theme.p.orange])].map((color,i)=>theme.native ? h('span',{key:i,style:{background:color},title:color.toUpperCase()}) : h('button',{key:i,type:'button',style:{background:color},disabled:!state.ready,
            'aria-label':theme.name+' 强调色 '+color.toUpperCase(),'aria-pressed':selected && preview.p.accent.toLowerCase() === color.toLowerCase(),title:color.toUpperCase(),onClick:()=>controller.update({theme:theme.id,accent:color})}))));
      })),
      h('h2',null,'配色'),
      h('div',{className:'ts-settings'},
        ...[['强调色','accent','accent'],['背景','background','bg'],['前景','foreground','text']].map(([label,field,paletteKey])=>h(ColorField,{key:field,label,field,value:(effective || THEMES[0]).p[paletteKey],disabled:!state.ready || !custom,controller})),
        h('label',{className:'ts-row'},h('span',null,'紧凑圆角'),h('input',{type:'checkbox',checked:custom && state.polish,disabled:!state.ready || !custom,onChange:e=>controller.update({polish:e.target.checked}),'aria-label':'紧凑圆角'}))),
      h('h2',null,'字体'),
      h('div',{className:'ts-settings'},
        ...[['界面字体','font'],['代码字体','codeFont']].map(([label,field])=>h('div',{key:field,className:'ts-row'},h('span',null,label),
          h(FontPicker,{label,value:state[field],disabled:!state.ready,onChange:id=>controller.update({[field]:id})}))),
        h('div',{className:'ts-font-preview'},h('span',null,'中文预览 Aa 0123'),h('code',null,'const hello = "World"; -> !='))),
      state.error?h('p',{className:'ts-error',role:'alert'},state.error):null,
      h('div',{className:'ts-actions'},
        h('button',{type:'button',disabled:!state.ready || !custom || ![state.accent,state.background,state.foreground].some(Boolean),onClick:()=>controller.update({accent:'',background:'',foreground:''})},'重置配色'))));
}

const inject = ['theme','slots','configForms'];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement('style');
    style.dataset.plugin = ENTRY_ID;
    style.textContent = STUDIO_CSS;
    document.head.appendChild(style);
    return () => style.remove();
  });
  const controller = new ThemeController(ctx);
  // First-paint CSS is temporary. Once the official ThemePresenter has applied
  // our registry tokens, remove the owned bootstrap so native restore/unload
  // cannot inherit stale palette or radius declarations.
  for (const style of document.querySelectorAll('style')) {
    if (style.textContent.startsWith('/*dsh-theme-studio:bootstrap*/')) style.remove();
  }
  ctx.effect(() => () => controller.dispose());
  ctx.effect(appearanceNavIcon);
  ctx.slots.inject('settings.section', () => ctx.slots.register({name:'settings.section',id:'dsh-appearance',order:1,label:'外观',inject:()=>({controller,embedded:true})},ThemePage));
}
module.exports = {apply,inject,ThemeController};
