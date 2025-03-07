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
                <input type="text" value="${libro.titulo}" class="titulo">
                <input type="text" value="${libro.idioma}" class="idioma">
                <input type="number" value="${libro.preciokindle}" class="precio-kindle">
                <input type="number" value="${libro.preciotapablanda}" class="precio-tapa">
                <button class="editar" data-index="${index}">✏️ Editar</button>
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
                <input type="text" value="${grupo.nombre}" class="grupo-nombre">
                <textarea class="grupo-libros">${grupo.libros_id.join(", ")}</textarea>
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
        const inputs = document.querySelectorAll(`.grupo-card:nth-child(${index + 1}) input, .grupo-card:nth-child(${index + 1}) textarea`);

        grupo.nombre = inputs[0].value;
        grupo.libros_id = inputs[1].value.split(",").map(id => parseInt(id.trim()));

        alert("📌 Grupo actualizado.");
    }

    // 📌 Generar los JSON actualizados
    document.getElementById("generar-json").addEventListener("click", function () {
        console.log("📜 books.json:\n", JSON.stringify(libros, null, 4));
        console.log("📜 grupos.json:\n", JSON.stringify(grupos, null, 4));

        alert("📥 JSON generado. Copia desde la consola.");
    });
});
