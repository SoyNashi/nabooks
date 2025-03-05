document.addEventListener("DOMContentLoaded", async () => {
    const librosContainer = document.getElementById("libros-container");
    const buscador = document.getElementById("buscador");
    const filtroColeccion = document.getElementById("filtro-coleccion");
    const filtroAutor = document.getElementById("filtro-autor");
    const filtroPalabras = document.getElementById("filtro-palabras");
    const ordenar = document.getElementById("ordenar");
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.innerHTML = "Cargando libros...";
    document.body.appendChild(loader);
    
    let libros = [];

    // ✅ 1️⃣ Cargar libros desde books.json
    async function cargarLibros() {
        try {
            loader.style.display = "block"; // Mostramos el loader
            const response = await fetch("data/books.json");
            libros = await response.json();
            mostrarLibros(libros);
            llenarFiltros();
        } catch (error) {
            console.error("❌ Error al cargar los libros:", error);
        } finally {
            loader.style.display = "none"; // Ocultamos el loader
        }
    }

    // ✅ 2️⃣ Mostrar libros en la página
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
        });

        aplicarColores(); // Aplicamos los colores después de cargar los libros
    }

    // ✅ 3️⃣ Extraer color con Color Thief SIN CORS
    function aplicarColores() {
        const colorThief = new ColorThief();
        const imagenes = document.querySelectorAll(".portada");

        imagenes.forEach(img => {
            img.crossOrigin = "Anonymous"; // Permite la carga en CORS
            if (img.complete) {
                extraerColor(img, colorThief);
            } else {
                img.addEventListener("load", () => extraerColor(img, colorThief));
            }
        });
    }

    function extraerColor(img, colorThief) {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const color = colorThief.getColor(canvas);
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            img.closest(".libro").style.background = `linear-gradient(135deg, ${rgbColor}, #000)`;
        } catch (error) {
            console.warn("⚠️ No se pudo extraer el color de la imagen:", img.src);
        }
    }

    // ✅ 4️⃣ Llenar opciones de filtros dinámicamente
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

    // ✅ 5️⃣ Filtrar y ordenar libros
    function filtrarLibros() {
        let filtrados = libros.filter(libro => {
            const coincideBusqueda = libro.titulo.toLowerCase().includes(buscador.value.toLowerCase());
            const coincideColeccion = filtroColeccion.value === "" || libro.coleccion === filtroColeccion.value;
            const coincideAutor = filtroAutor.value === "" || libro.autor === filtroAutor.value;
            const coincidePalabras = filtroPalabras.value === "" || libro.palabras_clave.includes(filtroPalabras.value);

            return coincideBusqueda && coincideColeccion && coincideAutor && coincidePalabras;
        });

        // Ordenar libros
        if (ordenar.value === "titulo") {
            filtrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (ordenar.value === "precio") {
            filtrados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
        }

        mostrarLibros(filtrados);
    }

    // ✅ 6️⃣ Eventos
    buscador.addEventListener("input", filtrarLibros);
    filtroColeccion.addEventListener("change", filtrarLibros);
    filtroAutor.addEventListener("change", filtrarLibros);
    filtroPalabras.addEventListener("change", filtrarLibros);
    ordenar.addEventListener("change", filtrarLibros);

    // ✅ 7️⃣ Cargar libros al inicio
    cargarLibros();
});
