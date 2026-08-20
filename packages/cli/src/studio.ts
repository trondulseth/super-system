import { createServer } from "node:http";
import { exec } from "node:child_process";
import { readConfig, writeConfig } from "./files.js";
import { checkThemeContrast, validateConfig } from "@super-system/tokens";

function openBrowser(url: string): void {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${command} ${JSON.stringify(url)}`);
}

function html(): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Super System Studio</title>
<style>
:root{font-family:Inter,system-ui,sans-serif;color:#111827;background:#eef2f7}*{box-sizing:border-box}body{margin:0}button,input,select{font:inherit}
header{height:64px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #dbe2ea;position:sticky;top:0;z-index:2}
main{display:grid;grid-template-columns:minmax(300px,390px) 1fr;min-height:calc(100vh - 64px)}aside{background:#fff;border-right:1px solid #dbe2ea;padding:24px;overflow:auto}.preview{padding:clamp(24px,5vw,72px);display:grid;place-items:center}
h1{font-size:18px;margin:0}h2{font-size:14px;margin:28px 0 12px}label{display:grid;gap:6px;font-size:12px;font-weight:700;margin:12px 0;color:#334155}input,select{width:100%;min-height:40px;border:1px solid #cbd5e1;border-radius:8px;padding:8px;background:#fff;color:#111827}
.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.actions{display:flex;gap:8px}.save,.theme-toggle{min-height:40px;border:0;border-radius:8px;padding:0 14px;font-weight:700;cursor:pointer}.save{background:#2563eb;color:#fff}.theme-toggle{background:#e2e8f0;color:#172033}
.canvas{width:min(740px,100%);padding:32px;border-radius:var(--radius);background:var(--bg);color:var(--fg);border:1px solid var(--border);box-shadow:0 18px 60px #0f172a18}.canvas h3{font-size:28px;margin:0 0 8px}.canvas p{color:var(--muted-fg);margin:0 0 24px}.demo{display:flex;flex-wrap:wrap;gap:12px}.demo button{min-height:var(--target);padding:0 var(--pad);border-radius:var(--radius);font-weight:700;border:1px solid transparent}.primary{background:var(--primary);color:var(--primary-fg)}.secondary{background:var(--secondary);color:var(--secondary-fg);border-color:var(--border)!important}.field{margin-top:22px}.field input{background:var(--bg);color:var(--fg);border-color:var(--border)}
#checks{display:grid;gap:6px;margin-top:22px;font-size:12px}.check{display:flex;justify-content:space-between;padding:8px;border-radius:7px;background:var(--secondary)}.pass{color:#15803d}.fail{color:#b91c1c;font-weight:800}#status{font-size:12px;color:#475569}@media(max-width:800px){main{grid-template-columns:1fr}aside{border-right:0}.preview{min-height:600px}}
</style></head><body>
<header><h1>Super System <span style="color:#64748b;font-weight:500">Studio</span></h1><div class="actions"><span id="status"></span><button class="theme-toggle" id="toggle">Dark preview</button><button class="save" id="save">Save theme</button></div></header>
<main><aside><h2>Brand</h2><label>Primary color<input id="primary" type="color"></label><label>Primary text<input id="primaryForeground" type="color"></label><div class="row"><label>Background<input id="background" type="color"></label><label>Text<input id="foreground" type="color"></label></div><div class="row"><label>Secondary<input id="secondary" type="color"></label><label>Secondary text<input id="secondaryForeground" type="color"></label></div>
<h2>Typography and shape</h2><label>Font family<input id="fontSans"></label><div class="row"><label>Base size<input id="baseSize"></label><label>Medium radius<input id="radiusMd"></label></div><div class="row"><label>Density<select id="density"><option>compact</option><option>comfortable</option><option>spacious</option></select></label><label>Icon library<select id="icons"><option>lucide</option><option>phosphor</option><option>heroicons</option><option>custom</option></select></label></div>
<h2>Accessibility</h2><div class="row"><label>Contrast<select id="contrast"><option>AA</option><option>AAA</option></select></label><label>Minimum target<input id="target" type="number" min="24" max="64"></label></div></aside>
<section class="preview"><article class="canvas"><h3>Build consistent products</h3><p>Every component follows the same theme, spacing, and accessibility rules.</p><div class="demo"><button class="primary">Primary action</button><button class="secondary">Secondary</button></div><label class="field">Email address<input placeholder="you@example.com"></label><div id="checks"></div></article></section></main>
<script>
let config, preview='light'; const ids=['primary','primaryForeground','background','foreground','secondary','secondaryForeground'];
const $=id=>document.getElementById(id); const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function load(){config=await fetch('/api/config').then(r=>r.json()); fill(); render()}
function fill(){const c=config.themes[preview]; ids.forEach(id=>$(id).value=c[id]); $('fontSans').value=config.typography.fontSans;$('baseSize').value=config.typography.baseSize;$('radiusMd').value=config.radius.md;$('density').value=config.spacing.density;$('icons').value=config.icons.library;$('contrast').value=config.accessibility.contrast;$('target').value=config.accessibility.minimumTargetSize}
function collect(){const c=config.themes[preview];ids.forEach(id=>c[id]=$(id).value);config.typography.fontSans=$('fontSans').value;config.typography.baseSize=$('baseSize').value;config.radius.md=$('radiusMd').value;config.spacing.density=$('density').value;config.icons.library=$('icons').value;config.accessibility.contrast=$('contrast').value;config.accessibility.minimumTargetSize=Number($('target').value)}
async function render(){collect();const c=config.themes[preview],root=document.documentElement;root.style.setProperty('--bg',c.background);root.style.setProperty('--fg',c.foreground);root.style.setProperty('--primary',c.primary);root.style.setProperty('--primary-fg',c.primaryForeground);root.style.setProperty('--secondary',c.secondary);root.style.setProperty('--secondary-fg',c.secondaryForeground);root.style.setProperty('--muted-fg',c.mutedForeground);root.style.setProperty('--border',c.border);root.style.setProperty('--radius',config.radius.md);root.style.setProperty('--target',config.accessibility.minimumTargetSize+'px');root.style.setProperty('--pad',(config.spacing.unit*(config.spacing.density==='compact'?3:config.spacing.density==='spacious'?5:4))+'px');const checks=await fetch('/api/contrast',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(config)}).then(r=>r.json());$('checks').innerHTML=checks.filter(x=>x.theme===preview).map(x=>'<div class="check"><span>'+esc(x.pair)+'</span><span class="'+(x.passes?'pass':'fail')+'">'+x.ratio+':1 '+(x.passes?'Pass':'Fail')+'</span></div>').join('')}
document.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',render));$('toggle').onclick=()=>{collect();preview=preview==='light'?'dark':'light';$('toggle').textContent=preview==='light'?'Dark preview':'Light preview';fill();render()};$('save').onclick=async()=>{collect();const res=await fetch('/api/config',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(config)});$('status').textContent=res.ok?'Saved':'Could not save';setTimeout(()=>$('status').textContent='',1800)};load();
</script></body></html>`;
}

async function body(request: import("node:http").IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function startStudio(cwd: string, port = 4173, launch = true): Promise<void> {
  const server = createServer(async (request, response) => {
    try {
      if (request.url === "/api/config" && request.method === "GET") {
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify(await readConfig(cwd)));
      } else if (request.url === "/api/config" && request.method === "POST") {
        const config = validateConfig(await body(request));
        await writeConfig(cwd, config);
        response.end("ok");
      } else if (request.url === "/api/contrast" && request.method === "POST") {
        response.setHeader("content-type", "application/json");
        response.end(JSON.stringify(checkThemeContrast(validateConfig(await body(request)))));
      } else {
        response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(html());
      }
    } catch (error) {
      response.statusCode = 400;
      response.end(error instanceof Error ? error.message : "Unknown error");
    }
  });
  await new Promise<void>((resolve) => server.listen(port, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${port}`;
  console.log(`Super System Studio: ${url}`);
  console.log("Press Ctrl+C to stop.");
  if (launch) openBrowser(url);
}
