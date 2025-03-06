document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const grupoId = urlParams.get("id");

    if (!grupoId) {
        alert("Grupo no encontrado.");
        window.location.href = "index.html";
        return;
    }

    fetch("data/grupos.json")
        .then(response => response.json())
        .then(grupos => {
            const grupo = grupos.find(g => g.id == grupoId);

            if (!grupo) {
                alert("Grupo no encontrado.");
                window.location.href = "index.html";
                return;
            }

            document.getElementById("titulo-grupo").textContent = grupo.nombre;
            document.getElementById("grupo-descripcion").innerHTML = `
                <h2>${grupo.nombre}</h2>
                <p>📖 Colección especial de libros</p>
            `;

            // Cargar libros del grupo
            cargarLibros(grupo.libros_id);
        })
        .catch(error => console.error("Error cargando el grupo:", error));
});

/* 📚 Cargar libros del grupo */
function cargarLibros(librosId) {
    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const librosGrupo = libros.filter(libro => librosId.includes(libro.id));
            const contenedor = document.getElementById("libros-container");
            contenedor.innerHTML = "";

            librosGrupo.forEach(libro => {
                const bookElement = document.createElement("div");
                bookElement.classList.add("book-card");

                // 📌 Extraer precios
                const precioKindle = libro.preciokindle === "0" ? "Gratis" : `$${libro.preciokindle}`;
                const precioTapa = libro.preciotapablanda === "0" ? "Gratis" : `$${libro.preciotapablanda}`;

                // 📌 Idiomas con banderas
                const idiomasHTML = obtenerIdiomasHTML(libro.idioma);

                bookElement.innerHTML = `
                    <a href="detalle.html?id=${libro.id}" class="book-link">
                        <h2>${libro.titulo}</h2>
                        <img src="${libro.imagen}" alt="Portada de ${libro.titulo}">
                        <div class="book-info">
                            <div class="idiomas">${idiomasHTML}</div>
                            <div class="precios">
                                <p>📖 Kindle: ${precioKindle}</p>
                                <p>📚 Tapa blanda: ${precioTapa}</p>
                            </div>
                        </div>
                    </a>
                `;

                contenedor.appendChild(bookElement);

                // 📌 Aplicar Color Thief para colorear cada tarjeta
                aplicarColores(libro.imagen, bookElement);
            });
        })
        .catch(error => console.error("Error cargando libros:", error));
}

/* 🎨 Color Thief para aplicar colores dinámicos */
function aplicarColores(imagenUrl, elemento) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imagenUrl;

    img.onload = function () {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        elemento.style.backgroundColor = `rgb(${color.join(",")})`;
        elemento.style.color = getContrastingColor(color);
    };
}

/* 📌 Función para generar banderas de idiomas */
function obtenerIdiomasHTML(idiomaTexto) {
    const idiomasMap = {
        "Español": { clase: "es", bandera: "🇪🇸" },
        "Ingles": { clase: "en", bandera: "🇬🇧" },
        "Catalán": { clase: "ca", bandera: "🇨🇦" },
        "Alemán": { clase: "de", bandera: "🇩🇪" },
        "Francés": { clase: "fr", bandera: "🇫🇷" },
        "Italiano": { clase: "it", bandera: "🇮🇹" },
        "Portugués": { clase: "pt", bandera: "🇵🇹" },
        "Japonés": { clase: "jp", bandera: "🇯🇵" },
        "Chino": { clase: "cn", bandera: "🇨🇳" },
        "Coreano": { clase: "kr", bandera: "🇰🇷" },
        "Ruso": { clase: "ru", bandera: "🇷🇺" },
        "Vikingo": { clase: "vk", bandera: "🪓" }
    };

    const idiomasArray = idiomaTexto.split('-');
    return idiomasArray.map(idioma => {
        return `<span class="idioma ${idiomasMap[idioma]?.clase || "desconocido"}">
                    ${idiomasMap[idioma]?.bandera || "🌐"}
                </span>`;
    }).join(' ');
}
document.addEventListener("DOMContentLoaded", function () {
    const btnVolver = document.getElementById("volver-atras");

    if (btnVolver) {
        btnVolver.addEventListener("click", function () {
            window.history.back();
        });
    }
});
