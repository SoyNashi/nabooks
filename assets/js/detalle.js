document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = urlParams.get("id");

    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const libro = libros.find(l => l.id === libroId);

            if (!libro) {
                document.querySelector("#detalle-container").innerHTML = "<h1>Libro no encontrado</h1>";
                return;
            }

            document.getElementById("portada").src = libro.portada;
            document.getElementById("titulo").textContent = libro.titulo;
            document.getElementById("subtitulo").textContent = libro.subtitulo || "";
            document.getElementById("descripcion").textContent = libro.descripcion || "Descripción no disponible.";
            document.getElementById("precio").textContent = `Precio: $${libro.precio}`;

            document.getElementById("btn-tapa-blanda").href = libro.enlace_tapaBlanda;
            document.getElementById("btn-kindle").href = libro.enlace_kindle;

            cargarLibrosRelacionados(libro);
        })
        .catch(error => console.error("Error al cargar el libro:", error));
});

function cargarLibrosRelacionados(libro) {
    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const relacionados = libros.filter(l => l.coleccion === libro.coleccion || libro.palabrasClave.some(k => l.palabrasClave.includes(k)));

            const contenedor = document.querySelector(".relacionados-container");
            relacionados.forEach(lib => {
                if (lib.id !== libro.id) {
                    let libroHTML = `
                        <div class="libro-relacionado">
                            <a href="detalle.html?id=${lib.id}">
                                <img src="${lib.portada}" alt="${lib.titulo}">
                                <p>${lib.titulo}</p>
                            </a>
                        </div>
                    `;
                    contenedor.innerHTML += libroHTML;
                }
            });
        });
}
