var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Counter = require('./counter'); // Importamos el modelo de contadores

// 1. Definimos la estructura que tendrá cada bicicleta en la base de datos
var bicicletaSchema = new Schema({
    code: { type: Number, unique: true },
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number],
        index: { type: '2dsphere', sparse: true }
    }
});

bicicletaSchema.pre('save', async function (next) {
    const doc = this;
    // Si el documento ya tiene un código (por ejemplo, si lo estás editando), no hacemos nada
    if (!doc.isNew) {
        return;
    }
    try {
        // Usamos await en lugar de .then()
        // Cambiamos 'new: true' por 'returnDocument: 'after'' para quitar el Warning
        const counter = await Counter.findOneAndUpdate(
            { id: 'bicicletaId' },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        );

        doc.code = counter.seq; // Asignamos el código autoincrementado
    } catch (error) {
        // En funciones async, los errores se lanzan con throw para que Mongoose los ataje
        console.error('Error al generar el código autoincrementable:', error);
        throw error;
    }
});

// 2. Método de instancia (ej: bici.toString())
bicicletaSchema.methods.toString = function () {
    return 'code: ' + this.code + ' | color: ' + this.color;
};
// READ: Obtener todas
bicicletaSchema.statics.allBicis = function () {
    return this.find({}); // Devuelve una promesa con todas las bicis de la BD
};
// CREATE: Agregar una nueva
bicicletaSchema.statics.add = function (aBici) {
    return this.create(aBici); // Guarda la bicicleta directamente en MongoDB
};

// READ ONE: Buscar por código
bicicletaSchema.statics.findByCode = function (aCode) {
    return this.findOne({ code: aCode });
};
// DELETE: Eliminar por código
bicicletaSchema.statics.removeByCode = function (aCode) {
    return this.deleteOne({ code: aCode });
};

bicicletaSchema.statics.createInstance = function (code, color, modelo, lat, lng) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: [lat, lng]
    });
};


module.exports = mongoose.model('Bicicleta', bicicletaSchema);
