const express = require('express');
const router = express.Router();
const path = require('path');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { noCache } = require('../middleware/cache');

router.get('/inicio', authMiddleware, noCache, (req,res)=>{
    res.sendFile(path.join(__dirname,'../private/inicio.html'));
});

router.get('/admin', adminMiddleware, noCache, (req,res)=>{
    res.sendFile(path.join(__dirname,'../private/admin.html'));
});

module.exports = router;
