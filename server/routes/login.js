
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const app = express()

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login',(req, res)=> {

  let body = req.body;

  Usuario.findOne({email: body.email }, (err, userDB)=>{
    if(err) {
      return res.status(500).json({
        ok:false,
        err
      })
    }

    if(!userDB){
      if(err) {
        return res.status(400).json({
          ok:false,
          err: {
            message: 'Usuario o contraseña incorrectos'
          }
        })
      }
    }

    if(!bcrypt.compareSync(body.password, userDB.password)){
      return res.status(400).json({
        ok:false,
        err: {
          message: 'Usuario o contraseña incorrectos'
        }
      })
    }
    
    let token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: userDB
    }, process.env.SEED);

    res.json({
      ok: true,
      user: userDB,
      token
    })
  })
})


//configuraciones de google

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }

}


//login google
app.post('/google', async (req, res)=> {
  let token = req.body.idtoken

  let googleUser = await verify(token)
  .catch((e)=> {
    return res.status(403).json({
      ok:false, 
      err: e
    })
  })

  console.log('este es la data de verify: ',googleUser);
  
  Usuario.findOne({ email: googleUser.email}, ( err, usuarioDB )=>{
    if(err) {
      return res.status(500).json({
        ok:false,
        err
      })
    }

    if (usuarioDB) {
      if (usuarioDB.google  === false) {
        return res.status(400).json({
          ok:false,
          err: {
            message: "Debe usar si autenticación normal"
          }
        })
      } else {

        let token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
          data: usuarioDB
        }, process.env.SEED);

        return res.json({
          ok: true ,
          user: usuarioDB,
          token
        });
      }
    } else {
      //si el usuario no existe en la base de datos
      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = googleUser.google;
      usuario.password =':)';

      usuario.save((err, usuarioDB)=>{
        if(err) {
          return res.status(500).json({
            ok:false,
            err
          })
        }

        let token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
          data: usuarioDB
        }, process.env.SEED);

        return res.json({
          ok: true ,
          user: usuarioDB,
          token
        });
      })

    }
  })
})

module.exports = app;