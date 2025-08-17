const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { dbReader, dbWriter } = require('../db/connections');

router.post('/register', async (req,res)=>{
    const {username,password} = req.body;
    if(!username || !password) return res.status(400).json({success:false,message:'Faltan datos'});

    try{
        const hashed = await bcrypt.hash(password,10);
        dbWriter.query('INSERT INTO usuarios (username,password) VALUES (?,?)',[username,hashed], (err)=>{
            if(err){
                if(err.code==='ER_DUP_ENTRY') return res.json({success:false,message:'Usuario ya existe'});
                return res.status(500).json({success:false,message:'Error al registrar'});
            }
            res.json({success:true,message:'Usuario registrado'});
        });
    } catch(err){
        console.error(err);
        res.status(500).json({success:false,message:'Error interno'});
    }
});

router.post('/login', (req,res)=>{
    const {username,password} = req.body;
    if(!username || !password) return res.status(400).json({success:false,message:'Faltan datos'});

    dbReader.query('SELECT * FROM usuarios WHERE username=?',[username], async (err,results)=>{
        if(err) return res.status(500).json({success:false,message:'Error interno'});
        if(results.length===0) return res.json({success:false,message:'Usuario no existe'});

        const user = results[0];
        const match = await bcrypt.compare(password,user.password);
        if(match){
            req.session.user = { username:user.username, role:user.role };
            res.json({success:true,message:'Login exitoso',role:user.role});
        } else {
            res.json({success:false,message:'Contraseña incorrecta'});
        }
    });
});

module.exports = router;
