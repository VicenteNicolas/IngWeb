function authMiddleware(req,res,next){
    if(req.session.user) next();
    else res.redirect('/');
}

function adminMiddleware(req,res,next){
    if(req.session.user && req.session.user.role==='admin') next();
    else res.status(403).send('Acceso denegado');
}

module.exports = { authMiddleware, adminMiddleware };
