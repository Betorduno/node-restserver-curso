//puerto
 
process.env.PORT = process.env.PORT || 3000

//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//vencimiento del token
//60 segundos
//60 minutos
//24 horas
//30 dias 
process.env.CADUCIDAD = Math.floor(Date.now() / 1000) + (60 * 60);

//seed de autenticacion 
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//base de datos
var urlDB ;

if(process.env.NODE_ENV === 'dev') {
 urlDB ='mongodb://localhost:27017/cafe'
} else {
  urlDB =process.env.MONGO_URI
}

process.env.urlDB = urlDB;

//client id google

process.env.CLIENT_ID = process.env.CLIENT_ID || '51340476744-sv36d9h3ucin0a1q2li7teu2qdpq6uh4.apps.googleusercontent.com'