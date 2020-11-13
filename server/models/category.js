const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, "La descripcion de la categoria es requerida."]
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
})

module.exports = mongoose.model('Category', categorySchema);