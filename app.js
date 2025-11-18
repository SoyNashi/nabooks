// --- CONFIG DE TU REPO ---
const OWNER = "SoyNashi";
const REPO = "nabooks";
const ROOT_PATH = "data";

// ELEMENTOS
const treeEl = document.getElementById("tree");
const previewArea = document.getElementById("previewArea");
const currentPathEl = document.getElementById("currentPath");

// OCULTAR EXTENSIONES
const HIDE_EXT = ["json", "js", "css"];

// ---------------- LISTAR DIRECTORIO ---------------------
async function listDir(path) {
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/` + encodeURIComponent(path);

  const res = await fetch(apiUrl);
  if (!res.ok) return [];

  const arr = await res.json();

  return arr
    .filter(item => {
      if (item.type === "dir") return true;
      const ext = item.name.split(".").pop().toLowerCase();
      return !HIDE_EXT.includes(ext);
    })
    .map(item => ({
      type: item.type,
      name: item.name,
      displayName: removeExt(item.name),
      path: item.path,
      raw: item.download_url
    }));
}

function removeExt(name) {
  const i = name.lastIndexOf(".");
  if (i === -1) return name;
  return name.slice(0, i);
}

// -------------- CREAR NODO DEL ÁRBOL --------------------
function makeNode(item) {
  const li = document.createElement("li");
  li.classList.add(item.type === "dir" ? "folder" : "file");
  li.textContent = item.displayName;

  if (item.type === "dir") {
    li.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      await onFolderClick(li, item);
    });
  } else {
    li.addEventListener("click", (ev) => {
      ev.stopPropagation();
      openFile(item);
    });
  }

  return li;
}

// ---------- LÓGICA DE CARPETA: ABRIR INDEX.HTML SI EXISTE ----------
async function onFolderClick(li, item) {
  const children = await listDir(item.path);

  // Buscar index.html
  const indexFile = children.find(f => f.name.toLowerCase() === "index.html");

  // Abrir index.html si existe
  if (indexFile) {
    openFile(indexFile);
  }

  // Si ya estaba cargada → solo toggle de visibilidad
  if (li._loaded) {
    li._children.style.display =
      li._children.style.display === "none" ? "block" : "none";
    return;
  }

  // Expandir carpeta normalmente
  const ul = document.createElement("ul");
  li.appendChild(ul);
  li._children = ul;

  children.sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1
  );

  ul.innerHTML = "";
  children.forEach(child => ul.appendChild(makeNode(child)));
  li._loaded = true;
}

// --------------- MOSTRAR ARCHIVO -------------------------
async function openFile(item) {
  currentPathEl.textContent = item.path;
  previewArea.innerHTML = "";

  try {
    const res = await fetch(item.raw);
    const txt = await res.text();
    const ext = item.name.split(".").pop().toLowerCase();

    if (ext === "md") {
      const safe = DOMPurify.sanitize(marked.parse(txt));
      const html = `<html><body style="font-family:sans-serif;padding:20px;line-height:1.6">${safe}</body></html>`;
      previewArea.appendChild(sandboxFrame(html));

    } else if (ext === "html") {
      previewArea.appendChild(sandboxFrame(txt));

    } else if (["png","jpg","jpeg","gif","webp","svg"].includes(ext)) {
      const img = document.createElement("img");
      img.src = item.raw;
      img.classList.add("preview-img");
      previewArea.appendChild(img);

    } else {
      const safe = DOMPurify.sanitize(txt).replace(/\n/g, "<br>");
      previewArea.appendChild(sandboxFrame(`<html><body>${safe}</body></html>`));
    }

  } catch (err) {
    previewArea.innerHTML = "Error cargando archivo";
  }
}

// ---------------- IFRAME SEGURO --------------------------
function sandboxFrame(html) {
  const iframe = document.createElement("iframe");
  iframe.sandbox = "allow-scripts allow-forms";
  iframe.srcdoc = html;
  return iframe;
}

// ---------------- INICIO AUTOMÁTICO -----------------------
async function init() {
  const children = await listDir(ROOT_PATH);
  const ul = document.createElement("ul");

  children.sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1
  );

  children.forEach(child => ul.appendChild(makeNode(child)));
  treeEl.appendChild(ul);

  // Buscar INICIO.md y abrirlo
  const inicio = children.find(f => f.name.toLowerCase() === "inicio.md");
  if (inicio) openFile(inicio);
}

init();
