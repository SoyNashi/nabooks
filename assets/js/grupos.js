document.addEventListener("DOMContentLoaded", () => {
    Promise.all([
        fetch("data/books.json").then(response => response.json()),
        fetch("data/grupos.json").then(response => response.json())
    ])
    .then(([libros, grupos]) => {
        mostrarGrupos(libros, grupos);
    })
    .catch(error => console.error("Error al cargar datos:", error));
});

// 📌 Mostrar Grupos en `grupos.html`
function mostrarGrupos(libros, grupos) {
    const contenedor = document.getElementById("colecciones-container");
    contenedor.innerHTML = "";

    grupos.forEach(grupo => {
        let coleccionHTML = document.createElement("div");
        coleccionHTML.classList.add("coleccion", `tema-${grupo.tema}`);
        coleccionHTML.innerHTML = `
            <h2>${grupo.nombre}</h2>
            <div class="coleccion-libros">
                ${grupo.libros_id.map(id => {
                    let libro = libros.find(l => l.id === id);
                    return libro ? `<a href="detalle.html?id=${libro.id}">
                        <img src="${libro.imagen}" alt="${libro.titulo}" title="${libro.titulo}">
                    </a>` : "";
                }).join("")}
            </div>
        `;
        contenedor.appendChild(coleccionHTML);
    });
}
