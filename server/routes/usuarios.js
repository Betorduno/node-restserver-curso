const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')
const bodyParser = require('body-parser')
const Usuario = require('../models/usuario')
const { verificarToken, verifyRolUser } = require('../middlewares/auth');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', verificarToken, (req, res)=> {

  let desde =req.query.desde || 0
  desde = Number(desde);

  let limite = req.query.limite || 5
  limite = Number(limite);
  //todos los registro de la colección 
  Usuario.find({ estado: true }, 'nombre email img role estado google') //con el string propuesto se visualizan solo los campos que se encuetran en el string
  //salta de $desde
  .skip(desde)
  //solo 5 registros
  .limit(5)
    .exec((err, usuarios) => {
      if(err) {
        return res.status(400).json({
          ok:false,
          err
        })
      } 
      //contar la cantidad de registro de la base de datos 
      Usuario.count({ estado: true }, (err, conteo)=>{
        res.json({
          ok: true,
          usuarios,
          registros: conteo
        })
      })

      
    })
})

app.post('/usuario', [verificarToken, verifyRolUser], (req, res)=>{
  let body = req.body
  
  let user = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10) ,
    role: body.role
  })

  user.save((err, usuarioDB)=> {
    if(err) {
      return res.status(400).json({
        ok:false,
        err
      })
    } 
    res.json({
      ok: true,
      usuario:usuarioDB
    })
  })
})

app.put('/usuario/:id', [verificarToken, verifyRolUser], (req, res) => {

  let id = req.params.id;
  //(underscore)_.pick regresa un object filtrado por los campos que se estipulan en el array.

  let body = _.pick(req.body,['nombre', 'email','img','role','estado'] )
  
  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB)=> {
    if(err) {
      return res.status(400).json({
        ok:false,
        err
      })
    } 
    res.json({
      ok: true,
      usuario:usuarioDB
    })
  })
})

app.delete('/usuario/:id', [verificarToken, verifyRolUser], (req, res) => {

  let id = req.params.id;
  let cambiaEstado = {
    estado: false
  }
  // Usuario.findByIdAndRemove(id, (err, userDelete) => {
  Usuario.findByIdAndUpdate(id, cambiaEstado, { new:true }, (err, userDelete) => {
    if(err) {
      return res.status(400).json({
        ok:false,
        err
      })
    } 
    if(!userDelete) {
      return res.status(400).json({
        ok:false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }
    res.json({
      ok: true,
      usuario: userDelete
    })

  })

})

module.exports = app;