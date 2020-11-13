const express= require('express')
let { verificarToken, verifyRolUser } = require('../middlewares/auth')
let app = express();

let Producto = require('../models/producto');

//=============================
//list all product
//=============================
app.get('/producto',verificarToken, (req, res)=>{
  let desde =req.query.desde || 0
  desde = Number(desde);

  let limite = req.query.limite || 5
  limite = Number(limite);

  Producto.find({disponible: true})
    .populate('usuario')
    .populate('categoria')
    .skip(desde)
    .limit(5)
    .exec((err, productoData)=>{
      if (err) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "No encontrado, el recurso solicitado no existe."
          }
        })
      }

      Producto.count((err,proData)=>{
        res.json({
          ok:true,
          producto: productoData,
          count: proData
        })
      })
    })
})

//=============================
//list all product
//=============================
app.get('/producto/:id',verificarToken, (req, res)=>{
  let id = req.params.id;

  Producto.find({_id: id, disponible: true})
    .populate('usuario')
    .populate('categoria')
    .exec((err, productoData)=>{
      if (err) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "No encontrado, el recurso solicitado no existe."
          }
        })
      }

      res.json({
        ok:true,
        producto: productoData
      })
    })
})

//=============================
//crear producto
//=============================
app.post('/producto', [verificarToken, verifyRolUser], (req, res)=>{
  let body = req.body
  let idUser = req.usuario._id

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precio,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: idUser
  });

  producto.save((err, productoData)=>{
    if(err) {
      return res.status(400).json({
        ok:false,
        err: {
          message: "Registro duplicado"
        }
      })
    } 
    res.json({
      ok: true,
      producto: productoData
    })
  })
} )

//=============================
//actualizar producto
//=============================
app.put('/producto/:id', [verificarToken, verifyRolUser],(req, res)=>{
  let id = req.params.id;
  
  let body = {
    nombre: req.body.nombre,
    precioUni: req.body.precio,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
    usuario: req.usuario._id
  }

  Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, productoData)=> {
    if(err) {
      return res.status(404).json({
        ok:false,
        err: {
          message: "El recurso solicitado no existe."
        }
      })
    }

    if(!productoData) {
      return res.status(400).json({
        ok:false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }
    res.json({
      ok: true,
      producto: productoData
    })
  })

});

//=============================
//Eliminar producto
//=============================
app.delete('/producto/:id', [verificarToken, verifyRolUser], (req, res)=>{
  let id= req.params.id

  let Change = {
    disponible: false
  }

  Producto.findByIdAndUpdate(id, Change, (err, productoDelete) => {

    if(err) {
      return res.status(400).json({
        ok:false,
        err
      })
    } 
    
    if(!productoDelete) {
      return res.status(400).json({
        ok:false,
        err: {
          message: 'Producto no encontrada'
        }
      })
    }

    res.json({
      ok:true,
      message: "Eliminación completa"
    })
  })
});

//=============================
//buscar producto
//=============================

app.get('/producto/buscar/:termino', verificarToken,(req, res)=>{
  let termino = req.params.termino
  let regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex })
    .populate('usuario', 'nombre')
    .exec((err, productoData)=>{
      if (err) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "No encontrado, el recurso solicitado no existe."
          }
        })
      }

      res.json({
        ok:true,
        producto: productoData
      })
    })
})

module.exports = app;