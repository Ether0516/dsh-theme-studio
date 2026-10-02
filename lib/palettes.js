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
export { THEMES, NATIVE_THEMES, CHOICES, tokensFor, alpha, isColor, customize };
