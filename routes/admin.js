const express = require('express');
const router = express.Router();
const { dbReader, dbAdmin } = require('../db/connections');
const { adminMiddleware } = require('../middleware/auth');

// Obtener usuarios activos y desactivados
router.get('/users', adminMiddleware, (req, res) => {
    dbReader.query('SELECT username, role, activo FROM usuarios', (err, results) => {
        if(err) return res.status(500).json({success:false,message:'Error interno'});
        res.json({success:true, users: results});
    });
});

// Desactivar usuario
router.put('/deactivate/:username', adminMiddleware, (req, res) => {
    const { username } = req.params;
    if(username === 'admin') return res.json({success:false,message:'No puedes desactivar al admin'});
    dbAdmin.query('UPDATE usuarios SET activo = 0 WHERE username = ?', [username], err => {
        if(err) return res.status(500).json({success:false,message:'Error al desactivar usuario'});
        res.json({success:true});
    });
});

// Activar usuario
router.put('/activate/:username', adminMiddleware, (req, res) => {
    const { username } = req.params;
    dbAdmin.query('UPDATE usuarios SET activo = 1 WHERE username = ?', [username], err => {
        if(err) return res.status(500).json({success:false,message:'Error al activar usuario'});
        res.json({success:true});
    });
});

// Borrar usuario
router.delete('/delete/:username', adminMiddleware, (req,res)=>{
    const { username } = req.params;
    if(username==='admin') return res.json({success:false,message:'No puedes eliminar al admin'});

    dbAdmin.query('DELETE FROM usuarios WHERE username=?',[username], (err)=>{
        if(err) return res.status(500).json({success:false,message:'Error al eliminar usuario'});
        res.json({success:true});
    });
});

module.exports = router;
