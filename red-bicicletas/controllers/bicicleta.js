const e = require('express');
var Bicicleta = require('../models/bicicleta');
exports.bicicleta_list = function (req, res) {
    res.render('bicicletas/index', {
        bicicletas: Bicicleta.allBicis
    });
}

exports.bicicleta_create_get = function (req, res) {
    res.render('bicicletas/create');
}

exports.bicicleta_create_post = function (req, res) {

    const ids = Bicicleta.allBicis.map(b => parseInt(b.id));

    // 2. Calculamos el nuevo ID (si no hay bicis, empezamos en 1)
    const nuevoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    var bici = new Bicicleta(nuevoId, req.body.color, req.body.modelo, [req.body.lat, req.body.lng]);
    Bicicleta.add(bici);
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function (req, res) {
    Bicicleta.removeById(req.params.id);
    res.redirect('/bicicletas');
}

exports.bicicleta_update_get = function (req, res) {
    var bici = Bicicleta.findById(req.params.id);
    res.render('bicicletas/update', {
        bicicleta: bici
    });
}

exports.bicicleta_update_post = function (req, res) {
    var bici = Bicicleta.findById(req.params.id);
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];
    res.redirect('/bicicletas');
}