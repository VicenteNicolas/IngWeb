require('dotenv').config(); // debe ir al inicio

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '*****' : 'No cargada');

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Configurar sesiones
app.use(session({
    secret: 'vicente01', // cambia por algo más seguro en producción
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 } // 1 minuto en milisegundos
}));

// Conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if(err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Ruta de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query(
        'SELECT * FROM usuarios WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if(err) throw err;
            if(results.length > 0){
                req.session.user = username; // Guardar en sesión
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        }
    );
});

// Middleware para proteger rutas
function authMiddleware(req, res, next){
    if(req.session.user){
        next(); // Usuario logueado
    } else {
        res.redirect('/'); // Redirige al login
    }
}

function noCache(req, res, next) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}


// Proteger inicio
app.get('/inicio', authMiddleware, noCache,(req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'inicio.html'));
});

// Página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Error al cerrar sesión');
        res.redirect('/');
    });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
