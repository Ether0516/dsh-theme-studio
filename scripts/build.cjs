const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
fs.mkdirSync(path.join(root, 'lib'), {recursive:true});
const palettes = read('src/palettes.cjs');
const paletteExports = 'module.exports = { THEMES, NATIVE_THEMES, CHOICES, tokensFor, alpha, isColor, customize };';
const fonts = read('src/fonts.cjs');
const fontExports = 'module.exports = { FONTS, FONT_FILES, LEGACY_FONTS, normalizeFont, fontTokens };';
const {FONT_FILES} = require('../src/fonts.cjs');
const version = JSON.parse(read('package.json')).version;
let fontCss = '';
fs.mkdirSync(path.join(root,'lib/font-assets'),{recursive:true});
const shipped = new Set(FONT_FILES.flatMap(([file])=>['Regular','Bold','Italic','BoldItalic'].map(style=>file+'-'+style+'.woff2')));
for (const file of fs.readdirSync(path.join(root,'lib/font-assets'))) if (file.endsWith('.woff2') && !shipped.has(file)) fs.unlinkSync(path.join(root,'lib/font-assets',file));
for (const [file,family] of FONT_FILES) {
  for (const style of ['Regular','Bold','Italic','BoldItalic']) {
    const bytes = fs.readFileSync(path.join(root,'assets/fonts',file+'-'+style+'.woff2'));
    if (bytes.toString('ascii',0,4)!=='wOF2') throw new Error('Invalid bundled font: '+file+'-'+style);
    fs.copyFileSync(path.join(root,'assets/fonts',file+'-'+style+'.woff2'),path.join(root,'lib/font-assets',file+'-'+style+'.woff2'));
    fontCss += `@font-face{font-family:"${family}";src:url("/dsh-theme-studio/fonts/${file}-${style}.woff2?v=${version}") format("woff2");font-weight:${style.startsWith('Bold')?'600 900':'100 500'};font-style:${style.includes('Italic')?'italic':'normal'};font-display:swap}\n`;
  }
}
fs.writeFileSync(path.join(root,'lib/palettes.js'), palettes.replace(paletteExports, 'export { THEMES, NATIVE_THEMES, CHOICES, tokensFor, alpha, isColor, customize };'));
fs.writeFileSync(path.join(root,'lib/fonts.js'), fonts.replace(fontExports,'export { FONTS, FONT_FILES, LEGACY_FONTS, normalizeFont, fontTokens };'));
fs.mkdirSync(path.join(root,'lib/licenses'),{recursive:true});
for (const file of fs.readdirSync(path.join(root,'assets/fonts')).filter(file=>file.endsWith('.txt'))) fs.copyFileSync(path.join(root,'assets/fonts',file),path.join(root,'lib/licenses',file));
fs.writeFileSync(path.join(root,'lib/index.js'), read('src/index.js'));
fs.writeFileSync(path.join(root,'lib/client.js'), `window.__ModuleLoader__.load({id:"dsh-theme-studio",factory:(require)=>{const module={exports:{}};const exports=module.exports;\n${palettes.replace(paletteExports,'')}\n${fonts.replace(fontExports,'')}\nconst STUDIO_CSS=${JSON.stringify(fontCss+read('src/studio.css'))};\n${read('src/client.cjs')}\nreturn module.exports;}});\n`);
console.log('Built host + client: no network or third-party build tools required.');
