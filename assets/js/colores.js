document.addEventListener("DOMContentLoaded", () => {
    const colorThief = new ColorThief();

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
            const color = colorThief.getColor(img);
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            img.closest(".libro").style.background = `linear-gradient(135deg, ${rgbColor}, #000)`;
        } catch (error) {
            console.warn("No se pudo extraer el color de la imagen:", img.src);
        }
    }

    aplicarColores();
});
