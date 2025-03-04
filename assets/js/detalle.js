document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = parseInt(urlParams.get("id"));

    Promise.all([
        fetch("data/books.json").then(response => response.json()),
        fetch("data/grupos.json").then(response => response.json())
    ])
    .then(([libros, grupos]) => {
        const libro = libros.find(l => l.id === libroId);
        if (!libro) return;

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
            sinopsisElemento.textContent = libro.sinopsis;
        } else {
            sinopsisElemento.style.display = "none"; // 🔹 Ocultar si no hay sinopsis
        }

        // 📌 Mostrar colección si existe
        let grupo = grupos.find(g => g.libros_id.includes(libro.id));
        let coleccionElemento = document.getElementById("coleccion");

        if (grupo) {
            coleccionElemento.innerHTML = 
                `Colección: <a href="grupos.html?id=${grupo.id}">${grupo.nombre}</a>`;
        } else {
            coleccionElemento.style.display = "none"; // 🔹 Si no tiene colección, ocultar
        }

        // 📌 Cargar libros relacionados
        cargarLibrosRelacionados(libro, libros);
    })
    .catch(error => console.error("Error al cargar los datos:", error));
});

function cargarLibrosRelacionados(libro, libros) {
    const relacionados = libros.filter(l => 
        (l.coleccion === libro.coleccion || libro.palabras_clave.some(k => l.palabras_clave.includes(k))) &&
        l.id !== libro.id // 🔹 Evita mostrar el mismo libro
    );

    const contenedor = document.querySelector(".relacionados-container");
    contenedor.innerHTML = ""; // 🔹 Limpia antes de agregar nuevos

    if (relacionados.length === 0) {
        contenedor.innerHTML = "<p>No hay libros relacionados.</p>";
        return;
    }

    relacionados.forEach(lib => {
        let libroHTML = document.createElement("div");
        libroHTML.classList.add("book", `tema-${lib.tema}`); // 🔹 Aplica el tema
        libroHTML.innerHTML = `
            <a href="detalle.html?id=${lib.id}">
                <img src="${lib.imagen}" alt="${lib.titulo}" class="portada">
            </a>
            <h2>${lib.titulo}</h2>
            <p>${lib.subtitulo}</p>
        `;
        contenedor.appendChild(libroHTML);

        // 📌 Extraer color de la portada y aplicarlo como fondo
        const img = libroHTML.querySelector(".portada");
        img.crossOrigin = "anonymous";
        img.onload = function () {
            try {
                const colorThief = new ColorThief();
                const color = colorThief.getColor(img);
                const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                libroHTML.style.backgroundColor = rgbColor;
                libroHTML.style.boxShadow = `0px 0px 10px ${rgbColor}`;
            } catch (error) {
                console.error("Error al extraer color con Color Thief:", error);
            }
        };
    });
}
