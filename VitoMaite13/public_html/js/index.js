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

        const usuariosStore = db.createObjectStore("Usuarios", {keyPath: "id", autoIncrement: true});
        usuariosStore.createIndex("email", "email", {unique: true});
        usuariosStore.createIndex("edad", "edad", {unique: false});
        usuariosStore.createIndex("genero", "genero", {unique: false});
        usuariosStore.createIndex("ciudad", "ciudad", {unique: false});

        // Añadir usuarios iniciales
        const usuarios = [
            {nombre: "Marta", email: "marta@example.com", password: "1234", foto: "avatar01", edad: 25, genero: "M", ciudad: "Vitoria"},
            {nombre: "Laura", email: "laura@example.com", password: "1234", foto: "avatar02", edad: 30, genero: "M", ciudad: "Bilbao"},
            {nombre: "Ana", email: "ana@example.com", password: "1234", foto: "avatar03", edad: 18, genero: "M", ciudad: "Donostia"},
            {nombre: "Sara", email: "sara@example.com", password: "1234", foto: "avatar04", edad: 19, genero: "M", ciudad: "Vitoria"},
            {nombre: "Luisa", email: "luisa@example.com", password: "1234", foto: "avatar05", edad: 58, genero: "M", ciudad: "Vitoria"},
            {nombre: "Vanesa", email: "vanesa@example.com", password: "1234", foto: "avatar06", edad: 36, genero: "M", ciudad: "Bilbao"},
            {nombre: "Pedro", email: "pedro@example.com", password: "1234", foto: "avatar07", edad: 21, genero: "H", ciudad: "Bilbao"},
            {nombre: "Pablo", email: "pablo@example.com", password: "1234", foto: "avatar08", edad: 47, genero: "H", ciudad: "Donostia"},
            {nombre: "Julio", email: "julio@example.com", password: "1234", foto: "avatar09", edad: 59, genero: "H", ciudad: "Donostia"},
            {nombre: "Javier", email: "javier@example.com", password: "1234", foto: "avatar10", edad: 54, genero: "H", ciudad: "Vitoria"},
            {nombre: "Asier", email: "asier@example.com", password: "1234", foto: "avatar11", edad: 20, genero: "H", ciudad: "Bilbao"},
            {nombre: "David", email: "david@example.com", password: "1234", foto: "avatar12", edad: 22, genero: "H", ciudad: "Donostia"}
        ];

        // Insertar los usuarios en el almacén de objetos
        usuarios.forEach(usuario => usuariosStore.add(usuario));

        console.log("Usuarios iniciales creados.");
        // Crear almacén de aficiones
        if (!db.objectStoreNames.contains("Aficiones")) {
            const aficionesStore = db.createObjectStore("Aficiones", {keyPath: "id", autoIncrement: true});
            aficionesStore.createIndex("nombreAfi", "nombreAfi", {unique: true});

            console.log("Almacén de aficiones creado.");

            // Insertar datos iniciales
            const aficiones = [
                {nombreAfi: "Deportes"},
                {nombreAfi: "Música"},
                {nombreAfi: "Viajar"},
                {nombreAfi: "Cine"},
                {nombreAfi: "Caminar"},
                {nombreAfi: "Arte"},
                {nombreAfi: "Videojuegos"},
                {nombreAfi: "Yoga"},
                {nombreAfi: "Cocina"},
                {nombreAfi: "Lectura"}
            ];

            aficiones.forEach(aficion => aficionesStore.add(aficion));
            console.log("Aficiones iniciales añadidas.");
        }

        if (!db.objectStoreNames.contains("UsuarioAficion")) {
            const usuarioAficionStore = db.createObjectStore("UsuarioAficion", {keyPath: "id", autoIncrement: true});
            usuarioAficionStore.createIndex("email", "email", {unique: false}); // Índice por email del usuario
            usuarioAficionStore.createIndex("idAfi", "idAfi", {unique: false}); // Índice por ID de afición

            console.log("Almacén de UsuarioAficion creado.");




            const relaciones = [
                {email: "marta@example.com", idAfi: 1},
                {email: "marta@example.com", idAfi: 3},
                {email: "marta@example.com", idAfi: 4},
                {email: "laura@example.com", idAfi: 2},
                {email: "laura@example.com", idAfi: 10},
                {email: "laura@example.com", idAfi: 7},
                {email: "laura@example.com", idAfi: 4},
                {email: "ana@example.com", idAfi: 5},
                {email: "ana@example.com", idAfi: 4},
                {email: "ana@example.com", idAfi: 6},
                {email: "pedro@example.com", idAfi: 1},
                {email: "pedro@example.com", idAfi: 10},
                {email: "pedro@example.com", idAfi: 2},
                {email: "pablo@example.com", idAfi: 2},
                {email: "pablo@example.com", idAfi: 8},
                {email: "pablo@example.com", idAfi: 7},
                {email: "david@example.com", idAfi: 6},
                {email: "david@example.com", idAfi: 10},
                {email: "david@example.com", idAfi: 2}
            ];

// Insertar las relaciones en el almacén
            relaciones.forEach(relacion => usuarioAficionStore.add(relacion));
            console.log("Relaciones iniciales añadidas en UsuarioAficion.");
        }

        if (!db.objectStoreNames.contains("Likes")) {
            const likesStore = db.createObjectStore("Likes", {keyPath: "id", autoIncrement: true});
            likesStore.createIndex("usuario1", "usuario1", {unique: false});
            likesStore.createIndex("usuario2", "usuario2", {unique: false});
            console.log("Almacén de Likes creado.");

            // Relación inicial de Likes
            const likes = [
                // 3 usuarios que se gustan mutuamente
                {usuario1: "marta@example.com", usuario2: "laura@example.com"},
                {usuario1: "laura@example.com", usuario2: "marta@example.com"},
                {usuario1: "ana@example.com", usuario2: "marta@example.com"},
                {usuario1: "marta@example.com", usuario2: "ana@example.com"},
                {usuario1: "laura@example.com", usuario2: "ana@example.com"},
                {usuario1: "ana@example.com", usuario2: "laura@example.com"},

                // 6 relaciones unilaterales
                {usuario1: "pedro@example.com", usuario2: "marta@example.com"},
                {usuario1: "pedro@example.com", usuario2: "ana@example.com"},
                {usuario1: "pablo@example.com", usuario2: "laura@example.com"},
                {usuario1: "david@example.com", usuario2: "sara@example.com"},
                {usuario1: "sara@example.com", usuario2: "pedro@example.com"},
                {usuario1: "luisa@example.com", usuario2: "julio@example.com"}
            ];

            // Insertar los datos
            likes.forEach(like => likesStore.add(like));
            console.log("Relaciones de Likes iniciales añadidas.");
        }


    };
}
