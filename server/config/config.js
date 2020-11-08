//puerto
 
process.env.PORT = process.env.PORT || 3000

//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 3000

//base de datos
let urlDB ;

if(process.env.NODE_ENV === 'dev') {
 urlDB ='mongodb://localhost:27017/cafe'
} else {
  urlDB ='mongodb+srv://strider:xy174alb@cluster0.bpchn.mongodb.net/cafe'
}

process.env.URLDB = urlDB;