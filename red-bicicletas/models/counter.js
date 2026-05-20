const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    id: { type: String, required: true, unique: true }, // Ejemplo: 'bicicletaId'
    seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);