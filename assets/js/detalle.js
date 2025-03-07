document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = urlParams.get("id");

    if (!libroId) {
        alert("Libro no encontrado.");
        window.location.href = "index.html";
        return;
    }

    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const libro = libros.find(l => l.id == libroId);

            if (!libro) {
                alert("Libro no encontrado.");
                window.location.href = "index.html";
                return;
            }

            // 📌 Actualizar la información del libro
            document.getElementById("titulo-libro").textContent = libro.titulo;
            document.getElementById("portada-libro").src = libro.imagen;
            document.getElementById("titulo").textContent = libro.titulo;
            document.getElementById("sinopsis").textContent = libro.sinopsis;
            document.getElementById("precio-kindle").textContent = libro.preciokindle === "0" ? "Gratis" : `$${libro.preciokindle}`;
            document.getElementById("precio-tapa").textContent = libro.preciotapablanda === "0" ? "Gratis" : `$${libro.preciotapablanda}`;

            // 📌 Mostrar botones de compra si hay enlaces
            const kindleLink = document.getElementById("link-kindle");
            const tapaLink = document.getElementById("link-tapa");

            if (libro.amazonkindle) {
                kindleLink.href = libro.amazonkindle;
            } else {
                kindleLink.style.display = "none";
            }

            if (libro.amazontapablanda) {
                tapaLink.href = libro.amazontapablanda;
            } else {
                tapaLink.style.display = "none";
            }

            // 📌 Aplicar Color Thief para cambiar colores del fondo
            aplicarColores(libro.imagen, document.body);

            // 📌 Cargar libros relacionados
            mostrarRelacionados(libro, libros);
        })
        .catch(error => console.error("Error cargando el libro:", error));
});

/* 🎨 Color Thief: Aplicar colores */
function aplicarColores(imagenUrl, elemento) {
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.src = imagenUrl;

    img.onload = function () {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        elemento.style.backgroundColor = `rgb(${color.join(",")})`;
        elemento.style.color = getContrastingColor(color);
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = urlParams.get("id");

    if (!libroId) {
        alert("Libro no encontrado.");
        window.location.href = "index.html";
        return;
    }

    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const libro = libros.find(l => l.id == libroId);

            if (!libro) {
                alert("Libro no encontrado.");
                window.location.href = "index.html";
                return;
            }

            // 📌 Actualizar la información del libro
            document.getElementById("titulo-libro").textContent = libro.titulo;
            document.getElementById("portada-libro").src = libro.imagen;
            document.getElementById("titulo").textContent = libro.titulo;
            document.getElementById("sinopsis").textContent = libro.sinopsis;
            document.getElementById("precio-kindle").textContent = libro.preciokindle === "0" ? "Gratis" : `$${libro.preciokindle}`;
            document.getElementById("precio-tapa").textContent = libro.preciotapablanda === "0" ? "Gratis" : `$${libro.preciotapablanda}`;

            // 📌 Mostrar botones de compra si hay enlaces
            document.getElementById("link-kindle").style.display = libro.amazonkindle ? "inline-block" : "none";
            document.getElementById("link-tapa").style.display = libro.amazontapablanda ? "inline-block" : "none";
            mostrarGrupo(libro);

            // 📌 Aplicar Color Thief para cambiar colores del fondo
            aplicarColores(libro.imagen, document.body);

            // 📌 Cargar libros relacionados con estilo de `index.html`
            mostrarRelacionados(libro, libros);
            mostrarTraducciones(libro, libros);

        })
        .catch(error => console.error("Error cargando el libro:", error));
});
/* 📌 Mostrar Grupo del Libro */
function mostrarGrupo(libro) {
    fetch("data/grupos.json")
        .then(response => response.json())
        .then(grupos => {
            const grupo = grupos.find(g => g.libros_id.includes(parseInt(libro.id)));

            if (grupo) {
                document.getElementById("grupo-container").innerHTML = `
                    <h3>Pertenece a la colección:</h3>
                    <a href="grupos.html?id=${grupo.id}" class="btn-grupo">${grupo.nombre}</a>
                `;
            }
        })
        .catch(error => console.error("Error cargando el grupo:", error));
}


