import z from '@deepseek-ai/schemastery';
import { readFileSync } from 'node:fs';
import { THEMES, CHOICES, tokensFor, customize } from './palettes.js';
import { FONTS, FONT_FILES, LEGACY_FONTS, fontTokens } from './fonts.js';

export const name = 'dsh-theme-studio';
export const Config = z.object({
  theme: z.union([...CHOICES.map(t => t.id), 'original']).default('catppuccin-mocha').volatile(),
  polish: z.boolean().default(true).volatile(),
  accent: z.string().pattern(/^(?:#[0-9a-fA-F]{6})?$/).default('').volatile(),
  background: z.string().pattern(/^(?:#[0-9a-fA-F]{6})?$/).default('').volatile(),
  foreground: z.string().pattern(/^(?:#[0-9a-fA-F]{6})?$/).default('').volatile(),
  font: z.union([...FONTS.map(f=>f.id),...Object.keys(LEGACY_FONTS)]).default('system').volatile(),
  codeFont: z.union([...FONTS.map(f=>f.id),...Object.keys(LEGACY_FONTS)]).default('system').volatile()
});

export function apply(ctx, config) {
  ctx.inject(['webServer'], child => {
    for (const [file] of FONT_FILES) for (const style of ['Regular','Bold','Italic','BoldItalic']) {
      const filename = `${file}-${style}.woff2`;
      child.effect(() => child.webServer.register({kind:'exact',path:'/dsh-theme-studio/fonts/'+filename,handler:(req,res)=>{
        if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405,{Allow:'GET, HEAD'}); res.end(); return; }
        const bytes = readFileSync(new URL('./font-assets/'+filename,import.meta.url));
        res.writeHead(200,{'Content-Type':'font/woff2','Content-Length':bytes.length,'Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'});
        res.end(req.method === 'HEAD' ? undefined : bytes);
      }}));
    }
  });
  ctx.inject(['settings'], child => {
    child.effect(() => child.settings.configure({auto:false}, ctx.fiber));
  });
  ctx.on('webserver/index-inject', table => {
    const selected = THEMES.find(t => t.id === config.theme.get());
    const effective = selected && customize(selected, {accent:config.accent.get(),background:config.background.get(),foreground:config.foreground.get()});
    const tokens = {...(effective ? tokensFor(effective, config.polish.get()) : {}),...fontTokens({font:config.font.get(),codeFont:config.codeFont.get()})};
    if (!Object.keys(tokens).length) return;
    table.push({kind:'style', text:`/*dsh-theme-studio:bootstrap*/${effective?':root{color-scheme:dark}':''}body{${effective?'background:'+effective.p.bg+';':''}${Object.entries(tokens).map(([k,v]) => `${k}:${v}`).join(';')}}`});
  });
}
