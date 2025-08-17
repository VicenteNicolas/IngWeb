require('dotenv').config(); // debe ir al inicio

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '*****' : 'No cargada');
console.log('DB_WRITER_USER:', process.env.DB_WRITER_USER);
console.log('DB_WRITER_PASSWORD:', process.env.DB_WRITER_PASSWORD ? '*****' : 'No cargada');

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 } // 1 minuto en milisegundos
}));

// Conexión solo lectura
const dbReader = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

dbReader.connect(err => {
    if(err) throw err;
    console.log('Conectado a la base de datos MySQL');
});


//Conexión escritura
const dbWriter = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_WRITER_USER,
    password: process.env.DB_WRITER_PASSWORD,
    database: process.env.DB_NAME
});

dbWriter.connect(err=> {
    if(err) throw err;
    console.log('Conectado a MYSQL como escritor');
});

// Registro
app.post('/register', async (req,res) => {
    const {username,password} = req.body;

    if(!username || !password) return res.status(400).json({success:false,message:'Faltan datos'});

    try{
        const saltRounds = 10;
        const hashedPassword= await bcrypt.hash(password,saltRounds);

        //Guardar
        dbWriter.query('INSERT INTO usuarios (username, password) VALUES (?,?)',[username,hashedPassword], (err,results) => {
            if(err){
                console.error(err);
                return res.status(500).json({success:false, message:'Error al registrar'});
            }
            res.json({success:true,message:'Usuario registrado'});
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({success:false,message:'Error interno'});
    }
});



// login de usuarios
app.post('/login', (req,res)=> {
    const {username, password } = req.body;

    if(!username || !password) return res.status(400).json({success:false,message:'Faltan datos'});

    dbReader.query('SELECT * FROM usuarios WHERE username= ?', [username], async (err,results)=> {
        if(err){
            console.error(err);
            return res.status(500).json({success:false,message:'Error interno'});
        }

        if(results.length===0) return res.json({success:false,message:'Usuario no existe'});

        const user = results[0];

        //Comparar la contraseña con el hash
        const match= await bcrypt.compare(password,user.password);

        if(match){
            req.session.user = username; //Guardar 
            res.json({success:true,message:'Login exitoso'});

        } else {
            res.json({success:false,messgae:'Contraseña incorrecta'});
        }

    });
});


// Middleware para proteger rutas
function authMiddleware(req, res, next){
    if(req.session.user){
        next(); // Usuario logueado
    } else {
        res.redirect('/'); 
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
