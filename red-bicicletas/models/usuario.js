var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Reserva = require('./reserva');

var usuarioSchema = new Schema({
    nombre: String,
    email: String,
    password: String
});

usuarioSchema.methods.reservar = function (bicicletaId, desde, hasta, cb) {
    var reserva = new Reserva({
        usuario: this._id,
        bicicleta: bicicletaId,
        desde: desde,
        hasta: hasta
    });
    console.log(reserva);
    return reserva.save(cb);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
