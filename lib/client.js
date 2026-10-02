window.__ModuleLoader__.load({id:"dsh-theme-studio",factory:(require)=>{const module={exports:{}};const exports=module.exports;
const THEMES = [
  {
    id: 'catppuccin-mocha', name: 'Catppuccin Mocha',
    p: { bg:'#1e1e2e', sidebar:'#181825', inset:'#11111b', panel:'#242436', raised:'#313244', hover:'#3b3c51', border:'#45475a', text:'#cdd6f4', sub:'#bac2de', muted:'#a6adc8', accent:'#cba6f7', blue:'#89b4fa', green:'#a6e3a1', yellow:'#f9e2af', red:'#f38ba8', pink:'#f5c2e7', orange:'#fab387', cyan:'#94e2d5' }
  },
  {
    id: 'dracula', name: 'Dracula',
    p: { bg:'#282a36', sidebar:'#21222c', inset:'#1e1f29', panel:'#2e303e', raised:'#343746', hover:'#44475a', border:'#4d5065', text:'#f8f8f2', sub:'#c7c9d5', muted:'#a6abc7', accent:'#bd93f9', blue:'#8be9fd', green:'#50fa7b', yellow:'#f1fa8c', red:'#ff5555', pink:'#ff79c6', orange:'#ffb86c', cyan:'#8be9fd' }
  },
  {
    id: 'one-dark', name: 'One Dark',
    p: { bg:'#282c34', sidebar:'#21252b', inset:'#1b1e24', panel:'#2c313a', raised:'#333a46', hover:'#3e4451', border:'#454c59', text:'#abb2bf', sub:'#a3adbd', muted:'#959eae', accent:'#61afef', blue:'#61afef', green:'#98c379', yellow:'#e5c07b', red:'#e06c75', pink:'#c678dd', orange:'#d19a66', cyan:'#56b6c2' }
  },
  {
    id: 'codex-graphite', name: 'Codex Graphite',
    p: { bg:'#18191b', sidebar:'#202123', inset:'#131416', panel:'#222326', raised:'#2b2d31', hover:'#36383e', border:'#42454c', text:'#eceef2', sub:'#bfc3ca', muted:'#a0a6b0', accent:'#a8c7fa', blue:'#a8c7fa', green:'#a6d7b0', yellow:'#ecd59c', red:'#ee9a9f', pink:'#cfb4ec', orange:'#e8b48e', cyan:'#91d8d4' }
  }
];
// These palettes only draw the native preview. Native selection uses Dsh's
// built-in light/dark themes without registering or overriding their colors.
const NATIVE_THEMES = [
  {id:'dsh-light',name:'dsh light',native:'light',p:{bg:'#ffffff',sidebar:'#f9f9f9',inset:'#f5f6f7',panel:'#f5f5f5',raised:'#eeeeee',hover:'#e5e5e5',border:'#dddddd',text:'#262626',sub:'#555555',muted:'#777777',accent:'#4d6bfe',blue:'#4d6bfe',green:'#168a55',pink:'#a65bbd',orange:'#c77c35'}},
  {id:'dsh-dark',name:'dsh dark',native:'dark',p:{bg:'#131313',sidebar:'#1b1b1b',inset:'#171717',panel:'#2b2b2b',raised:'#333333',hover:'#3b3b3b',border:'#444444',text:'#f3f3f3',sub:'#bbbbbb',muted:'#888888',accent:'#6b8cff',blue:'#6b8cff',green:'#78c994',pink:'#c297e0',orange:'#e8b48e'}}
];
const CHOICES = [...NATIVE_THEMES,...THEMES];
function alpha(hex, opacity) {
  return hex + Math.round(opacity * 255).toString(16).padStart(2, '0');
}
const isColor = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
function mix(a, b, weight) {
  return '#' + [1,3,5].map(i => Math.round(parseInt(a.slice(i,i+2),16)*(1-weight)+parseInt(b.slice(i,i+2),16)*weight).toString(16).padStart(2,'0')).join('');
}
function customize(theme, values) {
  const p = {...theme.p};
  if (isColor(values.background)) {
    p.bg = values.background;
    p.sidebar = mix(p.bg,'#000000',.16);
    p.inset = mix(p.bg,'#000000',.3);
    p.panel = mix(p.bg,p.text,.035);
    p.raised = mix(p.bg,p.text,.075);
    p.hover = mix(p.bg,p.text,.12);
    p.border = mix(p.bg,p.text,.2);
  }
  if (isColor(values.foreground)) {
    p.text = values.foreground;
    p.sub = mix(p.text,p.bg,.15);
    p.muted = mix(p.text,p.bg,.28);
  }
  if (isColor(values.accent)) p.accent = values.accent;
  return {...theme,p};
}
function tokensFor(theme, polish = true) {
  const p = theme.p;
  const tokens = {};
  const set = (names, value) => names.split(' ').forEach(name => { tokens['--dsw-' + name] = value; });
  set('alias-bg-base alias-bg-layer-1', p.bg);
  set('alias-bg-layer-2 alias-bg-overlay alias-bg-document-preview', p.panel);
  set('alias-bg-layer-3 alias-bg-module-platform alias-bg-skeleton', p.raised);
  set('alias-settings-card-fill specific-selector specific-tip alias-markdown-code-block-banner', p.panel);
  set('specific-sidebar-fill', p.sidebar);
  set('specific-input-major specific-login-input specific-bubble', p.panel);
  set('alias-markdown-code-block alias-markdown-inline-code', p.inset);
  set('specific-bubble-highlight', alpha(p.accent, .12));
  set('specific-menu menu-surface-fill alias-menu-group-header-fill', alpha(p.panel, .97));
  set('alias-label-primary alias-label-primary-bluish alias-label-primary-foreground alias-label-document-preview alias-toast-label alias-brand-text', p.text);
  set('alias-label-secondary alias-label-primary-dimmed alias-menu-icon', p.sub);
  set('alias-label-tertiary alias-label-caption alias-label-dimmed alias-markdown-placeholder', p.muted);
  set('alias-label-primary-inverted alias-brand-primary-invert', p.inset);
  set('alias-border-l1 alias-border-l2 alias-border-l2-darkmode-thin alias-settings-card-stroke', alpha(p.border, .58));
  set('alias-border-l3 alias-border-l4 alias-border-inverted alias-border-inverted2 elevation-stroke-color', p.border);
  set('alias-brand-primary alias-brand-primary-new-colorprimary-new-color alias-state-business-primary alias-link alias-onboarding-accent', p.accent);
  set('alias-state-business-tertiary', alpha(p.accent, .16));
  set('alias-interactive-bg-hover alias-button-floating-hover alias-button-ghost-active-hover specific-sidebar-nav-item-hover', p.hover);
  set('alias-interactive-bg-hover-solid alias-interactive-bg-active', p.raised);
  set('alias-interactive-bg-hover-accent specific-sidebar-nav-item-active specific-sidebar-nav-item-active-accent alias-button-ghost-active-fill alias-bg-multi-select', alpha(p.accent, .14));
  set('alias-button-ghost-active-border', alpha(p.accent, .4));
  set('alias-button-primary-fill alias-button-primary-hover alias-button-contrast-fill', p.accent);
  set('alias-button-primary-dimmed', alpha(p.accent, .36));
  set('alias-button-floating-fill alias-button-elevated-fill alias-button-tool-bar-fill alias-button-tool-bar-hover alias-button-info-fill alias-button-info-hover', p.raised);
  set('alias-state-idle-primary alias-label-deep-diving alias-markdown-citation', p.blue);
  set('alias-state-success-primary', p.green);
  set('alias-state-error-primary', p.red);
  set('alias-state-warn-primary alias-state-warn-label', p.yellow);
  set('alias-state-success-secondary alias-state-success-tertiary alias-code-diff-added alias-file-diff-added-bg alias-file-diff-added-gutter', alpha(p.green, .12));
  set('alias-state-error-secondary alias-interactive-bg-hover-danger alias-code-diff-deleted alias-file-diff-deleted-bg alias-file-diff-deleted-gutter', alpha(p.red, .12));
  set('alias-file-diff-added-marker', p.green);
  set('alias-file-diff-deleted-marker', p.red);
  set('alias-state-warn-secondary alias-state-warn-tertiary', alpha(p.yellow, .12));
  set('alias-markdown-tag', alpha(p.blue, .16));
  set('alias-markdown-code-segment-selected', alpha(p.accent, .15));
  set('alias-markdown-code-segment-unselected', p.inset);
  set('alias-scrollbar-bg-l1 alias-scrollbar-bg-l2', alpha(p.border, .7));
  set('alias-scrollbar-hover-l1 alias-scrollbar-hover-l2', p.muted);
  set('alias-switch-thumb', p.text);
  set('alias-toast-bg alias-tooltip-bg', p.raised);
  set('alias-tooltip-key-bg', p.hover);
  set('alias-turn-trigger-bg', p.panel);
  set('alias-turn-trigger-bg-hover', p.raised);
  set('alias-bg-document-selection', alpha(p.blue, .35));
  set('alias-bg-mask-drop', alpha(p.accent, .1));
  set('alias-label-shimmer alias-label-deep-diving-shimmer', alpha(p.text, .45));
  set('alias-onboarding-card-fill alias-onboarding-secondary-fill', p.panel);
  set('alias-onboarding-checkbox-border', p.border);
  tokens['--dsw-focus-ring-color'] = p.accent;
  const syntax = { foreground:p.text, background:p.inset, constant:p.blue, string:p.green, comment:p.muted, keyword:p.pink, parameter:p.orange, function:p.accent, 'string-expression':p.cyan, punctuation:p.sub, link:p.blue };
  for (const [key, value] of Object.entries(syntax)) tokens['--shiki-' + (['foreground','background'].includes(key) ? key : 'token-' + key)] = value;
  if (polish) {
    Object.assign(tokens, { '--dsw-radius-xs':'4px', '--dsw-radius-sm':'6px', '--dsw-radius-md':'8px', '--dsw-radius-lg':'10px', '--dsw-radius-xl':'12px', '--dsw-radius-panel':'20px', '--dsw-corner-shape':'round' });
  }
  return tokens;
}


const CJK = '"Microsoft YaHei", "PingFang SC", sans-serif';
const FONTS = [
  {id:'system', name:'系统默认', family:''},
  {id:'yahei', name:'Microsoft YaHei', family:'"Microsoft YaHei", sans-serif'},
  {id:'jetbrains-mono', name:'JetBrains Mono', family:'"Dsh JetBrains Mono", '+CJK},
  {id:'jetbrains-nerd', name:'JetBrains Mono Nerd Font', family:'"Dsh JetBrains Mono Nerd", '+CJK}
];
const FONT_FILES = [
  ['JetBrainsMono','Dsh JetBrains Mono'],
  ['JetBrainsMonoNerdFont','Dsh JetBrains Mono Nerd']
];
const LEGACY_FONTS = {'jetbrains-mono-nl':'jetbrains-mono','jetbrains-nerd-mono':'jetbrains-nerd','jetbrains-nerd-propo':'jetbrains-nerd'};
const normalizeFont = id => LEGACY_FONTS[id] || (FONTS.some(font=>font.id===id) ? id : 'system');
function fontTokens(values) {
  const tokens = {};
  for (const [key,token,ligatures] of [['font','--dsw-font-family','--ts-ui-ligatures'],['codeFont','--ds-font-family-code','--ts-code-ligatures']]) {
    const selected = FONTS.find(font=>font.id===normalizeFont(values[key]));
    if (selected?.family) { tokens[token]=selected.family; tokens[ligatures]=selected.ligatures || 'normal'; }
  }
  return tokens;
}


const STUDIO_CSS="@font-face{font-family:\"Dsh JetBrains Mono\";src:url(\"/dsh-theme-studio/fonts/JetBrainsMono-Regular.woff2?v=0.1.0\") format(\"woff2\");font-weight:100 500;font-style:normal;font-display:swap}\n@font-face{font-family:\"Dsh JetBrains Mono\";src:url(\"/dsh-theme-studio/fonts/JetBrainsMono-Bold.woff2?v=0.1.0\") format(\"woff2\");font-weight:600 900;font-style:normal;font-display:swap}\n@font-face{font-family:\"Dsh JetBrains Mono\";src:url(\"/dsh-theme-studio/fonts/JetBrainsMono-Italic.woff2?v=0.1.0\") format(\"woff2\");font-weight:100 500;font-style:italic;font-display:swap}\n@font-face{font-family:\"Dsh JetBrains Mono\";src:url(\"/dsh-theme-studio/fonts/JetBrainsMono-BoldItalic.woff2?v=0.1.0\") format(\"woff2\");font-weight:600 900;font-style:italic;font-display:swap}\n@font-face{font-family:\"Dsh JetBrains Mono Nerd\";src:url(\"/dsh-theme-studio/fonts/JetBrainsMonoNerdFont-Regular.woff2?v=0.1.0\") format(\"woff2\");font-weight:100 500;font-style:normal;font-display:swap}\n@font-face{font-family:\"Dsh JetBrains Mono Nerd\";src:url(\"/dsh-theme-studio/fonts/JetBrainsMonoNerdFont-Bold.woff2?v=0.1.0\") format(\"woff2\");font-weight:600 900;font-style:normal;font-display:swap}\n@font-face{font-family:\"Dsh JetBrains Mono Nerd\";src:url(\"/dsh-theme-studio/fonts/JetBrainsMonoNerdFont-Italic.woff2?v=0.1.0\") format(\"woff2\");font-weight:100 500;font-style:italic;font-display:swap}\n@font-face{font-family:\"Dsh JetBrains Mono Nerd\";src:url(\"/dsh-theme-studio/fonts/JetBrainsMonoNerdFont-BoldItalic.woff2?v=0.1.0\") format(\"woff2\");font-weight:600 900;font-style:italic;font-display:swap}\n.ts-page{height:100%;overflow:auto;box-sizing:border-box;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family,system-ui);padding:56px 40px 40px;scrollbar-gutter:stable}\n.ts-page *{box-sizing:border-box}.ts-content{max-width:760px;margin:0 auto}.ts-page h1{font-size:28px;line-height:1.4;font-weight:600;margin:0 0 32px}.ts-page h2{font-size:14px;line-height:1.5;font-weight:500;margin:24px 0 14px}\n.ts-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ts-card{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;overflow:hidden}.ts-card.ts-selected{border-color:var(--ts-accent);box-shadow:0 0 0 .5px var(--ts-accent)}.ts-theme-button{font:inherit;width:100%;text-align:left;color:inherit;background:transparent;display:block;border:0;padding:0;cursor:pointer}.ts-theme-button:disabled{cursor:default}.ts-card:has(.ts-theme-button:hover:not(:disabled)){border-color:var(--ts-accent)}.ts-theme-button:focus-visible,.ts-swatches button:focus-visible,.ts-actions button:focus-visible{outline:2px solid var(--dsw-focus-ring-color);outline-offset:-3px}.ts-card-title{padding:13px 14px 8px;display:flex;align-items:center;justify-content:space-between;gap:8px}.ts-card-title strong{font-size:12px;font-weight:500}.ts-check{display:flex;align-items:center;justify-content:center;width:17px;height:17px;border:1px solid var(--dsw-alias-border-l3);border-radius:50%;corner-shape:round;color:var(--ts-accent)}.ts-selected .ts-check{border-color:var(--ts-accent)}\n.ts-swatches{display:flex;gap:8px;padding:3px 14px 13px}.ts-swatches button{display:block;width:13px;height:13px;border:0;border-radius:50%;corner-shape:round;padding:0;cursor:pointer}.ts-swatches button[aria-pressed=true]{outline:1px solid var(--dsw-alias-label-primary);outline-offset:2px}.ts-swatches button:disabled{cursor:default}\n.ts-preview{height:86px;display:flex;overflow:hidden;background:var(--ts-bg);color:var(--ts-text);text-align:left;pointer-events:none}.ts-mini-sidebar{width:25%;background:var(--ts-sidebar);padding:10px;flex-shrink:0;border-right:1px solid var(--ts-border)}.ts-mini-brand{display:flex;color:var(--ts-sub);margin-bottom:8px}.ts-mini-new{height:11px;border:1px solid var(--ts-border);border-radius:4px;margin-bottom:7px}.ts-mini-new span{display:block;height:2px;margin:3px auto;width:46%;background:var(--ts-sub);opacity:.45;border-radius:4px}.ts-mini-line{height:2px;background:var(--ts-muted);opacity:.25;width:70%;margin:6px 2px;border-radius:3px}.ts-short{width:48%}.ts-mini-active{height:11px;background:color-mix(in srgb,var(--ts-accent) 15%,transparent);border-radius:4px}.ts-mini-main{flex:1;min-width:0;padding:12px 14px}.ts-mini-heading{margin-bottom:7px}.ts-mini-heading span{display:block;width:58%;height:3px;border-radius:3px;background:var(--ts-text);opacity:.6}.ts-mini-code{font-family:Consolas,'Cascadia Code',monospace;font-size:9px;white-space:nowrap;background:var(--ts-inset);padding:5px 7px;border-radius:4px;overflow:hidden}.ts-mini-composer{display:flex;align-items:center;justify-content:space-between;background:var(--ts-panel);border:1px solid var(--ts-border);border-radius:6px;margin-top:8px;height:19px;padding:3px 6px;color:var(--ts-muted)}.ts-mini-composer>span{display:block;width:48%;height:2px;background:var(--ts-muted);opacity:.3;border-radius:3px}.ts-mini-composer b{font-size:10px;display:flex;align-items:center;justify-content:center;width:12px;height:12px;background:var(--ts-accent);color:var(--ts-inset);border-radius:50%;corner-shape:round;font-weight:500}\n.ts-settings{border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-2);padding:0 18px}.ts-row{display:flex;align-items:center;justify-content:space-between;min-height:56px;gap:20px;font-size:13px}.ts-row+.ts-row{border-top:1px solid var(--dsw-alias-border-l2)}.ts-row>input[type=checkbox]{width:16px;height:16px;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}.ts-color-control{display:flex;align-items:center;gap:9px;padding:5px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:20px;background:var(--dsw-alias-bg-base)}.ts-color-swatch{display:block;width:17px;height:17px;border-radius:50%;corner-shape:round;background:var(--color);box-shadow:inset 0 0 0 1px #ffffff18;overflow:hidden;position:relative;cursor:pointer}.ts-color-swatch input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.ts-color-swatch:focus-within{outline:2px solid var(--dsw-focus-ring-color);outline-offset:-2px}.ts-hex{font:inherit;font-size:12px;color:var(--dsw-alias-label-primary);width:69px;background:transparent;border:0;outline:none;padding:0;line-height:20px}.ts-hex:focus-visible{outline:1px solid var(--dsw-focus-ring-color);outline-offset:3px}.ts-hex[aria-invalid=true]{color:var(--dsw-alias-state-error-primary)}.ts-color-control:has(input:disabled){opacity:.45}.ts-actions{display:flex;justify-content:flex-end;gap:22px;margin-top:24px}.ts-actions button{font:inherit;font-size:12px;border:0;background:transparent;color:var(--dsw-alias-label-secondary);padding:4px 0;cursor:pointer}.ts-actions button:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.ts-actions button:disabled{opacity:.4;cursor:default}.ts-error{font-size:12px;color:var(--dsw-alias-state-error-primary);margin:14px 0 0}.ts-settings-link{display:flex;align-items:center;justify-content:space-between;padding:16px 0;font-size:14px;border-bottom:.5px solid var(--dsw-alias-border-l2)}.ts-settings-link button{font:inherit;font-size:12px;background:transparent;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:6px 10px;cursor:pointer}\n@media(max-width:760px){.ts-page{padding:48px 24px 32px}.ts-page h1{font-size:26px;margin-bottom:26px}.ts-card-title{padding:12px 12px 7px}.ts-swatches{padding-left:12px}.ts-mini-main{padding:12px 10px}}@media(max-width:480px){.ts-page{padding:44px 18px 28px}.ts-grid{grid-template-columns:1fr}.ts-page h1{font-size:24px}.ts-settings{padding:0 14px}}\n.ts-swatches>span{display:block;width:13px;height:13px;border-radius:50%}\n.ts-font-picker{max-width:75%;min-width:0}.ts-select{font:inherit;font-size:12px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:18px;padding:7px 12px;max-width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;cursor:pointer}.ts-select>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ts-select>svg{flex:none}.ts-select:hover:not(:disabled){border-color:var(--dsw-alias-border-l3)}.ts-select:focus-visible{outline:2px solid var(--dsw-focus-ring-color);outline-offset:2px}.ts-select:disabled{opacity:.45;cursor:default}\n.ts-font-menu{position:fixed;inset:auto;margin:0;padding:5px;box-sizing:border-box;max-height:calc(100vh - 20px);overflow:auto;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l3);border-radius:14px;box-shadow:0 8px 28px #0004;font-size:12px}.ts-font-menu::backdrop{background:transparent}.ts-font-option{font:inherit;font-size:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;height:38px;padding:0 11px;border:0;border-radius:9px;color:inherit;background:transparent;text-align:left;cursor:pointer}.ts-font-option>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ts-font-option:hover,.ts-font-option:focus-visible{background:var(--dsw-alias-interactive-bg-hover);outline:none}.ts-font-option[aria-selected=true]{color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-interactive-bg-hover-accent)}.ts-font-option:focus-visible{outline:1px solid var(--dsw-focus-ring-color);outline-offset:-1px}.ts-font-check-space,.ts-font-option>svg{flex:none;width:14px}\n[data-dsh-appearance-nav]>svg{display:none}[data-dsh-appearance-nav]::before{content:\"\";display:block;flex:none;width:18px;height:18px;background:currentColor;mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='white' stroke-width='1.6' d='M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.5 1.5 0 0 1 1.1-2.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z'/%3E%3Ccircle cx='7.5' cy='10' r='1' fill='white'/%3E%3Ccircle cx='10' cy='6.8' r='1' fill='white'/%3E%3Ccircle cx='14.5' cy='7' r='1' fill='white'/%3E%3Ccircle cx='17' cy='10.4' r='1' fill='white'/%3E%3C/svg%3E\") center/contain no-repeat}\n.ts-font-preview{display:flex;flex-wrap:wrap;gap:8px 24px;padding:16px 0;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font-size:13px}.ts-font-preview code,.ts-mini-code{font-family:var(--ds-font-family-code,Consolas,monospace);font-variant-ligatures:var(--ts-code-ligatures,normal)}\nbody{font-variant-ligatures:var(--ts-ui-ligatures,normal)}pre,code{font-variant-ligatures:var(--ts-code-ligatures,normal)}\n.ts-page.ts-embedded{height:auto;overflow:visible;scrollbar-gutter:auto;padding:0;background:transparent}.ts-embedded h1{font-size:22px;margin-bottom:24px}\n";
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

return module.exports;}});
