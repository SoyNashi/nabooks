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

/* 📚 Mostrar libros relacionados con colores de portada */
function mostrarRelacionados(libro, libros) {
    const contenedor = document.getElementById("relacionados-container");
    contenedor.innerHTML = "";

    const relacionados = libros.filter(l =>
        l.id !== libro.id &&
        (l.coleccion === libro.coleccion || l.palabras_clave.some(p => libro.palabras_clave.includes(p)))
    );

    relacionados.forEach(libroRelacionado => {
        const card = document.createElement("div");
        card.classList.add("relacionado-card");

        card.innerHTML = `
            <a href="detalle.html?id=${libroRelacionado.id}">
                <h3>${libroRelacionado.titulo}</h3>
                <img src="${libroRelacionado.imagen}" alt="Portada de ${libroRelacionado.titulo}">
            </a>
        `;

        contenedor.appendChild(card);

        // Aplicar colores de la portada a la tarjeta relacionada
        aplicarColores(libroRelacionado.imagen, card);
    });
}

/* 📌 Función para obtener color de texto adecuado */
function getContrastingColor([r, g, b]) {
    return (r * 299 + g * 587 + b * 114) / 1000 > 125 ? "#000" : "#fff";
}
