document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");
    const imageGallery = document.getElementById("imageGallery");

    const images = ["img-01.jpg", "img-02.jpg", "img-03.jpg"]; // Nombres de las imágenes en la carpeta img/

    // Carga inicial de las imágenes en la galería
    images.forEach((img) => {
        const imgElement = document.createElement("img");
        imgElement.src = `img/${img}`;
        imgElement.draggable = true;
        imgElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", imgElement.src);
        });
        imageGallery.appendChild(imgElement);
    });

    // Hacer clic para seleccionar una imagen
    dropZone.addEventListener("click", () => fileInput.click());

    // Arrastrar archivos directamente al área de drop
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file) {
            displayImage(file);
        } else {
            const imgSrc = e.dataTransfer.getData("text/plain");
            if (imgSrc) {
                displayDroppedImage(imgSrc);
            }
        }
    });

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            displayImage(file);
        }
    });

    function displayImage(file) {
        const reader = new FileReader();
        reader.onload = () => {
            preview.innerHTML = `<img src="${reader.result}" alt="Vista previa de la imagen">`;
        };
        reader.readAsDataURL(file);
    }

    function displayDroppedImage(src) {
        preview.innerHTML = `<img src="${src}" alt="Imagen seleccionada">`;
    }
});
