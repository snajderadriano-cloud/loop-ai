import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
let html=read('index.html');let script=['content.mjs','engine.mjs','coach.mjs','mastery.mjs','app.mjs'].map(f=>read(f).replace(/^import .*;\s*$/gm,'').replace(/\bexport\s+(?=(const|function|class)\b)/g,'')).join('\n\n');
html=html.replace(/<link rel="manifest"[^>]*>/,'').replace(/<link rel="icon"[^>]*>/,'').replace('<link rel="stylesheet" href="./style.css">',`<style>${read('style.css')}
${read('studio.css')}</style>`).replace('<script type="module" src="./app.mjs"></script>',`<script>${script.replaceAll('</script>','<\\/script>')}</script>`);
const output=path.resolve(root,'..','loop-ai-standalone.html');fs.writeFileSync(output,html);console.log('Created '+output+' ('+Math.round(html.length/1024)+'kB)');
