document.addEventListener("DOMContentLoaded", function () {
    const booksContainer = document.getElementById("books-container");

    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            mostrarLibros(libros);
        })
        .catch(error => console.error("Error cargando libros:", error));

    function mostrarLibros(libros) {
        booksContainer.innerHTML = "";
        libros.forEach(libro => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book-card");

            // ✅ Aplicar clase de decoración si existe
            if (libro.decoracion && libro.decoracion.trim() !== "") {
                bookElement.classList.add(libro.decoracion);
            }

            // ✅ Crear div para partículas
            let particulas = document.createElement("div");
            particulas.classList.add("particles");
            bookElement.appendChild(particulas);

            // ✅ Idioma (Bolita de color)
            const idiomaClase = libro.idioma === "Español" ? "es" : "en";

            bookElement.innerHTML += `
                <a href="detalle.html?id=${libro.id}" class="book-link">
                    <h2>${libro.titulo}</h2>
                    <img src="${libro.imagen}" alt="Portada de ${libro.titulo}">
                    <div class="book-info">
                        <span class="idioma ${idiomaClase}">
                            ${libro.idioma === "Español" ? "🇪🇸" : "🇬🇧"}
                        </span>
                        <div class="precios">
                            <p>📖 Kindle: ${libro.preciokindle === "0" ? "Gratis" : `$${libro.preciokindle}`}</p>
                            <p>📚 Tapa blanda: ${libro.preciotapablanda === "0" ? "Gratis" : `$${libro.preciotapablanda}`}</p>
                        </div>
                    </div>
                </a>
            `;
            booksContainer.appendChild(bookElement);

            // 🖌 Aplicar Color Thief
            aplicarColores(libro.imagen, bookElement);
        });
    }
});

/* 🎨 Color Thief */
function aplicarColores(imagenUrl, contenedor) {
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.src = imagenUrl;

    img.onload = function () {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        const textColor = getContrastingColor(color);

        contenedor.style.backgroundColor = `rgb(${color.join(",")})`;
        contenedor.style.color = textColor;
    };
}

function getContrastingColor([r, g, b]) {
    return (r * 299 + g * 587 + b * 114) / 1000 > 125 ? "#000" : "#fff";
}
