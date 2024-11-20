document.addEventListener('DOMContentLoaded', function () {
    // Obtener los parámetros de la URL (filtros de búsqueda)
    const params = new URLSearchParams(window.location.search);
    const ciudad = params.get('ciudad') || '';
    const genero = params.get('genero') || 'M';
    const edadMin = parseInt(params.get('edadMin'), 10) || 18;
    const edadMax = parseInt(params.get('edadMax'), 10) || 100;

    // Llamar a la función de búsqueda
    buscarUsuarios(ciudad, genero, edadMin, edadMax);
});

// Función para buscar usuarios según los filtros de búsqueda
function buscarUsuarios(ciudad, genero, edadMin, edadMax) {
    const solicitud = indexedDB.open("vitomaitebd", 1);

    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;
        const transaccion = db.transaction("Usuarios", "readonly");
        const usuariosStore = transaccion.objectStore("Usuarios");

        const resultados = [];
        usuariosStore.openCursor().onsuccess = function (eventoCursor) {
            const cursor = eventoCursor.target.result;
            if (cursor) {
                const usuario = cursor.value;

                // Condición con AND: Todos los filtros deben cumplirse
                if (
                    (ciudad === "" || usuario.ciudad.toLowerCase() === ciudad.toLowerCase()) &&
                    usuario.genero === genero &&
                    usuario.edad >= edadMin &&
                    usuario.edad <= edadMax
                ) {
                    resultados.push(usuario);
                }
                cursor.continue();
            } else {
                mostrarResultados(resultados);
            }
        };
    };
}

// Función para mostrar los resultados en una tabla
function mostrarResultados(resultados) {
    const contenedor = document.getElementById("resultados");
    if (resultados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron resultados para los filtros seleccionados.</p>";
        return;
    }

    let tablaHTML = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Ciudad</th>
                </tr>
            </thead>
            <tbody>
    `;

    resultados.forEach(usuario => {
        tablaHTML += `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${usuario.edad}</td>
                <td>${usuario.ciudad}</td>
            </tr>
        `;
    });

    tablaHTML += `
            </tbody>
        </table>
    `;

    contenedor.innerHTML = tablaHTML;
}
