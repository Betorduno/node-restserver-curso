require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//configuracion global de rutas
app.use(require('./routes/index'));

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