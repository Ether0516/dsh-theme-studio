const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

// Use the user's installed Dsh runtime, without distributing a private
// extracted snapshot or relying on the author's workspace layout.
function readThemeRuntime() {
  if (process.env.DSH_THEME_RUNTIME) {
    return {source:fs.readFileSync(process.env.DSH_THEME_RUNTIME,'utf8'),filename:process.env.DSH_THEME_RUNTIME};
  }
  const local = process.env.LOCALAPPDATA || path.join(os.homedir(),'AppData','Local');
  const archive = process.env.DSH_APP_ASAR || path.join(local,'Programs','DeepSeek Harness','resources','app.asar');
  if (!fs.existsSync(archive)) throw new Error('Install Dsh Desktop, or set DSH_APP_ASAR to its resources/app.asar. You can also set DSH_THEME_RUNTIME to ui-theme/lib/client.js.');
  const fd = fs.openSync(archive,'r');
  try {
    const header = Buffer.alloc(16);
    fs.readSync(fd,header,0,16,0);
    const json = Buffer.alloc(header.readUInt32LE(12));
    fs.readSync(fd,json,0,json.length,16);
    const tree = JSON.parse(json.toString('utf8'));
    const filename = 'dsh/node_modules/@deepseek-ai/dsh-client-ui-theme/lib/client.js';
    const entry = name => {
      let node = tree;
      for (const part of name.split('/')) node = node?.files?.[part];
      if (!node) throw new Error('Dsh theme runtime not found in '+archive+'. Verify the supported Dsh version or set DSH_THEME_RUNTIME.');
      return node.link ? entry(node.link) : node;
    };
    const node = entry(filename);
    if (node.unpacked) return {source:fs.readFileSync(path.join(archive+'.unpacked',filename),'utf8'),filename};
    const bytes = Buffer.alloc(node.size);
    fs.readSync(fd,bytes,0,bytes.length,8+header.readUInt32LE(4)+Number(node.offset));
    return {source:bytes.toString('utf8'),filename};
  } finally { fs.closeSync(fd); }
}
module.exports = {readThemeRuntime};
