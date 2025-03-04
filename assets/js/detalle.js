document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = parseInt(urlParams.get("id")); // 🔹 Convertimos a número

    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const libro = libros.find(l => l.id === libroId); // 🔹 Comparación numérica

            if (!libro) {
                document.querySelector("#detalle-container").innerHTML = "<h1>Libro no encontrado</h1>";
                return;
            }

            document.getElementById("portada").src = libro.imagen;
            document.getElementById("titulo").textContent = libro.titulo;
            document.getElementById("subtitulo").textContent = libro.subtitulo || "";
            document.getElementById("descripcion").textContent = libro.descripcion || "Descripción no disponible.";
            document.getElementById("precio").textContent = `Precio: $${libro.precio}`;

            document.getElementById("btn-tapa-blanda").href = libro.amazon; // 🔹 Se usa "amazon" para enlace
            document.getElementById("btn-kindle").href = libro.amazon; // 🔹 Se usa el mismo enlace

            cargarLibrosRelacionados(libro);
        })
        .catch(error => console.error("Error al cargar el libro:", error));
});
