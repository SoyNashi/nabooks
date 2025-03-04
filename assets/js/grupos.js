document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const grupoId = parseInt(urlParams.get("id"));

    Promise.all([
        fetch("data/books.json").then(response => response.json()),
        fetch("data/grupos.json").then(response => response.json())
    ])
    .then(([libros, grupos]) => {
        const grupo = grupos.find(g => g.id === grupoId);
        if (!grupo) {
            document.getElementById("colecciones-container").innerHTML = "<h2>Grupo no encontrado</h2>";
            return;
        }

        // 📌 Generar fondo de colores basado en las portadas
        generarFondoDePortadas(grupo.libros_id, libros);

        // 📌 Mostrar los libros de la colección
        mostrarGrupo(grupo, libros);
    })
    .catch(error => console.error("Error al cargar datos:", error));
});

// 📌 Generar fondo dinámico con colores de portadas
function generarFondoDePortadas(librosId, libros) {
    let imagenes = librosId.map(id => {
        let libro = libros.find(l => l.id === id);
        return libro ? libro.imagen : null;
    }).filter(Boolean);

    let fondo = document.createElement("div");
    fondo.id = "fondo-dinamico";
    document.body.appendChild(fondo);

    imagenes.forEach(src => {
        let img = document.createElement("img");
        img.src = src;
        img.crossOrigin = "anonymous";
        img.onload = function () {
            let colorThief = new ColorThief();
            let color = colorThief.getColor(img);
            let rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            fondo.style.background = `linear-gradient(45deg, ${rgbColor}, rgba(0, 0, 0, 0.7))`;
        };
    });
}

// 📌 Mostrar solo los libros del grupo seleccionado
function mostrarGrupo(grupo, libros) {
    const contenedor = document.getElementById("colecciones-container");
    contenedor.innerHTML = `<h2>${grupo.nombre}</h2>`;

    let librosHTML = document.createElement("div");
    librosHTML.classList.add("coleccion-libros");

    grupo.libros_id.forEach(id => {
        let libro = libros.find(l => l.id === id);
        if (libro) {
            let libroHTML = `
                <a href="detalle.html?id=${libro.id}">
                    <img src="${libro.imagen}" alt="${libro.titulo}" title="${libro.titulo}">
                </a>
            `;
            librosHTML.innerHTML += libroHTML;
        }
    });

    contenedor.appendChild(librosHTML);
}
