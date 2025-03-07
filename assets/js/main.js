document.addEventListener("DOMContentLoaded", function () {
    const booksContainer = document.getElementById("books-container");
    const searchInput = document.getElementById("search");
    const filterLanguage = document.getElementById("filter-language");

    // 📌 Función para mezclar los libros con el algoritmo de Fisher-Yates
function mezclarLibros(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambia posiciones
    }
}

// 📌 Cargar libros desde el JSON
fetch("data/books.json")
    .then(response => response.json())
    .then(libros => {
        mezclarLibros(libros); // Mezclar antes de mostrar
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
                "Ruso": { clase: "ru", bandera: "🇷🇺" },
                "Vikingo": { clase: "vk", bandera: "🪓" }  // ¡Épico! 🪓

            };

            // Función para manejar los idiomas y devolver sus clases y banderas
            function obtenerIdiomaData(idiomas) {
                const idiomasArray = idiomas.split('-');  // Separamos los idiomas si vienen juntos
                return idiomasArray.map(idioma => {
                    return idiomasMap[idioma] || { clase: "desconocido", bandera: "🌐" };
                });
            }

            // Supongamos que el campo libro.idioma es un string con uno o dos idiomas
            const idiomaDataArray = obtenerIdiomaData(libro.idioma);

            // Generamos los spans con las banderas y clases
            let idiomasHTML = idiomaDataArray.map(idiomaData => {
                return `<span class="idioma ${idiomaData.clase}">
                            ${idiomaData.bandera}
                        </span>`;
            }).join(' ');


            // ✅ Estructura de la tarjeta del libro
            bookElement.innerHTML += `
                <a href="detalle.html?id=${libro.id}" class="book-link">
                    <h2>${libro.titulo}</h2>
                    <img src="${libro.imagen}" alt="Portada de ${libro.titulo}">
                    <div class="book-info">
                        <div class="idiomas">
                            ${idiomasHTML}  <!-- Aquí se añaden los spans de los idiomas -->
                        </div>
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
        const query = searchInput.value.toLowerCase(); // Obtiene la consulta de búsqueda
        const idioma = filterLanguage.value; // Obtiene el valor seleccionado en el filtro de idioma

        const librosFiltrados = libros.filter(libro => {
            // Filtrar por título
            const coincidenciaTitulo = libro.titulo.toLowerCase().includes(query);

            // Filtrar por idioma
            const idiomasLibro = libro.idioma.split('-'); // Dividir el campo 'idioma' si hay más de uno
            const coincidenciaIdioma = idioma === "all" || idiomasLibro.includes(idioma);

            return coincidenciaTitulo && coincidenciaIdioma; // Ambos filtros deben coincidir
        });

        mostrarLibros(librosFiltrados); // Mostrar los libros filtrados
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



