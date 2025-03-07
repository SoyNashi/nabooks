document.addEventListener("DOMContentLoaded", function () {
    let libros = [];
    let grupos = [];

    // 📌 Cargar datos de los archivos JSON
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

                    <label>Precio Kindle:</label>
                    <input type="number" value="${libro.preciokindle}" class="precio-kindle">

                    <label>Precio Tapa Blanda:</label>
                    <input type="number" value="${libro.preciotapablanda}" class="precio-tapa">

                    <label>Colección:</label>
                    <input type="text" value="${libro.coleccion}" class="coleccion">

                    <label>Traducciones (IDs separados por coma):</label>
                    <input type="text" value="${libro.traducciones ? libro.traducciones.join(", ") : ""}" class="traducciones">

                    <button class="editar" data-index="${index}">✏️ Editar</button>
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
    }

    // 📌 Editar un libro
    function editarLibro(index) {
        const libro = libros[index];
        const inputs = document.querySelectorAll(`.libro-card:nth-child(${index + 1}) input`);

        libro.titulo = inputs[0].value;
        libro.idioma = inputs[1].value;
        libro.preciokindle = inputs[2].value;
        libro.preciotapablanda = inputs[3].value;
        libro.coleccion = inputs[4].value;
        libro.traducciones = inputs[5].value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        alert("📌 Libro actualizado.");
    }

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

                <button class="editar-grupo" data-index="${index}">✏️ Editar</button>
            `;

            contenedor.appendChild(div);
        });

        document.querySelectorAll(".editar-grupo").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.dataset.index;
                editarGrupo(index);
            });
        });
    }

    // 📌 Editar un grupo
    function editarGrupo(index) {
        const grupo = grupos[index];
        const inputs = document.querySelectorAll(`.grupo-card:nth-child(${index + 1}) input`);

        grupo.nombre = inputs[0].value;
        grupo.libros_id = inputs[1].value.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        alert("📌 Grupo actualizado.");
    }

    // 📌 Generar los JSON actualizados
    document.getElementById("generar-json").addEventListener("click", function () {
        console.log("📜 books.json:\n", JSON.stringify(libros, null, 4));
        console.log("📜 grupos.json:\n", JSON.stringify(grupos, null, 4));

        alert("📥 JSON generado. Copia desde la consola.");
    });
});
