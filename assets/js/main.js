let books = []; // 🔹 Definir la variable global

document.addEventListener("DOMContentLoaded", () => {
    Promise.all([
        fetch("data/books.json").then(response => response.json()),
        fetch("data/grupos.json").then(response => response.json())
    ])
    .then(([libros, grupos]) => {
        books = libros; // 🔹 Guardar los libros en la variable global
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
        let coleccionHTML = grupo 
            ? `<a class="coleccion" href="grupos.html?id=${grupo.id}">${grupo.nombre}</a>` 
            : "";

        const img = bookItem.querySelector(".portada");
        img.crossOrigin = "anonymous";
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
        
        const bookItem = document.createElement("div");
        bookItem.classList.add("book", `tema-${book.tema}`);
        bookItem.innerHTML = `
            <img src="${book.imagen}" alt="${book.titulo}" class="portada">
            <h2>${book.titulo}</h2>
            ${coleccionHTML}  <!-- Solo se muestra si hay colección -->
            <p>${book.subtitulo}</p>
            <p><strong>$${book.precio}</strong></p>
            <a href="detalle.html?id=${book.id}" class="btn-ver-mas">Ver más</a>
        `;
        bookList.appendChild(bookItem);
    });
}


// 📌 Buscar libros
document.getElementById("search").addEventListener("input", () => {
    const query = document.getElementById("search").value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.titulo.toLowerCase().includes(query) || 
        book.subtitulo.toLowerCase().includes(query)
    );
    mostrarLibros(filteredBooks, []); // 🔹 Se mantiene vacío el segundo parámetro
});

// 📌 Ordenar libros
document.getElementById("filter").addEventListener("change", () => {
    const sortedBooks = [...books];
    const filterValue = document.getElementById("filter").value;
    
    if (filterValue === "titulo") {
        sortedBooks.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (filterValue === "precio") {
        sortedBooks.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
    } else {
        sortedBooks.sort((a, b) => b.id - a.id); // Orden por fecha (ID)
    }
    
    mostrarLibros(sortedBooks, []); // 🔹 Se mantiene vacío el segundo parámetro
});
