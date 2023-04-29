const authSession = (req, res, next)=>{
    if (req.session?.user !== 'jppe' && !req.session?.admin) {
        return res.status(401).send('Error de autenticación')        
    }

    next()
}

module.exports = {
    authSession
}