document.addEventListener("DOMContentLoaded", function () {
    const booksContainer = document.getElementById("books-container");
    const searchInput = document.getElementById("search");
    const filterLanguage = document.getElementById("filter-language");

    // 📌 Cargar libros desde el JSON
    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            mostrarLibros(libros);
            searchInput.addEventListener("input", () => filtrarLibros(libros));
            filterLanguage.addEventListener("change", () => filtrarLibros(libros));
        })
        .catch(error => console.error("Error cargando libros:", error));

    // 📌 Mostrar libros en la página
    function mostrarLibros(libros) {
        booksContainer.innerHTML = "";
        libros.forEach(libro => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book-card");

            // ✅ Aplicar clase de decoración según el JSON
            if (libro.decoracion && libro.decoracion.trim() !== "") {
                bookElement.classList.add(libro.decoracion);
            }

            // ✅ Agregar partículas decorativas
            let particulas = document.createElement("div");
            particulas.classList.add("particles");
            bookElement.appendChild(particulas);

            // ✅ Determinar precios
            const precioKindle = libro.preciokindle === "0" ? "Gratis" : `$${libro.preciokindle}`;
            const precioTapa = libro.preciotapablanda === "0" ? "Gratis" : `$${libro.preciotapablanda}`;

            // ✅ Idioma (Bolita de color)
const idiomasMap = {
    "Español": { clase: "es", bandera: "🇪🇸" },
    "Ingles": { clase: "en", bandera: "🇬🇧" },
    "Catalán": { clase: "ca", bandera: "🇨🇦" },  // Puedes cambiar por la correcta 🇨🇦 es Canadá (solo como ejemplo)
    "Alemán": { clase: "de", bandera: "🇩🇪" },
    "Francés": { clase: "fr", bandera: "🇫🇷" },
    "Italiano": { clase: "it", bandera: "🇮🇹" },
    "Portugués": { clase: "pt", bandera: "🇵🇹" },
    "Japonés": { clase: "jp", bandera: "🇯🇵" },
    "Chino": { clase: "cn", bandera: "🇨🇳" },
    "Coreano": { clase: "kr", bandera: "🇰🇷" },
    "Ruso": { clase: "ru", bandera: "🇷🇺" }
    "Vikingo": { clase: "vk", bandera: "🪓" }  // ¡Épico! 🪓

};

// Extraer datos (con fallback en caso de idioma desconocido)
const idiomaData = idiomasMap[libro.idioma] || { clase: "desconocido", bandera: "🌐" };

// Usar así
const idiomaClase = idiomaData.clase;
const bandera = idiomaData.bandera;

            // ✅ Estructura de la tarjeta del libro
            bookElement.innerHTML += `
                <a href="detalle.html?id=${libro.id}" class="book-link">
                    <h2>${libro.titulo}</h2>
                    <img src="${libro.imagen}" alt="Portada de ${libro.titulo}">
                    <div class="book-info">
                        <span class="idioma ${idiomaClase}">
                            ${bandera}
                        </span>
                        <div class="precios">
                            <p>📖 Kindle: ${precioKindle}</p>
                            <p>📚 Tapa blanda: ${precioTapa}</p>
                        </div>
                    </div>
                </a>
            `;
            booksContainer.appendChild(bookElement);

            // 🖌 Aplicar Color Thief a la tarjeta
            aplicarColores(libro.imagen, bookElement);
        });
    }

    // 📌 Filtrar libros según la búsqueda y el idioma
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

/* 🎨 Color Thief: Extraer colores de la portada */
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
