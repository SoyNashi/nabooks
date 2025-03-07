document.addEventListener("DOMContentLoaded", function () {
    let libros = [];
    let grupos = [];

    // 📌 Cargar datos desde los archivos JSON
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

    // 📌 Mostrar Libros en la Interfaz
    function mostrarLibros() {
        const contenedor = document.getElementById("lista-libros");
        contenedor.innerHTML = "";

        libros.forEach((libro, index) => {
            const div = document.createElement("div");
            div.classList.add("libro-card");

            div.innerHTML = `
                <img src="${libro.imagen}" alt="Portada">
                <div class="libro-info">
                    <label>Título:</label>
                    <input type="text" value="${libro.titulo}" class="titulo">
                    
                    <label>Idioma:</label>
                    <input type="text" value="${libro.idioma}" class="idioma">

                    <label>Imagen (URL):</label>
                    <input type="text" value="${libro.imagen}" class="imagen">

                    <label>Precio Kindle:</label>
                    <input type="number" value="${libro.preciokindle}" class="precio-kindle">

                    <label>Precio Tapa Blanda:</label>
                    <input type="number" value="${libro.preciotapablanda}" class="precio-tapa">

                    <label>Colección:</label>
                    <input type="text" value="${libro.coleccion}" class="coleccion">

                    <label>Traducciones (IDs separados por coma):</label>
                    <input type="text" value="${libro.traducciones ? libro.traducciones.join(", ") : ""}" class="traducciones">

                    <button class="editar" data-index="${index}">💾 Guardar</button>
                    <button class="eliminar" data-index="${index}">🗑️ Eliminar</button>
                </div>
            `;

            contenedor.appendChild(div);
        });

        document.querySelectorAll(".editar").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.dataset.index;
                editarLibro(index);
            });
        });

        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.dataset.index;
                libros.splice(index, 1);
                mostrarLibros();
            });
        });
    }

    // 📌 Editar un libro
    function editarLibro(index) {
        const libro = libros[index];
        const inputs = document.querySelectorAll(`.libro-card:nth-child(${index + 1}) input`);

        libro.titulo = inputs[0].value;
        libro.idioma = inputs[1].value;
        libro.imagen = inputs[2].value;
        libro.preciokindle = inputs[3].value;
        libro.preciotapablanda = inputs[4].value;
        libro.coleccion = inputs[5].value;
        libro.traducciones = inputs[6].value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        alert("📌 Libro actualizado.");
        mostrarLibros();
    }

    // 📌 Agregar un nuevo libro
    document.getElementById("agregar-libro").addEventListener("click", function () {
        libros.push({
            id: libros.length + 1,
            titulo: "Nuevo Libro",
            imagen: "",
            idioma: "",
            preciokindle: 0,
            preciotapablanda: 0,
            coleccion: "",
            traducciones: []
        });

        mostrarLibros();
    });

    // 📌 Mostrar Grupos en la Interfaz
    function mostrarGrupos() {
        const contenedor = document.getElementById("lista-grupos");
        contenedor.innerHTML = "";

        grupos.forEach((grupo, index) => {
            const div = document.createElement("div");
            div.classList.add("grupo-card");

            div.innerHTML = `
                <label>Nombre del Grupo:</label>
                <input type="text" value="${grupo.nombre}" class="grupo-nombre">

                <label>Libros en este Grupo (IDs separados por coma):</label>
                <input type="text" value="${grupo.libros_id.join(", ")}" class="grupo-libros">

                <button class="editar-grupo" data-index="${index}">💾 Guardar</button>
                <button class="eliminar-grupo" data-index="${index}">🗑️ Eliminar</button>
            `;

            contenedor.appendChild(div);
        });

        document.querySelectorAll(".editar-grupo").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.dataset.index;
                editarGrupo(index);
            });
        });

        document.querySelectorAll(".eliminar-grupo").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.dataset.index;
                grupos.splice(index, 1);
                mostrarGrupos();
            });
        });
    }

    // 📌 Agregar un nuevo grupo
    document.getElementById("agregar-grupo").addEventListener("click", function () {
        grupos.push({
            id: grupos.length + 1,
            nombre: "Nuevo Grupo",
            libros_id: []
        });

        mostrarGrupos();
    });

    // 📌 Generar los JSON actualizados
    document.getElementById("generar-json").addEventListener("click", function () {
        console.log("📜 books.json:\n", JSON.stringify(libros, null, 4));
        console.log("📜 grupos.json:\n", JSON.stringify(grupos, null, 4));

        alert("📥 JSON generado. Copia desde la consola.");
    });
});
