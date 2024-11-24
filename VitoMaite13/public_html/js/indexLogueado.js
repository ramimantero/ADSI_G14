document.addEventListener('DOMContentLoaded', function() {
    // Supongamos que el email está almacenado en el localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    // Verificar si el email existe
    if (email) {
        // Obtener el enlace 'Editar Perfil'
        const editarPerfilLink = document.getElementById('editarPerfilLink');

        // Modificar el href para incluir el email
        editarPerfilLink.href = `editarPerfil.html?email=${encodeURIComponent(email)}`;
    }
});
