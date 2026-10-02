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
module.exports = { FONTS, FONT_FILES, LEGACY_FONTS, normalizeFont, fontTokens };
