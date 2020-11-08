require('./config/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(require('./routes/usuarios'));

mongoose.connect(process.env.URLDB, {
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