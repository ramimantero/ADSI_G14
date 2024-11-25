document.addEventListener('DOMContentLoaded', function () {
    // Obtener los parámetros de la URL (filtros de búsqueda)
    const params = new URLSearchParams(window.location.search);
    const ciudad = params.get('ciudad') || ''; // Ciudad del filtro
    const generoBusqueda = params.get('genero') || 'hombre-busca-mujer'; // Género del filtro
    const edadMin = parseInt(params.get('edadMin'), 10) || 18; // Edad mínima
    const edadMax = parseInt(params.get('edadMax'), 10) || 100; // Edad máxima
    const email = params.get('email');
    
    if (email) {
        // Obtener el enlace 'Editar Perfil'
        const editarPerfilLink = document.getElementById('editarPerfilLink');
        
        // Modificar el href para incluir el email
        editarPerfilLink.href = `editarPerfil.html?email=${encodeURIComponent(email)}`;

        const inicioLink1 = document.getElementById('inicioLink1');
        
        // Modificar el href para incluir el email
        inicioLink1.href = `indexLogueado.html?email=${encodeURIComponent(email)}`;
        
        const inicioLink2 = document.getElementById('inicioLink2');
        
        // Modificar el href para incluir el email
        inicioLink2.href = `indexLogueado.html?email=${encodeURIComponent(email)}`;

        const mapaLink = document.getElementById('mapaLink');
        
        // Modificar el href para incluir el email
        mapaLink.href = `maps.html?email=${encodeURIComponent(email)}`;

        const busquedaAvanzadaLink = document.getElementById('busquedaAvanzadaLink');
        
        // Modificar el href para incluir el email
        busquedaAvanzadaLink.href = `busquedaAvanzada.html?email=${encodeURIComponent(email)}`;
    }

    // Convertir el filtro de "genero" en el valor correspondiente ("H" para hombre, "M" para mujer)
    let generoFiltro;
    if (generoBusqueda === "hombre-busca-mujer" || generoBusqueda === "mujer-busca-mujer") {
        generoFiltro = "M"; // H para hombre
    } else {
        generoFiltro = "H"; // M para mujer
    }

    // Llamar a la función de búsqueda con los filtros
    buscarUsuarios(ciudad, generoFiltro, edadMin, edadMax);
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

    // Añadir filas para cada usuario encontrado
    resultados.forEach(usuario => {
        tablaHTML += `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${usuario.edad}</td>
                <td>${usuario.ciudad}</td>
            </tr>
        `;
    });

    // Cerrar la tabla
    tablaHTML += `
            </tbody>
        </table>
    `;

    // Insertar la tabla generada en el contenedor de resultados
    contenedor.innerHTML = tablaHTML;

    // Depuración: Mostrar el total de resultados encontrados
    console.log("Total de usuarios encontrados:", resultados.length);
    console.log("Resultados finales:", resultados);
}
