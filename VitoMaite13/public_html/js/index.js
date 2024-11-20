document.addEventListener('DOMContentLoaded', function () {
    // Capturar el evento 'click' en el botón de búsqueda
    document.getElementById("buscarBtn").addEventListener("click", function () {
        // Obtener los valores seleccionados en los filtros
        const ciudad = document.getElementById("city").value.trim(); // Ciudad seleccionada
        const genero = document.getElementById("gender").value; // Género seleccionado
        const edadMin = document.getElementById("fromInput").value; // Edad mínima
        const edadMax = document.getElementById("toInput").value; // Edad máxima

        // Verificar los valores de depuración
        console.log("Ciudad:", ciudad, "Género:", genero, "Edad Min:", edadMin, "Edad Max:", edadMax);

        // Construir la URL con los filtros seleccionados
        const url = `buscar.html?ciudad=${encodeURIComponent(ciudad)}&genero=${genero}&edadMin=${edadMin}&edadMax=${edadMax}`;

        // Redirigir a la página de resultados
        window.location.href = url;
    });

    // Inicializar la base de datos
    abrirBaseDeDatos();
});

function abrirBaseDeDatos() {
    // Abrir o crear la base de datos 'vitomaitebd'
    const solicitud = indexedDB.open("vitomaitebd", 1);

    // Manejo de errores
    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };

    // Manejo de éxito
    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;
        console.log("Base de datos 'vitomaitebd' abierta con éxito.");
    };

    // Crear la base de datos y los almacenes de objetos
    solicitud.onupgradeneeded = function (evento) {
        const db = evento.target.result;

        // Crear el almacén de usuarios
        const usuariosStore = db.createObjectStore("Usuarios", { keyPath: "id", autoIncrement: true });
        usuariosStore.createIndex("email", "email", { unique: true });
        usuariosStore.createIndex("edad", "edad", { unique: false });
        usuariosStore.createIndex("genero", "genero", { unique: false });
        usuariosStore.createIndex("ciudad", "ciudad", { unique: false });

        // Añadir usuarios iniciales
        const usuarios = [
            { nombre: "Marta", email: "marta@example.com", password: "1234", foto: "avatar01", edad: 25, genero: "M", ciudad: "Vitoria" },
            { nombre: "Laura", email: "laura@example.com", password: "1234", foto: "avatar02", edad: 30, genero: "M", ciudad: "Bilbao" },
            { nombre: "Ana", email: "ana@example.com", password: "1234", foto: "avatar03", edad: 18, genero: "M", ciudad: "Donostia" },
            { nombre: "Pedro", email: "pedro@example.com", password: "1234", foto: "avatar09", edad: 18, genero: "H", ciudad: "Vitoria" },
            { nombre: "David", email: "david@example.com", password: "1234", foto: "avatar10", edad: 22, genero: "H", ciudad: "Donostia" },
        ];

        // Insertar los usuarios en el almacén de objetos
        usuarios.forEach(usuario => usuariosStore.add(usuario));

        console.log("Usuarios iniciales creados.");
    };
}
