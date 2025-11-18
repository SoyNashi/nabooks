// app.js - Explorador simple para GitHub Pages
// Soporta: GitHub REST API (repos públicos) o files.json manifest en la raíz.
// Encapsula previsualizaciones en iframe srcdoc sandbox.

const treeEl = document.getElementById('tree');
const previewArea = document.getElementById('previewArea');
const repoInput = document.getElementById('repoInput');
const loadRepoBtn = document.getElementById('loadRepo');
const useManifestBtn = document.getElementById('useManifest');
const currentPathEl = document.getElementById('currentPath');

let config = {};
const DEFAULT_CONFIG = {
  icons: {
    folder: "📁",
    file: "📄",
    md: "📝",
    html: "🌐",
    css: "🎨",
    js: "🟨",
    img: "🖼️",
    default: "📦"
  },
  fileButtonClass: "",
  folderButtonClass: ""
};

// helpers
function setConfig(c){ config = {...DEFAULT_CONFIG, ...c}; }
async function loadConfig(){
  try{
    const r = await fetch('config.json');
    if(!r.ok) throw new Error('no config.json');
    const j = await r.json();
    setConfig(j);
  }catch(e){
    setConfig(DEFAULT_CONFIG);
  }
}

// Render helpers
function makeTreeNode(item){
  // item: {type: 'file'|'dir', name, path, url?, children?}
  const li = document.createElement('li');
  li.dataset.path = item.path;
  li.classList.add(item.type === 'dir' ? 'folder' : 'file');
  const icon = document.createElement('span');
  const ext = item.name.split('.').pop().toLowerCase();
  let iconChar = config.icons.default;
  if(item.type === 'dir') iconChar = config.icons.folder;
  else if(ext === 'md') iconChar = config.icons.md;
  else if(ext === 'html') iconChar = config.icons.html;
  else if(ext === 'css') iconChar = config.icons.css;
  else if(ext === 'js') iconChar = config.icons.js;
  else if(['png','jpg','jpeg','gif','webp','svg'].includes(ext)) iconChar = config.icons.img;

  icon.textContent = iconChar;
  const nameSpan = document.createElement('span');
  nameSpan.textContent = item.name;
  nameSpan.style.marginLeft = "6px";

  li.appendChild(icon);
  li.appendChild(nameSpan);

  if(item.type === 'dir'){
    li.addEventListener('click', async (ev)=>{
      ev.stopPropagation();
      // toggle children: if already loaded, just toggle display
      if(li._loaded){
        const ul = li.querySelector('ul');
        if(ul) ul.style.display = ul.style.display === 'none' ? '' : 'none';
      }else{
        const ul = document.createElement('ul');
        ul.innerHTML = '<li class="small">Cargando...</li>';
        li.appendChild(ul);
        // fetch children via the currently used listing function
        const children = await listChildren(item.path);
        ul.innerHTML = '';
        children.sort((a,b)=> a.type===b.type? a.name.localeCompare(b.name): a.type==='dir'?-1:1);
        for(const child of children) {
          const childLi = makeTreeNode(child);
          ul.appendChild(childLi);
        }
        li._loaded = true;
      }
    });
  }else{
    li.addEventListener('click', (ev)=>{
      ev.stopPropagation();
      openFile(item);
    });
  }
  return li;
}

// --- Preview logic ---
function makeSandboxedIframe(html){
  // sandboxed iframe using srcdoc. No allow-same-origin so origin is unique -> encapsulado.
  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox','allow-scripts allow-forms allow-popups'); // no allow-same-origin, no top-navigation
  iframe.srcdoc = html;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  return iframe;
}

async function openFile(item){
  currentPathEl.textContent = item.path;
  previewArea.innerHTML = '';
  const ext = item.name.split('.').pop().toLowerCase();

  // Fetch raw content using item.raw_url if available, else construct via GitHub raw or local path
  let rawUrl = item.raw_url || item.url || item.path;
  try{
    let res;
    if(rawUrl.startsWith('http')){
      res = await fetch(rawUrl);
    }else{
      // local path (files.json manifest case): fetch relative
      res = await fetch(rawUrl);
    }
    if(!res.ok) throw new Error('no se pudo obtener el archivo');
    const text = await res.text();

    if(ext === 'md' || item.name.toLowerCase().endsWith('.markdown')){
      // markdown -> render to HTML, sanitize, then show inside iframe for full encapsulation of styles
      const rawHtml = marked.parse(text);
      const safe = DOMPurify.sanitize(rawHtml);
      const doc = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family: system-ui, -apple-system,Segoe UI,Roboto,Helvetica,Arial; padding:18px; line-height:1.6; color:#111}</style>
</head><body>${safe}</body></html>`;
      const iframe = makeSandboxedIframe(doc);
      previewArea.appendChild(iframe);
    }else if(ext === 'html'){
      // Put raw html inside srcdoc to ensure encapsulation.
      // If HTML references relative assets, GitHub raw URLs may be necessary; for local manifest the relative references won't resolve.
      const doc = text;
      const iframe = makeSandboxedIframe(doc);
      previewArea.appendChild(iframe);
    }else if(['png','jpg','jpeg','gif','webp','svg'].includes(ext)){
      // show image
      const img = document.createElement('img');
      // if item.raw_url provided use it; else create blob
      if(item.raw_url){
        img.src = item.raw_url;
      }else{
        // create blob from text (base64 not handled) — try to fetch as blob
        const r2 = await fetch(rawUrl);
        const blob = await r2.blob();
        img.src = URL.createObjectURL(blob);
      }
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      previewArea.appendChild(img);
    }else{
      // generic text preview inside iframe (so styles not leak)
      const safeText = DOMPurify.sanitize(escapeHtml(text)).replace(/\n/g, '<br>');
      const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <style>body{font-family:monospace;white-space:pre-wrap;padding:12px}</style></head><body>${safeText}</body></html>`;
      const iframe = makeSandboxedIframe(doc);
      previewArea.appendChild(iframe);
    }
  }catch(e){
    previewArea.innerHTML = `<div class="small">Error al cargar: ${e.message}</div>`;
  }
}

