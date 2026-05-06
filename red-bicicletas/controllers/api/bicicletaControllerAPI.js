var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function (req, res) {
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    });
}

exports.bicicleta_create_get = function (req, res) {
    res.status(200).json({ message: 'Formulario para crear bicicleta' });
}

exports.bicicleta_create_post = function (req, res) {
    const ids = Bicicleta.allBicis.map(b => parseInt(b.id));
    console.log(ids);
    const nuevoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    var bici = new Bicicleta(nuevoId, req.body.color, req.body.modelo, [req.body.lat, req.body.lng]);
    Bicicleta.add(bici);
    res.status(201).json({
        bicicleta: bici,
        message: 'Bicicleta creada exitosamente'
    });
}

exports.bicicleta_delete_post = function (req, res) {
    Bicicleta.removeById(req.params.id);
    res.status(204).json({ message: 'Bicicleta eliminada exitosamente' });
}

exports.bicicleta_delete_postBody = function (req, res) {
    Bicicleta.removeById(req.body.id);
    res.status(204).json({ message: 'Bicicleta eliminada exitosamente' });
}

exports.bicicleta_update_get = function (req, res) {
    var bici = Bicicleta.findById(req.params.id);
    res.status(200).json({ message: 'Formulario para actualizar bicicleta', bicicleta: bici });
}

exports.bicicleta_update_post = function (req, res) {
    var bici = Bicicleta.findById(req.params.id);
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];
    res.status(200).json({
        bicicleta: bici,
        message: 'Bicicleta actualizada exitosamente'
    });
}