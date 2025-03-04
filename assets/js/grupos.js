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

        document.getElementById("nombre-coleccion").textContent = grupo.nombre;

        let contenedor = document.querySelector(".coleccion-libros");
        contenedor.innerHTML = "";

        grupo.libros_id.forEach(id => {
            let libro = libros.find(l => l.id === id);
            if (libro) {
                let libroHTML = document.createElement("div");
                libroHTML.classList.add("book");
                libroHTML.innerHTML = `
                    <a href="detalle.html?id=${libro.id}">
                        <img src="${libro.imagen}" alt="${libro.titulo}" class="portada">
                    </a>
                    <h3>${libro.titulo}</h3>
                    <p>${libro.subtitulo}</p>
                `;
                contenedor.appendChild(libroHTML);
            }
        });
    })
    .catch(error => console.error("Error al cargar datos:", error));
});
