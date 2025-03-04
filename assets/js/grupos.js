document.addEventListener("DOMContentLoaded", () => {
    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const colecciones = agruparPorColeccion(libros);
            mostrarColecciones(colecciones);
        })
        .catch(error => console.error("Error al cargar libros:", error));
});

// 📌 Agrupar libros por colección
function agruparPorColeccion(libros) {
    const colecciones = {};
    libros.forEach(libro => {
        if (!colecciones[libro.coleccion]) {
            colecciones[libro.coleccion] = { 
                nombre: libro.coleccion, 
                tema: libro.tema,
                libros: [] 
            };
        }
        colecciones[libro.coleccion].libros.push(libro);
    });
    return Object.values(colecciones);
}

// 📌 Mostrar colecciones en grupos.html
function mostrarColecciones(colecciones) {
    const contenedor = document.getElementById("colecciones-container");
    contenedor.innerHTML = "";

    colecciones.forEach(coleccion => {
        let coleccionHTML = document.createElement("div");
        coleccionHTML.classList.add("coleccion", coleccion.tema);
        coleccionHTML.innerHTML = `
            <h2>${coleccion.nombre}</h2>
            <div class="coleccion-libros">
                ${coleccion.libros.map(libro => `
                    <a href="detalle.html?id=${libro.id}">
                        <img src="${libro.imagen}" alt="${libro.titulo}" title="${libro.titulo}">
                    </a>
                `).join("")}
            </div>
        `;
        contenedor.appendChild(coleccionHTML);
    });
}
