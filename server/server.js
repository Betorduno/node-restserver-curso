require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')

//configuracion global de rutas
app.use(require('./routes/index'));

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')))

mongoose.connect(process.env.urlDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
},(err)=>{
  if(err) throw err;

  console.log('Base de datos online')
})

app.listen(process.env.PORT, ()=>{
  console.log(`Escuchando por el puerto ${process.env.PORT }`) 
})