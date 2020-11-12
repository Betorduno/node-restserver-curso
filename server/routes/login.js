
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const app = express()

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

module.exports = app;