function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// --- Listing strategies ---
// We'll set a global function listChildren(path) depending on strategy used.
let listChildren = async (path)=>[]; // placeholder

// ---- Strategy A: GitHub REST API ----
function githubRawUrl(owner, repo, path){
  // raw content base
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`; // assumes main branch; you could make branch configurable
}
async function listRepoContentsApi(owner, repo, path=""){
  const base = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(base);
  if(!res.ok) throw new Error('Error GitHub API: ' + res.status);
  const arr = await res.json();
  // arr is array of items with {type, name, path, sha, url, download_url}
  return arr.map(it=>{
    return {
      type: it.type === 'dir' ? 'dir' : 'file',
      name: it.name,
      path: it.path,
      url: it.url,
      raw_url: it.download_url
    };
  });
}

// To recursively list children for a directory via API call each time: use listRepoContentsApi inside makeTreeNode click handling.
// We set listChildren to call the API accordingly.

loadRepoBtn.addEventListener('click', async ()=>{
  const val = repoInput.value.trim();
  if(!val || !val.includes('/')) return alert('Pon owner/repo (ej: usuario/mi-repo)');
  const [owner, repo] = val.split('/');
  // set listChildren to use API with provided owner/repo
  listChildren = async (path)=>{
    try{
      const items = await listRepoContentsApi(owner, repo, path || '');
      return items;
    }catch(e){
      console.error(e);
      return [];
    }
  };
  // load root
  await renderRootFromListChildren();
});

// ---- Strategy B: local manifest files.json ----
// files.json should be an array/tree e.g. [{type:'dir', name:'docs', path:'docs', children:[ ... ]}, ...]
async function loadManifest(){
  try{
    const r = await fetch('files.json');
    if(!r.ok) throw new Error('no manifest');
    const j = await r.json();
    // set listChildren to look up in the JSON tree
    const root = j;
    function findNodeByPath(p){
      if(!p || p === '') return {type:'dir', path:'', name:'/', children: root};
      const parts = p.split('/');
      let node = {children: root};
      for(const part of parts){
        if(!part) continue;
        node = (node.children || []).find(c => c.name === part);
        if(!node) return null;
      }
      return node;
    }
    listChildren = async (path)=>{
      const node = findNodeByPath(path);
      if(!node) return [];
      // return children + add raw_url pointing to path so fetch can get it from the repo
      return (node.children || []).map(it=>{
        // compute raw_url relative to repo
        return {
          type: it.type,
          name: it.name,
          path: (path? (path + '/' + it.name) : it.name),
          raw_url: it.raw_url || it.raw || it.path || it.path // optional
        };
      });
    };
    await renderRootFromListChildren();
  }catch(e){
    alert('No se pudo cargar files.json: '+e.message);
  }
}

useManifestBtn.addEventListener('click', async ()=> {
  await loadManifest();
});

// Render root (immediate children)
async function renderRootFromListChildren(){
  treeEl.innerHTML = '';
  const rootUl = document.createElement('ul');
  treeEl.appendChild(rootUl);
  const children = await listChildren('');
  children.sort((a,b)=> a.type===b.type? a.name.localeCompare(b.name): a.type==='dir'?-1:1);
  for(const child of children){
    const li = makeTreeNode(child);
    rootUl.appendChild(li);
  }
}

// initial
(async ()=>{
  await loadConfig();
  // try to load manifest by default if exists; else show hint
  const tryManifest = await fetch('files.json').then(r=>r.ok).catch(()=>false);
  if(tryManifest) loadManifest();
  else {
    treeEl.innerHTML = '<div class="small">Carga un repositorio público con owner/repo o añade files.json</div>';
    // default listChildren stays empty until user chooses
  }
})();
