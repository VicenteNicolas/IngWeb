require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const pageRoutes = require('./routes/pages');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000*60 }
}));

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(pageRoutes);

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
});

app.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.send('Error al cerrar sesión');
        res.redirect('/');
    });
});

app.listen(3000, ()=> console.log('Servidor corriendo en http://localhost:3000'));
