const  jwt = require('jsonwebtoken')

//=============================
//Verificar Token
//=============================

let verificarToken = (req, res, next)=>{
  let token = req.get('token');

  jwt.verify(token, process.env.SEED, (err, decoded)=> {
    if(err) {
      return res.status(401).json({
        ok:false,
        err
      });
    }
    
    req.usuario = decoded.data;
    next();
  })
}

//=============================
//Verificar rol del usuario
//=============================

let verifyRolUser = (req, res, next)=> {
  let usuario = req.usuario
  
  if (usuario.role !== 'ADMIN_ROLE')  {
    return res.json({
      ok:false,
      err: {
        message: "Se denegó el acceso al recurso solicitado. Es posible que el usuario no tenga permisos suficientes."
      }
    })
  }
  next();
}

module.exports = {
  verificarToken,
  verifyRolUser
}