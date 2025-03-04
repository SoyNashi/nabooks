document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = parseInt(urlParams.get("id"));

    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const libro = libros.find(l => l.id === libroId);
            if (!libro) return;

            document.body.className = `tema-${libro.tema} detalle`;

            // 📌 Cargar detalles del libro
            document.getElementById("portada").src = libro.imagen;
            document.getElementById("titulo").textContent = libro.titulo;
            document.getElementById("subtitulo").textContent = libro.subtitulo || "";
            document.getElementById("descripcion").textContent = libro.descripcion || "Descripción no disponible.";
            document.getElementById("precio").textContent = `Precio: $${libro.precio}`;
            document.getElementById("btn-tapa-blanda").href = libro.amazon;
            document.getElementById("btn-kindle").href = libro.amazon;

            // 📌 Extraer color de portada y aplicarlo como fondo
            const img = document.getElementById("portada");
            img.src = libro.imagen;
            img.crossOrigin = "anonymous"; // 🔹 SOLUCIÓN para el error de CORS
            img.onload = function () {
                try {
                    const colorThief = new ColorThief();
                    const color = colorThief.getColor(img);
                    const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                    document.body.style.backgroundColor = rgbColor;
                    document.body.style.boxShadow = `inset 0px 0px 100px ${rgbColor}`;
                } catch (error) {
                    console.error("Error al extraer color con Color Thief:", error);
                }
            };

            // 📌 Aplicar efecto dinámico
            aplicarEfecto(libro.efecto);
            // 📌 Cargar libros relacionados
            cargarLibrosRelacionados(libro);

        });
});

// 📌 Función para efectos visuales según el tipo de libro
function aplicarEfecto(efecto) {
    const efectoContainer = document.createElement("div");
    efectoContainer.classList.add("efecto");

    switch (efecto) {
        case "humo":
            efectoContainer.classList.add("efecto-humo");
            break;
        case "glitch":
            efectoContainer.classList.add("efecto-glitch");
            break;
        case "petalos":
            efectoContainer.classList.add("efecto-petalos");
            break;
        default:
            return;
    }

    document.body.appendChild(efectoContainer);
}



function cargarLibrosRelacionados(libro) {
    fetch("data/books.json")
        .then(response => response.json())
        .then(libros => {
            const relacionados = libros.filter(l => 
                (l.coleccion === libro.coleccion || libro.palabras_clave.some(k => l.palabras_clave.includes(k))) &&
                l.id !== libro.id // 🔹 Evita mostrar el mismo libro
            );

            const contenedor = document.querySelector(".relacionados-container");
            contenedor.innerHTML = ""; // 🔹 Limpia antes de agregar nuevos

            if (relacionados.length === 0) {
                contenedor.innerHTML = "<p>No hay libros relacionados.</p>";
                return;
            }

            relacionados.forEach(lib => {
                let libroHTML = document.createElement("div");
                libroHTML.classList.add("book", `tema-${lib.tema}`); // 🔹 Aplica el tema
                libroHTML.innerHTML = `
                    <img src="${lib.imagen}" alt="${lib.titulo}" class="portada">
                    <h2>${lib.titulo}</h2>
                    <p>${lib.subtitulo}</p>
                    <p><strong>$${lib.precio}</strong></p>
                    <a href="detalle.html?id=${lib.id}">Ver más</a>
                `;
                contenedor.appendChild(libroHTML);

                // 📌 Extraer color de la portada y aplicarlo como fondo
                const img = libroHTML.querySelector(".portada");
                img.crossOrigin = "anonymous"; // 🔹 Solución para evitar CORS
                img.onload = function () {
                    try {
                        const colorThief = new ColorThief();
                        const color = colorThief.getColor(img);
                        const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                        libroHTML.style.backgroundColor = rgbColor;
                        libroHTML.style.boxShadow = `0px 0px 10px ${rgbColor}`;
                    } catch (error) {
                        console.error("Error al extraer color con Color Thief:", error);
                    }
                };
            });
        })
        .catch(error => console.error("Error al cargar los libros relacionados:", error));
}