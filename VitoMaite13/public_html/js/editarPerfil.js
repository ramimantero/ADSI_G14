document.addEventListener('DOMContentLoaded', function() {
    // Obtener el email desde la URL
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    
    if (!email) {
        console.error("El email no está presente en la URL.");
        return;
    }

    // Llamar a la función para abrir la base de datos y cargar el perfil
    abrirBaseDeDatos(email);

    // Escuchar el evento de click en el botón "Guardar Cambios"
    document.querySelector('.app-button').addEventListener('click', function() {
        guardarCambios(email);
    });
});

// Función para abrir la base de datos y cargar los datos del usuario
function abrirBaseDeDatos(email) {
    const solicitud = indexedDB.open("vitomaitebd", 1);

    solicitud.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };

    solicitud.onsuccess = function(event) {
        const db = event.target.result;

        // Obtener el usuario desde la base de datos
        const transaction = db.transaction(["Usuarios"], "readonly");
        const usuariosStore = transaction.objectStore("Usuarios");
        const request = usuariosStore.index("email").get(email);

        request.onsuccess = function() {
            const usuario = request.result;
            if (usuario) {
                // Llenar el formulario con los datos del usuario
                document.getElementById('username').value = usuario.nombre;
                document.getElementById('edad').value = usuario.edad;
                document.getElementById('ciudad').value = usuario.ciudad;  // Cargar la ciudad
                
                if (usuario.genero === "H") {
                    document.getElementById('generoHombre').checked = true;
                } else if (usuario.genero === "M") {
                    document.getElementById('generoMujer').checked = true;
                }
            } else {
                console.error("No se encontró el usuario con el email:", email);
            }
        };

        request.onerror = function() {
            console.error("Error al obtener el usuario de la base de datos.");
        };
    };
}

// Función para guardar los cambios del formulario
function guardarCambios(email) {
    // Obtener los valores del formulario
    const nuevoNombre = document.getElementById('username').value;
    const nuevaEdad = document.getElementById('edad').value;
    const nuevaCiudad = document.getElementById('ciudad').value;  // Obtener la nueva ciudad
    const nuevoGenero = document.querySelector('input[name="genero"]:checked').value; // Obtener el género seleccionado

    // Verificar que los campos obligatorios no estén vacíos
    if (!nuevoNombre || !nuevaEdad || !nuevaCiudad || !nuevoGenero) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }

    // Abrir la base de datos en modo 'readwrite' para actualizar los datos
    const solicitud = indexedDB.open("vitomaitebd", 1);

    solicitud.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };

    solicitud.onsuccess = function(event) {
        const db = event.target.result;

        // Obtener el usuario desde la base de datos
        const transaction = db.transaction(["Usuarios"], "readwrite");
        const usuariosStore = transaction.objectStore("Usuarios");

        // Obtener el usuario por su email
        const request = usuariosStore.index("email").get(email);

        request.onsuccess = function() {
            const usuario = request.result;
            if (usuario) {
                // Modificar los datos del usuario con los nuevos valores
                usuario.nombre = nuevoNombre;
                usuario.edad = nuevaEdad;
                usuario.ciudad = nuevaCiudad;  // Actualizar la ciudad
                usuario.genero = nuevoGenero;

                // Actualizar el registro del usuario en la base de datos
                const updateRequest = usuariosStore.put(usuario);

                updateRequest.onsuccess = function() {
                    alert("Datos actualizados con éxito.");
                    // Redirigir o hacer lo que necesites después de guardar los cambios
                };

                updateRequest.onerror = function() {
                    console.error("Error al actualizar los datos del usuario.");
                };
            } else {
                console.error("No se encontró el usuario con el email:", email);
            }
        };

        request.onerror = function() {
            console.error("Error al obtener el usuario de la base de datos.");
        };
    };
}
