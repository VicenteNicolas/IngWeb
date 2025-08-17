const userTable = document.getElementById('userTable');
const messageDiv = document.getElementById('message');

// Función para mostrar mensajes
function showMessage(msg, type='success') {
    messageDiv.textContent = msg;
    messageDiv.className = 'message ' + type; // 'success' o 'error'
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}

// Cargar usuarios
async function loadUsers() {
    try {
        const res = await fetch('/admin/users');
        const data = await res.json();
        if(data.success) {
            userTable.innerHTML = '';
            data.users.forEach(user => {
                const tr = document.createElement('tr');

                const tdUser = document.createElement('td');
                tdUser.textContent = user.username;
                tr.appendChild(tdUser);

                const tdRole = document.createElement('td');
                tdRole.textContent = user.role;
                tdRole.className = user.role === 'admin' ? 'role-admin' : 'role-user';
                tr.appendChild(tdRole);

                const tdAction = document.createElement('td');
                if(user.username !== 'admin') {
                    const btnDelete = document.createElement('button');
                    btnDelete.textContent = 'Eliminar';
                    btnDelete.className = 'delete-btn';
                    btnDelete.addEventListener('click', () => deleteUser(user.username));
                    tdAction.appendChild(btnDelete);
                } else {
                    tdAction.textContent = '-';
                }
                tr.appendChild(tdAction);

                userTable.appendChild(tr);
            });
        } else {
            showMessage('Error al cargar usuarios', 'error');
        }
    } catch(err) {
        console.error(err);
        showMessage('Error de conexión', 'error');
    }
}

// Eliminar usuario
async function deleteUser(username) {
    if(!confirm(`¿Seguro que quieres eliminar al usuario "${username}"?`)) return;

    try {
        const res = await fetch(`/admin/delete/${username}`, { method: 'DELETE' });
        const data = await res.json();
        if(data.success) {
            showMessage(`Usuario "${username}" eliminado`);
            loadUsers(); 
        } else {
            showMessage(data.message || 'Error al eliminar usuario', 'error');
        }
    } catch(err) {
        console.error(err);
        showMessage('Error de conexión', 'error');
    }
}

// Inicializar
loadUsers();
