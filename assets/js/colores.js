document.addEventListener("DOMContentLoaded", () => {
    const colorThief = new ColorThief();
    const imagenes = document.querySelectorAll(".portada");

    imagenes.forEach(img => {
        if (img.complete) {
            aplicarColor(img);
        } else {
            img.addEventListener("load", () => aplicarColor(img));
        }
    });

    function aplicarColor(img) {
        try {
            const color = colorThief.getColor(img);
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

            const libroDiv = img.closest(".libro");
            libroDiv.style.background = `linear-gradient(to bottom, ${rgbColor}, #000)`;
            libroDiv.style.border = `1px solid ${rgbColor}`;
        } catch (error) {
            console.error("Error al extraer color:", error);
        }
    }
});
