const activeTable = document.getElementById('activeUsers');
const inactiveTable = document.getElementById('inactiveUsers');
const messageDiv = document.getElementById('message');

// Función para mostrar mensajes
function showMessage(msg, type = 'success') {
    messageDiv.textContent = msg;
    messageDiv.className = 'message ' + type;
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

        if (!data.success) return showMessage('Error al cargar usuarios', 'error');

        activeTable.innerHTML = '';
        inactiveTable.innerHTML = '';

        data.users.forEach(user => {
            const tr = document.createElement('tr');
            const tdUser = document.createElement('td');
            tdUser.textContent = user.username;

            const tdRole = document.createElement('td');
            tdRole.textContent = user.role;
            tdRole.className = user.role === 'admin' ? 'role-admin' : 'role-user';

            const tdAction = document.createElement('td');

            tr.appendChild(tdUser);
            tr.appendChild(tdRole);

            const isActive = user.activo == 1 || user.activo === '1';

            if (user.role !== 'admin') {
                // Botón activar/desactivar
                const btnToggle = document.createElement('button');
                btnToggle.textContent = isActive ? 'Desactivar' : 'Activar';
                btnToggle.className = isActive ? 'deactivate-btn' : 'activate-btn';
                btnToggle.addEventListener('click', () => toggleUser(user.username, !isActive));
                tdAction.appendChild(btnToggle);

                // Botón eliminar
                const btnDelete = document.createElement('button');
                btnDelete.textContent = 'Eliminar';
                btnDelete.className = 'delete-btn';
                btnDelete.addEventListener('click', () => deleteUser(user.username));
                tdAction.appendChild(btnDelete);

                tr.appendChild(tdAction);

                if (isActive) activeTable.appendChild(tr);
                else inactiveTable.appendChild(tr);
            } else {
                tdAction.textContent = '-';
                tr.appendChild(tdAction);
                if (isActive) activeTable.appendChild(tr);
                else inactiveTable.appendChild(tr);
            }
        });

    } catch (err) {
        console.error(err);
        showMessage('Error de conexión', 'error');
    }
}

// Cambiar estado de usuario
async function toggleUser(username, activate) {
    const url = activate ? `/admin/activate/${username}` : `/admin/deactivate/${username}`;
    try {
        const res = await fetch(url, { method: 'PUT' });
        const data = await res.json();

        if (data.success) {
            showMessage(`Usuario "${username}" ${activate ? 'activado' : 'desactivado'}`);
            loadUsers();
        } else showMessage(data.message || 'Error', 'error');
    } catch (err) {
        console.error(err);
        showMessage('Error de conexión', 'error');
    }
}

// Eliminar usuario
async function deleteUser(username) {
    if (!confirm(`¿Seguro que quieres eliminar al usuario "${username}"?`)) return;

    try {
        const res = await fetch(`/admin/delete/${username}`, { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
            showMessage(`Usuario "${username}" eliminado`);
            loadUsers();
        } else showMessage(data.message || 'Error', 'error');
    } catch (err) {
        console.error(err);
        showMessage('Error de conexión', 'error');
    }
}

// Inicializar
loadUsers();