/* 📌 Mostrar otras traducciones */
function mostrarTraducciones(libro, libros) {
    const contenedor = document.getElementById("traducciones-container");

    if (!libro.traducciones || libro.traducciones.length === 0) {
        contenedor.style.display = "none";
        return;
    }

    const traducciones = libros.filter(l => libro.traducciones.includes(l.id));

    contenedor.innerHTML = `<h3>🌍 Otros idiomas disponibles</h3><div class="traducciones-grid"></div>`;
    const grid = contenedor.querySelector(".traducciones-grid");

    traducciones.forEach(traduccion => {
        const idiomaHTML = obtenerIdiomasHTML(traduccion.idioma);
        const precioKindle = traduccion.preciokindle === "0" ? "Gratis" : `$${traduccion.preciokindle}`;
        const precioTapa = traduccion.preciotapablanda === "0" ? "Gratis" : `$${traduccion.preciotapablanda}`;

        const card = document.createElement("div");
        card.classList.add("traduccion-card");

        card.innerHTML = `
            <a href="detalle.html?id=${traduccion.id}" class="traduccion-link">
                <img src="${traduccion.imagen}" alt="Portada de ${traduccion.titulo}">
                <h4>${traduccion.titulo} ${idiomaHTML}</h4>
                <p>📖 Kindle: ${precioKindle}</p>
                <p>📚 Tapa blanda: ${precioTapa}</p>
            </a>
        `;

        grid.appendChild(card);
        aplicarColores(traduccion.imagen, card);
    });

    contenedor.style.display = "block";
}




/* 🎨 Color Thief: Aplicar colores */
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

/* 📚 Mostrar libros relacionados con mismo formato de `index.html` */
function mostrarRelacionados(libro, libros) {
    const contenedor = document.getElementById("relacionados-container");
    contenedor.innerHTML = "";

    const relacionados = libros.filter(l =>
        l.id !== libro.id &&
        (l.coleccion === libro.coleccion || l.palabras_clave.some(p => libro.palabras_clave.includes(p)))
    );

    relacionados.forEach(libroRelacionado => {
        const card = document.createElement("div");
        card.classList.add("book-card");

        // 📌 Extraer precios
        const precioKindle = libroRelacionado.preciokindle === "0" ? "Gratis" : `$${libroRelacionado.preciokindle}`;
        const precioTapa = libroRelacionado.preciotapablanda === "0" ? "Gratis" : `$${libroRelacionado.preciotapablanda}`;

        // 📌 Idiomas con banderas
        const idiomasHTML = obtenerIdiomasHTML(libroRelacionado.idioma);

        // 📌 Estructura HTML
        card.innerHTML = `
            <a href="detalle.html?id=${libroRelacionado.id}" class="book-link">
                <h2>${libroRelacionado.titulo}</h2>
                <img src="${libroRelacionado.imagen}" alt="Portada de ${libroRelacionado.titulo}">
                <div class="book-info">
                    <div class="idiomas">${idiomasHTML}</div>
                    <div class="precios">
                        <p>📖 Kindle: ${precioKindle}</p>
                        <p>📚 Tapa blanda: ${precioTapa}</p>
                    </div>
                </div>
            </a>
        `;

        contenedor.appendChild(card);

        // 📌 Aplicar Color Thief a cada tarjeta relacionada
        aplicarColores(libroRelacionado.imagen, card);
    });
}

/* 📌 Función para obtener color de texto adecuado */
function getContrastingColor([r, g, b]) {
    return (r * 299 + g * 587 + b * 114) / 1000 > 125 ? "#000" : "#fff";
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

    const idiomasArray = idiomaTexto.split('-'); // Para múltiples idiomas
    return idiomasArray.map(idioma => {
        return `<span class="idioma ${idiomasMap[idioma]?.clase || "desconocido"}">
                    ${idiomasMap[idioma]?.bandera || "🌐"}
                </span>`;
    }).join(' ');
}


/* 📌 Función para obtener color de texto adecuado */
function getContrastingColor([r, g, b]) {
    return (r * 299 + g * 587 + b * 114) / 1000 > 125 ? "#000" : "#fff";
}
document.addEventListener("DOMContentLoaded", function () {
    const btnVolver = document.getElementById("volver-atras");

    btnVolver.addEventListener("click", function () {
        window.history.back();
    });
});
