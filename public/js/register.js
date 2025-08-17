const form = document.getElementById('registerForm');
const errorDiv = document.getElementById('error');
const mensajeDiv = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(!username || !password){
        errorDiv.textContent='Debes completar todos los campos';
        mensajeDiv.textContent='';
        return;
    }

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if(data.success){
            mensajeDiv.textContent = 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.\n';
            errorDiv.textContent = '';
            form.reset();

            setTimeout(() => {
                window.location.href ='/';
            },2000);

        } else {
            errorDiv.textContent = data.message || 'Error al registrar';
            mensajeDiv.textContent = '';
        }

    } catch(err){
        console.error(err);
        errorDiv.textContent = 'Error de conexión';
    }
});
