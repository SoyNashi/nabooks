const colorThief = new ColorThief();

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".book-card img").forEach(img => {
        img.addEventListener("load", function () {
            const contenedor = img.closest(".book-card");
            setColors(img, contenedor);
        });
    });
});

function setColors(img, contenedor) {
    const color = colorThief.getColor(img);
    const textColor = getContrastingColor(color);
    contenedor.style.backgroundColor = `rgb(${color.join(",")})`;
    contenedor.style.color = textColor;
}

function getContrastingColor([r, g, b]) {
    return (r * 299 + g * 587 + b * 114) / 1000 > 125 ? "#000" : "#fff";
}
