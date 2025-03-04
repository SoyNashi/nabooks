document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = parseInt(urlParams.get("id"));

    Promise.all([
        fetch("data/books.json").then(response => response.json()),
        fetch("data/grupos.json").then(response => response.json())
    ])
    .then(([libros, grupos]) => {
        const libro = libros.find(l => l.id === libroId);
        if (!libro) {
            console.error("Libro no encontrado");
            return;
        }

        document.getElementById("portada").src = libro.imagen;
        document.getElementById("titulo").textContent = libro.titulo;
        document.getElementById("subtitulo").textContent = libro.subtitulo;
        document.getElementById("descripcion").textContent = libro.descripcion;
        document.getElementById("precio").textContent = `Precio: $${libro.precio}`;
        document.getElementById("btn-tapa-blanda").href = libro.amazon;
        document.getElementById("btn-kindle").href = libro.amazon;

        // 📌 Mostrar sinopsis si existe
        let sinopsisElemento = document.getElementById("sinopsis");
        if (libro.sinopsis) {
            sinopsisElemento.innerHTML = libro.sinopsis.replace(/\n/g, "<br>"); // 🔹 Reemplaza saltos de línea
        } else {
            document.getElementById("sinopsis-container").style.display = "none"; // 🔹 Ocultar si no hay sinopsis
        }


        // 📌 Mostrar colección si existe
        let grupo = grupos.find(g => g.libros_id.includes(libro.id));
        let coleccionElemento = document.getElementById("coleccion");

        if (grupo) {
            coleccionElemento.innerHTML = 
                `Colección: <a href="grupos.html?id=${grupo.id}">${grupo.nombre}</a>`;
        } else {
            coleccionElemento.style.display = "none"; // 🔹 Ocultar si no tiene colección
        }

        // 📌 Cargar libros relacionados
        cargarLibrosRelacionados(libro, libros);
    })
    .catch(error => console.error("Error al cargar los datos:", error));
});

function cargarLibrosRelacionados(libro, libros) {
    const contenedor = document.querySelector(".relacionados-container");
    contenedor.innerHTML = ""; // 🔹 Limpia antes de agregar nuevos

    // 📌 Filtrar los libros relacionados (misma colección o palabras clave similares)
    const relacionados = libros.filter(l => 
        (l.coleccion === libro.coleccion || libro.palabras_clave.some(k => l.palabras_clave.includes(k))) &&
        l.id !== libro.id // 🔹 Evita mostrar el mismo libro
    );

    if (relacionados.length === 0) {
        contenedor.innerHTML = "<p>No hay libros relacionados.</p>";
        return;
    }

    relacionados.forEach(lib => {
        let libroHTML = document.createElement("div");
        libroHTML.classList.add("book");
        libroHTML.innerHTML = `
            <a href="detalle.html?id=${lib.id}">
                <img src="${lib.imagen}" alt="${lib.titulo}" class="portada">
            </a>
            <h3>${lib.titulo}</h3>
            <p>${lib.subtitulo}</p>
        `;
        contenedor.appendChild(libroHTML);
    });
}
