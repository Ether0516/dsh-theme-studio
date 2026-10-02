const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname,'..');
const {THEMES,tokensFor} = require('../src/palettes.cjs');

// Exercise the real ThemeRuntime shipped with Dsh, without relying on an
// extracted file outside the public repository.
const {source:runtimeSource,filename:runtimePath} = require('./load-theme-runtime.cjs').readThemeRuntime();
function runtimeClass() {
  let exported;
  const window = {__ModuleLoader__:{load:entry=>{exported=entry.factory(()=>({}));}}};
  vm.runInNewContext(runtimeSource,{window,console},{filename:runtimePath});
  return exported.ThemeRuntime;
}
function fixture(value={theme:'catppuccin-mocha',polish:true}) {
  const bus = new Map();
  const on = (event,listener) => { if(!bus.has(event))bus.set(event,new Set());bus.get(event).add(listener);return()=>bus.get(event).delete(listener); };
  const ctx = {on,emit:(event,payload)=>{for(const l of [...(bus.get(event)||[])])l(payload);},effect:fn=>fn()};
  const native = {value:{preference:'dark',fontSize:14}};
  const nativeListeners = new Set();
  const nativeForm = {getSnapshot:()=>native,subscribe:l=>{nativeListeners.add(l);return()=>nativeListeners.delete(l);},set:()=>{}};
  ctx.theme = new (runtimeClass())(ctx,nativeForm);
  const formListeners=new Set();
  const form = {getSnapshot:()=>({value,writable:true,status:'ready'}),subscribe:l=>{formListeners.add(l);return()=>formListeners.delete(l);},mutate:async ops=>{value={...value};for(const op of ops)value[op.path[0]]=op.value;for(const l of formListeners)l();return true;}};
  ctx.configForms={get:id=>id==='ui-theme'?nativeForm:form};
  const attributes={};
  const body={dataset:{},toggleAttribute:(key,yes)=>yes?attributes[key]='':delete attributes[key],removeAttribute:key=>delete attributes[key]};
  let exported;
  vm.runInNewContext(fs.readFileSync(path.join(root,'lib/client.js'),'utf8'),{window:{__ModuleLoader__:{load:entry=>{exported=entry.factory(()=>({}));}}},document:{body},queueMicrotask,console},{filename:'client.js'});
  return {ctx,form,body,controller:new exported.ThemeController(ctx),native,nativeListeners,getValue:()=>value};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
test('all four palettes preserve readable text, secondary labels and accent buttons',()=>{
  function luminance(hex){const rgb=hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];}
  function contrast(a,b){const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(values[0]+.05)/(values[1]+.05);}
  for(const theme of THEMES){assert.ok(contrast(theme.p.text,theme.p.bg)>=4.5,theme.name+' body');assert.ok(contrast(theme.p.muted,theme.p.panel)>=4.5,theme.name+' secondary');assert.ok(contrast(theme.p.accent,theme.p.inset)>=4.5,theme.name+' action');assert.equal(tokensFor(theme)['--shiki-token-string'],theme.p.green);}
});
test('persisted selection loads, survives font-size adoption and restores the built-in palette on unload',async()=>{
  const f=fixture({theme:'dracula',polish:true});
  assert.equal(f.ctx.theme.getTheme().active.tokens['--dsw-alias-bg-base'],'#282a36');
  f.native.value={preference:'dark',fontSize:17};for(const l of f.nativeListeners)l();await settle();
  assert.equal(f.ctx.theme.getTheme().active.id,'theme-studio/dracula');assert.equal(f.ctx.theme.getTheme().fontSize,17);
  f.controller.dispose();await settle();assert.equal(f.ctx.theme.getTheme().preference,'dark');assert.equal(f.ctx.theme.getTheme().active.tokens['--dsw-alias-bg-base'],undefined);
  assert.equal(f.ctx.theme.getTheme().themes.length,2);
});
test('theme switching saves atomically and built-in selections remove custom styling',async()=>{
  const f=fixture();await f.controller.update({theme:'one-dark'});assert.equal(f.getValue().theme,'one-dark');assert.equal(f.ctx.theme.getTheme().active.tokens['--dsw-specific-sidebar-fill'],'#21252b');
  await f.controller.update({theme:'dsh-dark'});await settle();assert.equal(f.ctx.theme.getTheme().preference,'dark');assert.equal(f.ctx.theme.getTheme().active.tokens['--dsw-radius-md'],undefined);
  await f.controller.update({theme:'dsh-light'});await settle();assert.equal(f.ctx.theme.getTheme().preference,'light');f.controller.dispose();
});
test('a rejected write rolls back the visible theme and exposes a useful error',async()=>{
  const f=fixture();f.form.mutate=async()=>false;await f.controller.update({theme:'dracula'});await settle();assert.equal(f.controller.getSnapshot().theme,'catppuccin-mocha');assert.match(f.controller.getSnapshot().error,/未能保存/);f.controller.dispose();
});
test('rapid consecutive choices leave the most recent choice active',async()=>{
  const f=fixture();let tail=Promise.resolve();const real=f.form.mutate;
  f.form.mutate=ops=>{const owned=structuredClone(ops);const task=tail.then(async()=>{await settle();return real(owned);});tail=task;return task;};
  await Promise.all([f.controller.update({theme:'dracula'}),f.controller.update({theme:'one-dark'})]);
  await settle();assert.equal(f.getValue().theme,'one-dark');assert.equal(f.ctx.theme.getTheme().active.id,'theme-studio/one-dark');f.controller.dispose();
});
test('custom colors persist, rehydrate, and are cleared when changing theme',async()=>{
  const f=fixture();await f.controller.update({accent:'#ff9900',background:'#202020',foreground:'#eeeeee'});
  let tokens=f.ctx.theme.getTheme().active.tokens;
  assert.equal(tokens['--dsw-alias-brand-primary'],'#ff9900');assert.equal(tokens['--dsw-alias-bg-base'],'#202020');assert.equal(tokens['--dsw-alias-label-primary'],'#eeeeee');
  const value=f.getValue();f.controller.dispose();const restored=fixture(value);assert.equal(restored.ctx.theme.getTheme().active.tokens['--dsw-alias-brand-primary'],'#ff9900');
  await restored.controller.update({theme:'dracula'});assert.equal(restored.getValue().accent,'');assert.equal(restored.ctx.theme.getTheme().active.tokens['--dsw-alias-brand-primary'],'#bd93f9');restored.controller.dispose();
});
test('invalid color values do not reach the theme registry or durable settings',async()=>{
  const f=fixture();await f.controller.update({background:'url(https://example.invalid)'});assert.equal(f.getValue().background,undefined);assert.equal(f.ctx.theme.getTheme().active.tokens['--dsw-alias-bg-base'],'#1e1e2e');f.controller.dispose();
});
test('native light/dark selections leave native colors intact and keep custom fonts',async()=>{
  const f=fixture();await f.controller.update({font:'jetbrains-nerd',codeFont:'jetbrains-mono'});
  for(const [theme,preference] of [['dsh-light','light'],['dsh-dark','dark']]) {
    await f.controller.update({theme});await settle();const active=f.ctx.theme.getTheme().active;
    assert.equal(active.id,preference);assert.equal(active.tokens['--dsw-alias-bg-base'],undefined);
    assert.match(active.tokens['--dsw-font-family'],/Dsh JetBrains Mono Nerd/);
    assert.equal(active.tokens['--ts-code-ligatures'],'normal');
    assert.equal(f.getValue().font,'jetbrains-nerd');
  }
  const saved=f.getValue();f.controller.dispose();assert.equal(f.ctx.theme.getTheme().active.tokens['--dsw-font-family'],undefined);
  const reload=fixture(saved);assert.equal(reload.ctx.theme.getTheme().active.id,'dark');assert.match(reload.ctx.theme.getTheme().active.tokens['--ds-font-family-code'],/Dsh JetBrains Mono/);reload.controller.dispose();
});
test('font changes roll back on write failure, reject unknown fonts and reset to native defaults',async()=>{
  const f=fixture();await f.controller.update({font:'yahei',codeFont:'jetbrains-nerd'});
  const mutate=f.form.mutate;f.form.mutate=async()=>false;await f.controller.update({font:'jetbrains-mono'});
  assert.equal(f.controller.getSnapshot().font,'yahei');assert.match(f.ctx.theme.getTheme().active.tokens['--dsw-font-family'],/Microsoft YaHei/);
  f.form.mutate=mutate;await f.controller.update({font:'unknown'});assert.equal(f.getValue().font,'yahei');
  await f.controller.update({font:'system',codeFont:'system'});assert.equal(f.ctx.theme.getTheme().active.tokens['--dsw-font-family'],undefined);assert.equal(f.ctx.theme.getTheme().active.tokens['--ds-font-family-code'],undefined);f.controller.dispose();
});
test('removed variants migrate to the two remaining JetBrains families',()=>{
  const f=fixture({theme:'dracula',font:'jetbrains-mono-nl',codeFont:'jetbrains-nerd-propo'});
  assert.equal(f.controller.getSnapshot().font,'jetbrains-mono');assert.equal(f.controller.getSnapshot().codeFont,'jetbrains-nerd');f.controller.dispose();
});
test('host uses the actual webServer service and serves all bundled font files',()=>{
  const fonts=require('../src/fonts.cjs');const palettes=require('../src/palettes.cjs');
  const chain={default:()=>chain,volatile:()=>chain,pattern:()=>chain};
  const z={object:v=>v,union:()=>chain,boolean:()=>chain,string:()=>chain};
  const routes=new Map();const dispose=[];
  const ctx={fiber:{},on:()=>{},effect:fn=>dispose.push(fn()),webServer:{register:route=>{routes.set(route.path,route);return()=>routes.delete(route.path);}},settings:{configure:()=>()=>{}}};
  ctx.inject=(names,fn)=>{if(names.every(name=>name in ctx))fn(ctx);};
  const url=require('node:url').pathToFileURL(path.join(root,'lib/index.js')).href;
  const source=fs.readFileSync(path.join(root,'lib/index.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/export /g,'').replaceAll('import.meta.url',JSON.stringify(url));
  vm.runInNewContext(source+'\napply(ctx,{});',{z,readFileSync:fs.readFileSync,...fonts,...palettes,URL,ctx});
  assert.equal(routes.size,8,'font routes must activate with the public webServer service');
  for(const route of routes.values()) {
    let status,headers,body;const res={writeHead:(code,value)=>{status=code;headers=value;},end:value=>body=value};
    route.handler({method:'GET'},res);assert.equal(status,200);assert.equal(headers['Content-Type'],'font/woff2');assert.equal(body.toString('ascii',0,4),'wOF2');assert.equal(headers['Content-Length'],body.length);
    route.handler({method:'HEAD'},res);assert.equal(status,200);assert.equal(body,undefined);
    route.handler({method:'POST'},res);assert.equal(status,405);
  }
  for(const off of dispose.reverse())if(typeof off==='function')off();assert.equal(routes.size,0);
});
