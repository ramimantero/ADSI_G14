document.addEventListener("DOMContentLoaded", function () {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const aficionesParam = params.get('aficiones');

    if (aficionesParam) {
        // Convierte los IDs de aficiones seleccionadas en un array
        const aficionesSeleccionadas = aficionesParam.split(',').map(id => parseInt(id, 10));

        // Realiza la búsqueda de usuarios
        buscarUsuariosPorAficiones(aficionesSeleccionadas);
    }
});

function buscarUsuarios(ciudad, genero, edadMin, edadMax) {
    const solicitud = indexedDB.open("vitomaitebd", 1);

    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;
        const transaccion = db.transaction("UsuarioAficion", "readonly");
        const usuarioAficionStore = transaccion.objectStore("Usuarios");

        const resultados = [];
        usuarioAficionStore.openCursor().onsuccess = function (eventoCursor) {
            const cursor = eventoCursor.target.result;
            if (cursor) {
                const usuario = cursor.value;

                // Verifica cada filtro individualmente
                const cumpleCiudad = ciudad === "" || usuario.ciudad === ciudad; // Ciudad debe coincidir exactamente
                const cumpleGenero = usuario.genero === genero; // Género debe coincidir
                const cumpleEdad = usuario.edad >= edadMin && usuario.edad <= edadMax; // Rango de edad

                // Mostrar depuración para entender qué pasa
                console.log("Evaluando usuario:", usuario);
                console.log("Cumple ciudad:", cumpleCiudad, " | Ciudad seleccionada:", ciudad, " | Ciudad usuario:", usuario.ciudad);
                console.log("Cumple género:", cumpleGenero);
                console.log("Cumple edad:", cumpleEdad);

                // Solo agregar usuarios que cumplan TODOS los filtros
                if (cumpleCiudad && cumpleGenero && cumpleEdad) {
                    resultados.push(usuario);
                }

                cursor.continue();
            } else {
                mostrarResultados(resultados);
            }
        };
    };

    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos:", evento.target.error);
    };
}

function obtenerDetallesUsuarios(db, emails) {
    const usuariosStore = db.transaction("Usuarios", "readonly").objectStore("Usuarios");

    const resultados = [];
    usuariosStore.openCursor().onsuccess = function (eventoCursor) {
        const cursor = eventoCursor.target.result;
        if (cursor) {
            const usuario = cursor.value;

            // Si el email del usuario está en la lista encontrada
            if (emails.includes(usuario.email)) {
                resultados.push(usuario);
            }

            cursor.continue();
        } else {
            // Mostrar resultados al final
            mostrarResultados(resultados);
        }
    };
}

function mostrarResultados(resultados) {
    const contenedor = document.getElementById("resultados");

    if (resultados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron usuarios con las aficiones seleccionadas.</p>";
        return;
    }

    let tablaHTML = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
    `;

    resultados.forEach(usuario => {
        tablaHTML += `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
            </tr>
        `;
    });

    tablaHTML += `
            </tbody>
        </table>
    `;

    contenedor.innerHTML = tablaHTML;
}
