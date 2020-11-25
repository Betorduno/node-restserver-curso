const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario')
const Productos = require('../models/producto')

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

  let tipo = req.params.tipo
  let id = req.params.id

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok:false,
      err: {
        message: "No se ha seleccionado ningun archivo."
      }
    });
  }

  //validar tipo 
  let tiposValidos = ['productos', 'usuarios'];

  if(tiposValidos.indexOf(tipo)< 0){
    return res.status(400).json({
      ok:false,
      err: {
        message: 'Tipos permitidos: ' + tiposValidos.join(', ')
      }
    })
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let nameRecort = archivo.name.split('.');
  let ext = nameRecort[nameRecort.length-1];
  //Etenciones permitidas
  let extValidas = ['png', 'jpg', 'gif', 'jpeg']

  if(extValidas.indexOf(ext)< 0) {
    return res.status(400).json({
      ok:false,
      err: {
        message: 'Las extenciones permitidas son ' + extValidas.join(', ')
      }
    })
  }

  //cambiar nombre al archivo unico

  let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${ext}`

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err)=> {
    if (err){
      return res.status(500).json({
        ok:false,
        err
      });
    }
    //Aqui, ya esta cargada la imagen 
    if (tipo == 'usuarios') {
      imagenUsuario(id, res, nombreArchivo)
    } else {
      imagenProducto(id, res, nombreArchivo )
    }
  });

});

function imagenUsuario(id, res, nombreArchivo){
 Usuario.findById(id, (err, userDB)=>{
  if (err) {
    deleteFile(nombreArchivo, 'usuarios')
    return res.status(500).json({
      ok: false,
      err
    })
  }
  if (!userDB) {
    deleteFile(nombreArchivo, 'usuarios')
    return res.status(400).json({
      ok: false,
      err: {
        message: 'usuario no exite'
      }
    })
  }

  //path imagen usuario
  // let pathImagen = path.resolve(__dirname,`../../uploads/usuarios/${userDB.img}`)
  // if(fs.existsSync(pathImagen)){
  //   fs.unlinkSync(pathImagen);
  // }
  deleteFile(userDB.img, 'usuarios')

  userDB.img = nombreArchivo

  userDB.save((err, userDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err: {
          message: 'La imagen no se registró.'
        }
      })
    }

    res.json({
      ok: true,
      usuario: userDB
    })
  })
 })
}

function imagenProducto(id, res, nombreArchivo){
  Productos.findById(id, (err, prodDB)=>{
    if (err) {
      deleteFile(nombreArchivo, 'productos')
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!prodDB) {
      deleteFile(nombreArchivo, 'productos')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no exite'
        }
      })
    }
  
    //path imagen usuario
    // let pathImagen = path.resolve(__dirname,`../../uploads/usuarios/${userDB.img}`)
    // if(fs.existsSync(pathImagen)){
    //   fs.unlinkSync(pathImagen);
    // }
    deleteFile(prodDB.img, 'productos')
  
    prodDB.img = nombreArchivo
  
    prodDB.save((err, prodDB)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err: {
            message: 'La imagen no se registró.'
          }
        })
      }
  
      res.json({
        ok: true,
        producto: prodDB
      })
    })
   })
}

function deleteFile(nameImage, tipo){
  let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nameImage}`)

  if(fs.existsSync(pathImagen)){
    fs.unlinkSync(pathImagen);
  }
}

module.exports= app;