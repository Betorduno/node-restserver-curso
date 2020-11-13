const express = require('express')
let { verificarToken, verifyRolUser } = require('../middlewares/auth')
let app = express();

let Category = require('../models/category');

//=============================
//list all category
//=============================
app.get('/category',verificarToken, (req, res)=>{

  Category.find()
    .sort('description')//ordenar la data
    .populate('userID') //revisa que object id existe y permite cargar la im¡nfo de ese campo
    .exec((err,categoryData)=>{
      if (err) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "No encontrado, el recurso solicitado no existe."
          }
        })
      }
     
      Category.count((err,catData)=>{
        res.json({
          ok:true,
          category:categoryData,
          count: catData
        })
      })
    })
});
//=============================
//list all category for id
//=============================
app.get('/category/:id', verificarToken , (req, res)=>{
  let catId = req.params.id;

  Category.findById(catId, (err, catOne)=>{
    if (err) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "No encontrado, el recurso solicitado no existe."
        }
      })
    }

    res.json({
      ok: true,
      category: catOne
    })
  })
});
//=============================
//create category
//=============================
app.post('/category', [verificarToken, verifyRolUser], (req, res)=>{
  let body = req.body
  
  let category = new Category({
    description: body.description,
    userID: req.usuario._id
  })
  
  category.save((err, categoryData)=>{
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
      category: categoryData
    })
  })
});
//=============================
//Update category
//=============================
app.put('/category/:id', [verificarToken, verifyRolUser],(req, res)=>{
  let id = req.params.id;
  console.log(req.params);
  
  let body = {
    description: req.body.description
  }

  Category.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, categoryData)=> {
    if(err) {
      return res.status(404).json({
        ok:false,
        err: {
          message: "El recurso solicitado no existe."
        }
      })
    }

    if(!categoryData) {
      return res.status(400).json({
        ok:false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }
    res.json({
      ok: true,
      category: categoryData
    })
  })

});
//=============================
//Delete category with id
//=============================
app.delete('/category/:id', [verificarToken, verifyRolUser], (req, res)=>{
  let id= req.params.id

  Category.findByIdAndRemove(id, (err, categoryDelete) => {

    if(err) {
      return res.status(400).json({
        ok:false,
        err
      })
    } 

    console.log(categoryDelete);
    
    if(!categoryDelete) {
      return res.status(400).json({
        ok:false,
        err: {
          message: 'Categoria no encontrada'
        }
      })
    }

    res.json({
      ok:true,
      message: "Mensaje Borrado"
    })
  })
});

module.exports = app;