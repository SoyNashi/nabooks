// --- CONFIG FIJA PARA TU REPO ---
const OWNER = "SoyNashi";
const REPO = "nabooks";
const ROOT_PATH = "data";

// ELEMENTOS
const treeEl = document.getElementById("tree");
const previewArea = document.getElementById("previewArea");
const currentPathEl = document.getElementById("currentPath");

// LISTAR CONTENIDOS DE CARPETA
async function listDir(path) {
  const apiUrl =
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/` +
    encodeURIComponent(path);

  const res = await fetch(apiUrl);
  if (!res.ok) return [];

  const arr = await res.json();

  return arr.map(item => ({
    type: item.type,
    name: item.name,
    path: item.path,
    raw: item.download_url
  }));
}

// CREAR NODO DEL ÁRBOL
function makeNode(item) {
  const li = document.createElement("li");
  li.classList.add(item.type === "dir" ? "folder" : "file");
  li.textContent = item.name;

  if (item.type === "dir") {
    li.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      if (li._loaded) {
        li._children.style.display =
          li._children.style.display === "none" ? "block" : "none";
        return;
      }

      const ul = document.createElement("ul");
      ul.innerHTML = "<li>Cargando...</li>";
      li.appendChild(ul);
      li._children = ul;

      const children = await listDir(item.path);
      ul.innerHTML = "";
      children.sort((a,b)=> a.type===b.type ? a.name.localeCompare(b.name) : a.type==="dir"? -1:1);

      for (const child of children) ul.appendChild(makeNode(child));
      li._loaded = true;
    });
  } else {
    li.addEventListener("click", (ev)=>{
      ev.stopPropagation();
      openFile(item);
    });
  }

  return li;
}

// MOSTRAR ARCHIVO
async function openFile(item) {
  currentPathEl.textContent = item.path;
  previewArea.innerHTML = "";

  try {
    const res = await fetch(item.raw);
    const text = await res.text();
    const ext = item.name.split(".").pop().toLowerCase();

    if (ext === "md") {
      const safe = DOMPurify.sanitize(marked.parse(text));
      const html = `
        <html>
        <head><meta charset="utf-8">
        <style>
        body{font-family:sans-serif;padding:15px;line-height:1.6}
        </style></head>
        <body>${safe}</body>
        </html>`;
      const iframe = sandboxFrame(html);
      previewArea.appendChild(iframe);

    } else if (ext === "html") {
      const iframe = sandboxFrame(text);
      previewArea.appendChild(iframe);

    } else if (["png","jpg","jpeg","gif","webp","svg"].includes(ext)) {
      const img = document.createElement("img");
      img.src = item.raw;
      img.style.maxWidth = "100%";
      previewArea.appendChild(img);

    } else {
      const safe = DOMPurify.sanitize(text).replace(/\n/g, "<br>");
      const html = `
        <html><body style="font-family:monospace;padding:15px;">${safe}</body></html>`;
      const iframe = sandboxFrame(html);
      previewArea.appendChild(iframe);
    }
  } catch (e) {
    previewArea.innerHTML = "Error cargando archivo";
  }
}

// IFRAMES AISLADOS
function sandboxFrame(html) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts allow-forms");
  iframe.srcdoc = html;
  return iframe;
}

// CARGAR RAÍZ
(async function init(){
  const children = await listDir(ROOT_PATH);

  const rootUl = document.createElement("ul");
  children.sort((a,b)=> a.type===b.type ? a.name.localeCompare(b.name) : a.type==="dir"? -1:1);
  children.forEach(child => rootUl.appendChild(makeNode(child)));

  treeEl.appendChild(rootUl);
})();
