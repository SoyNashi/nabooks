document.addEventListener("DOMContentLoaded", async () => {
    const librosContainer = document.getElementById("libros-container");
    const buscador = document.getElementById("buscador");
    const filtroColeccion = document.getElementById("filtro-coleccion");
    const filtroAutor = document.getElementById("filtro-autor");
    const filtroPalabras = document.getElementById("filtro-palabras");
    const ordenar = document.getElementById("ordenar");
    const loader = document.getElementById("loader");
    const colorThief = new ColorThief();

    let libros = [];

    // Cargar libros desde books.json
    async function cargarLibros() {
        try {
            loader.style.display = "block"; // Mostramos el loader
            const response = await fetch("data/books.json");
            libros = await response.json();
            mostrarLibros(libros);
            llenarFiltros();
        } catch (error) {
            console.error("Error al cargar los libros:", error);
        } finally {
            loader.style.display = "none"; // Ocultamos el loader
        }
    }

    // Mostrar libros en la página
    function mostrarLibros(librosFiltrados) {
        librosContainer.innerHTML = "";

        librosFiltrados.forEach((libro, index) => {
            const libroDiv = document.createElement("div");
            libroDiv.classList.add("libro");
            libroDiv.innerHTML = `
                <img src="${libro.imagen}" alt="${libro.titulo}" class="portada">
                <h2>${libro.titulo}</h2>
                <p>${libro.autor}</p>
                <p><strong>$${libro.precio}</strong></p>
                <a href="detalle.html?id=${libro.id}" class="boton-detalle">Ver Detalles</a>
            `;
            librosContainer.appendChild(libroDiv);

            // Aplicar animación con GSAP
            gsap.fromTo(libroDiv, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1 });
        });

        aplicarColores(); // Aplicamos los colores después de cargar los libros
    }

    // Extraer color de la imagen con Color Thief
    function aplicarColores() {
        const imagenes = document.querySelectorAll(".portada");

        imagenes.forEach(img => {
            if (img.complete) {
                extraerColor(img);
            } else {
                img.addEventListener("load", () => extraerColor(img));
            }
        });
    }

    function extraerColor(img) {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const proxyImg = new Image();
            proxyImg.crossOrigin = "Anonymous";
            proxyImg.src = img.src;

            proxyImg.onload = function () {
                canvas.width = proxyImg.width;
                canvas.height = proxyImg.height;
                ctx.drawImage(proxyImg, 0, 0);

                const color = colorThief.getColor(canvas);
                const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                img.closest(".libro").style.background = `linear-gradient(135deg, ${rgbColor}, #000)`;
            };
        } catch (error) {
            console.warn("No se pudo extraer el color de la imagen:", img.src);
        }
    }

    // Llenar opciones de filtros dinámicamente
    function llenarFiltros() {
        const colecciones = new Set();
        const autores = new Set();
        const palabras = new Set();

        libros.forEach(libro => {
            if (libro.coleccion) colecciones.add(libro.coleccion);
            autores.add(libro.autor);
            libro.palabras_clave.forEach(palabra => palabras.add(palabra));
        });

        agregarOpciones(filtroColeccion, colecciones);
        agregarOpciones(filtroAutor, autores);
        agregarOpciones(filtroPalabras, palabras);
    }

    function agregarOpciones(select, opciones) {
        opciones.forEach(opcion => {
            const opt = document.createElement("option");
            opt.value = opcion;
            opt.textContent = opcion;
            select.appendChild(opt);
        });
    }

    // Filtrar y ordenar libros
    function filtrarLibros() {
        let filtrados = libros.filter(libro => {
            const coincideBusqueda = libro.titulo.toLowerCase().includes(buscador.value.toLowerCase());

            return coincideBusqueda;
        });

        // Ordenar libros
        if (ordenar.value === "titulo") {
            filtrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (ordenar.value === "precio") {
            filtrados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
        }

        mostrarLibros(filtrados);
    }

    // Eventos
    buscador.addEventListener("input", filtrarLibros);
    filtroColeccion.addEventListener("change", filtrarLibros);
    filtroAutor.addEventListener("change", filtrarLibros);
    filtroPalabras.addEventListener("change", filtrarLibros);
    ordenar.addEventListener("change", filtrarLibros);

    // Iniciar carga
    cargarLibros();
});
