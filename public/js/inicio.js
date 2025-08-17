const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
    fetch('/logout')
        .then(() => {
            window.location.href = '/';
        })
        .catch(err => console.error('Error al cerrar sesión', err));
});
