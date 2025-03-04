document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    fetch("data/books.json")
        .then(response => response.json())
        .then(books => {
            const book = books.find(b => b.id == bookId);
            if (!book) {
                document.getElementById("book-detail").innerHTML = "<p>Libro no encontrado</p>";
                return;
            }

            // Cargar detalles
            document.getElementById("book-title").textContent = book.titulo;
            document.getElementById("book-image").src = `assets/img/${book.imagen}`;
            document.getElementById("book-subtitle").textContent = book.subtitulo;
            document.getElementById("book-description").textContent = book.descripcion || "Descripción no disponible.";
            document.getElementById("book-price").textContent = book.precio;
            document.getElementById("buy-paperback").href = book.amazon;
            document.getElementById("buy-kindle").href = book.amazon; // 📌 Ajusta si hay URLs separadas

            // Cargar libros relacionados
            const relatedBooks = books.filter(b => 
                b.coleccion === book.coleccion || 
                b.palabras_clave.some(tag => book.palabras_clave.includes(tag))
            );

            const relatedList = document.getElementById("related-list");
            relatedBooks.forEach(relBook => {
                if (relBook.id !== book.id) {
                    const bookDiv = document.createElement("div");
                    bookDiv.classList.add("related-book");
                    bookDiv.innerHTML = `
                        <img src="assets/img/${relBook.imagen}" alt="${relBook.titulo}">
                        <a href="detalle.html?id=${relBook.id}">${relBook.titulo}</a>
                    `;
                    relatedList.appendChild(bookDiv);
                }
            });
        });
});
