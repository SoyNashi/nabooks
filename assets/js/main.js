document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list");
    const searchInput = document.getElementById("search");
    const filterSelect = document.getElementById("filter");

    let books = [];

    // Cargar libros desde books.json
    fetch("data/books.json")
        .then(response => response.json())
        .then(data => {
            books = data;
            displayBooks(books);
        });

    // Mostrar libros en la página
  function displayBooks(bookArray) {
        bookList.innerHTML = ""; // Limpiar lista antes de mostrar
        bookArray.forEach(book => {
            const bookItem = document.createElement("div");
                bookItem.classList.add("book", `tema-${book.tema}`);
            bookItem.innerHTML = `
                <img src="${book.imagen}" alt="${book.titulo}" class="portada">
                <h2>${book.titulo}</h2>
                <p>${book.subtitulo}</p>
                <p><strong>$${book.precio}</strong></p>
                <a href="detalle.html?id=${book.id}">Ver más</a>
            `;
            bookList.appendChild(bookItem);

            // 📌 Aplicar color de portada
                           const img = bookItem.querySelector(".portada");
                img.crossOrigin = "anonymous"; // 🔹 SOLUCIÓN para evitar CORS
                img.onload = function () {
                    try {
                        const colorThief = new ColorThief();
                        const color = colorThief.getColor(img);
                        const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                        bookItem.style.backgroundColor = rgbColor;
                        bookItem.style.boxShadow = `0px 0px 10px ${rgbColor}`;
                    } catch (error) {
                        console.error("Error al extraer color con Color Thief:", error);
                    }
                };
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
});
