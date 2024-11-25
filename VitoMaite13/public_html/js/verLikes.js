document.addEventListener('DOMContentLoaded', function () {
    // Obtener el email del usuario logueado desde los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const emailUsuarioLogueado = params.get('email');
    const nombre = params.get('nombre');
    const foto = params.get("foto");
    
    if(document.getElementById('back-link')){
        const backLink = document.getElementById('back-link');

        // Modificar el href para incluir el email
        backLink.href = `indexLogueado.html?email=${encodeURIComponent(emailUsuarioLogueado)}&nombre=${encodeURIComponent(nombre)}&foto=${encodeURIComponent(foto)}`;
    }

    if (emailUsuarioLogueado) {
        mostrarLikes(emailUsuarioLogueado);
    } else {
        console.error("Email del usuario no encontrado en los parámetros de la URL.");
    }
});

function mostrarLikes(emailUsuarioLogueado) {
    const solicitud = indexedDB.open("vitomaitebd", 1);

    solicitud.onsuccess = function (evento) {
        const db = evento.target.result;
        obtenerLikes(db);
    }

    solicitud.onerror = function () {
        console.error("Error al abrir la base de datos:", solicitud.error);
    };
}

let likesMutuos = {}; // Definido globalmente para que esté disponible en toda la función

function obtenerLikes(db) {
    const params = new URLSearchParams(window.location.search);
    const emailActual = params.get("email"); // Email del usuario logueado
    const emailsQueLikearon = [];

    const transaccion = db.transaction("Likes", "readonly");
    const likesStore = transaccion.objectStore("Likes");

    likesStore.openCursor().onsuccess = function (evento) {
        const cursor = evento.target.result;

        if (cursor) {
            const like = cursor.value;

            // Si el usuario actual es el receptor del like, agrega al emisor (usuario1)
            if (like.usuario2 === emailActual) {
                emailsQueLikearon.push(like.usuario1);
                
                // Comprobar si también existe un like mutuo
                const transaccionVerificacion = db.transaction("Likes", "readonly");
                const likesStoreVerificacion = transaccionVerificacion.objectStore("Likes");
                
                likesStoreVerificacion.index("usuario2").openCursor(IDBKeyRange.only(like.usuario1)).onsuccess = function (evento) {
                    const cursorVerificacion = evento.target.result;
                    if (cursorVerificacion) {
                        if (cursorVerificacion.value.usuario1 === emailActual) {
                            likesMutuos[like.usuario1] = true; // Es un like mutuo
                        }
                    }
                };
            }

            cursor.continue();
        } else {
            console.log("Emails que dieron like:", emailsQueLikearon);
            obtenerUsuarios(db, emailsQueLikearon); // Pasar los emails sin necesidad de likesMutuos aquí
        }
    };
}

function obtenerUsuarios(db, emailsQueLikearon) {
    const resultados = [];
    const transaccion = db.transaction("Usuarios", "readonly");
    const usuariosStore = transaccion.objectStore("Usuarios");

    usuariosStore.openCursor().onsuccess = function (evento) {
        const cursor = evento.target.result;

        if (cursor) {
            const usuario = cursor.value;

            // Verifica si el email del usuario está en la lista de emails que dieron like
            if (emailsQueLikearon.includes(usuario.email)) {
                const esMutuo = likesMutuos[usuario.email] ? true : false; // Verifica si el like es mutuo
                usuario.esMutuo = esMutuo; // Añade esta propiedad al usuario
                resultados.push(usuario);
            }

            cursor.continue();
        } else {
            console.log("Usuarios que dieron like:", resultados);
            generarTablaLikes(resultados, likesMutuos); // Generar la tabla con los usuarios encontrados
        }
    };
}

function generarTablaLikes(usuarios, likesMutuos) {
    const contenedor = document.getElementById("resultados");

    if (usuarios.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron likes hacia tu perfil.</p>";
        return;
    }

    let tablaHTML = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Foto</th>
                </tr>
            </thead>
            <tbody>
    `;

    usuarios.forEach(usuario => {
        // Verificamos si el like es mutuo
        const esMutuo = likesMutuos[usuario.email] ? true : false; 

        tablaHTML += `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td style="position: relative;">
                    <img src="${usuario.foto}" alt="Foto" style="width: 40px; height: 40px; border-radius: 50%;">

                    <!-- Corazón flotante -->
                    ${esMutuo ? `<span style="position: absolute; top: 5px; right: 5px; font-size: 24px; color: red;">❤️</span>` : ''}
                </td>
            </tr>
        `;
    });

    tablaHTML += `
            </tbody>
        </table>
    `;

    contenedor.innerHTML = tablaHTML;
}
