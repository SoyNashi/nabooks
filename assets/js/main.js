document.addEventListener("DOMContentLoaded", () => {
    Promise.all([
        fetch("data/books.json").then(response => response.json()),
        fetch("data/grupos.json").then(response => response.json())
    ])
    .then(([libros, grupos]) => {
        mostrarLibros(libros, grupos);
    })
    .catch(error => console.error("Error al cargar datos:", error));
});

// 📌 Mostrar libros en `index.html`
function mostrarLibros(libros, grupos) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    libros.forEach(book => {
        // Encontrar la colección a la que pertenece el libro
        let grupo = grupos.find(g => g.libros_id.includes(book.id));
        let coleccionNombre = grupo ? grupo.nombre : "Independiente";

        const bookItem = document.createElement("div");
        bookItem.classList.add("book", `tema-${book.tema}`);
        bookItem.innerHTML = `
            <img src="${book.imagen}" alt="${book.titulo}" class="portada">
            <h2>${book.titulo}</h2>
            <p>${book.subtitulo}</p>
            <p><strong>$${book.precio}</strong></p>
            <p class="coleccion">Colección: ${coleccionNombre}</p>
            <a href="detalle.html?id=${book.id}">Ver más</a>
        `;
        bookList.appendChild(bookItem);
    });
}

    // Filtros de búsqueda
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book => 
            book.titulo.toLowerCase().includes(query) || 
            book.subtitulo.toLowerCase().includes(query)
        );
        displayBooks(filteredBooks);
    });

    // Ordenar libros
    filterSelect.addEventListener("change", () => {
        const sortedBooks = [...books];
        if (filterSelect.value === "titulo") {
            sortedBooks.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (filterSelect.value === "precio") {
            sortedBooks.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
        } else {
            sortedBooks.sort((a, b) => b.id - a.id); // Orden por fecha (ID)
        }
        displayBooks(sortedBooks);
    });

