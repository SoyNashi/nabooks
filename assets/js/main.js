document.addEventListener("DOMContentLoaded", function () {
    const booksContainer = document.getElementById("books-container");
    const searchInput = document.getElementById("search");
    const filterLanguage = document.getElementById("filter-language");

    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            mostrarLibros(libros);

            // Filtro de búsqueda en tiempo real
            searchInput.addEventListener("input", () => filtrarLibros(libros));
            filterLanguage.addEventListener("change", () => filtrarLibros(libros));
        })
        .catch(error => console.error("Error cargando libros:", error));

    function mostrarLibros(libros) {
        booksContainer.innerHTML = "";
        libros.forEach(libro => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book-card");

            // Solo agrega la clase si `libro.decoracion` tiene un valor válido
            if (libro.decoracion && libro.decoracion.trim() !== "") {
                bookElement.classList.add(libro.decoracion);
            }

            bookElement.id = `book-${libro.id}`;
            bookElement.innerHTML = `
                <h2>${libro.titulo}</h2>
                <img src="${libro.imagen}" alt="Portada de ${libro.titulo}">
                <p>${libro.autor}</p>
            `;
            booksContainer.appendChild(bookElement);
        });
    }   


    function filtrarLibros(libros) {
        const query = searchInput.value.toLowerCase();
        const idioma = filterLanguage.value;
        const librosFiltrados = libros.filter(libro =>
            libro.titulo.toLowerCase().includes(query) &&
            (idioma === "all" || libro.idioma === idioma)
        );
        mostrarLibros(librosFiltrados);
    }
});
