document.addEventListener("DOMContentLoaded", function () {
    let libros = [];
    let grupos = [];

    // 📌 Cargar datos desde los JSON
    fetch("data/books.json")
        .then(response => response.json())
        .then(data => {
            libros = data;
            mostrarLibros();
        });

    fetch("data/grupos.json")
        .then(response => response.json())
        .then(data => {
            grupos = data;
            mostrarGrupos();
        });

    // 📖 Mostrar libros con opciones editables
    function mostrarLibros() {
        const container = document.getElementById("books-container");
        container.innerHTML = "";

        libros.forEach(libro => {
            const card = document.createElement("div");
            card.classList.add("book-card");

            card.innerHTML = `
                <img src="${libro.imagen}" alt="${libro.titulo}">
                <input type="text" value="${libro.titulo}" data-id="${libro.id}" class="titulo-input">
                <input type="text" value="${libro.preciokindle}" data-id="${libro.id}" class="kindle-input">
                <input type="text" value="${libro.preciotapablanda}" data-id="${libro.id}" class="tapa-input">
                <input type="text" value="${libro.idioma}" data-id="${libro.id}" class="idioma-input">
            `;

            container.appendChild(card);
        });

        // 📌 Detectar cambios
        document.querySelectorAll(".titulo-input, .kindle-input, .tapa-input, .idioma-input").forEach(input => {
            input.addEventListener("input", actualizarLibro);
        });
    }

    // 📂 Mostrar grupos con opciones editables
    function mostrarGrupos() {
        const container = document.getElementById("grupos-container");
        container.innerHTML = "";

        grupos.forEach(grupo => {
            const card = document.createElement("div");
            card.classList.add("book-card");

            card.innerHTML = `
                <h3>${grupo.nombre}</h3>
                <input type="text" value="${grupo.nombre}" data-id="${grupo.id}" class="grupo-input">
            `;

            container.appendChild(card);
        });

        document.querySelectorAll(".grupo-input").forEach(input => {
            input.addEventListener("input", actualizarGrupo);
        });
    }

    // 📝 Actualizar libros al editar
    function actualizarLibro(event) {
        const id = parseInt(event.target.dataset.id);
        const libro = libros.find(l => l.id === id);

        if (event.target.classList.contains("titulo-input")) {
            libro.titulo = event.target.value;
        } else if (event.target.classList.contains("kindle-input")) {
            libro.preciokindle = event.target.value;
        } else if (event.target.classList.contains("tapa-input")) {
            libro.preciotapablanda = event.target.value;
        } else if (event.target.classList.contains("idioma-input")) {
            libro.idioma = event.target.value;
        }
    }

    // 📝 Actualizar grupos al editar
    function actualizarGrupo(event) {
        const id = parseInt(event.target.dataset.id);
        const grupo = grupos.find(g => g.id === id);
        grupo.nombre = event.target.value;
    }

    // 📥 Exportar los datos en JSON listo para copiar
    document.getElementById("export-json").addEventListener("click", function () {
        const booksJSON = JSON.stringify(libros, null, 4);
        const groupsJSON = JSON.stringify(grupos, null, 4);

        alert("✅ Copia y pega los siguientes JSONs:\n\n📖 books.json:\n" + booksJSON + "\n\n📂 grupos.json:\n" + groupsJSON);
    });
});
