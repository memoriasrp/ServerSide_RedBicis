var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = async function (req, res) {
    try {
        const bicicletas = await Bicicleta.allBicis();
        res.status(200).json({
            bicicletas: bicicletas
        });
    } catch (err) {
        console.error('Error al obtener bicicletas:', err);
        res.status(500).json({ error: 'Error al obtener bicicletas' });
    }
}

exports.bicicleta_create_get = async function (req, res) {
    res.status(200).json({ message: 'Formulario para crear bicicleta' });
}

exports.bicicleta_create_post = async function (req, res) {
    try {
        const newbici = {
            color: req.body.color,
            modelo: req.body.modelo,
            ubicacion: [req.body.lat, req.body.lng]
        };
        const savedBici = await Bicicleta.add(newbici);
        res.status(201).json({
            bicicleta: savedBici,
            message: 'Bicicleta creada exitosamente'
        });
    }
    catch (err) {
        console.error('Error al crear bicicleta:', err);
        res.status(500).json({ error: 'Error al crear bicicleta' });
    }

}

// 3. READ ONE (Obtener una sola por su code)
exports.bicicleta_detail = async function (req, res) {
    try {
        const bici = await Bicicleta.findByCode(req.params.code);
        if (!bici) return res.status(404).json({ error: "Bicicleta no encontrada" });

        res.status(200).json({ bicicleta: bici });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.bicicleta_update_get = async function (req, res) {
    var bici = await Bicicleta.findByCode(req.params.code);
    if (!bici) return res.status(404).json({ error: "Bicicleta no encontrada" });
    res.status(200).json({ message: 'Formulario para actualizar bicicleta', bicicleta: bici });
}

exports.bicicleta_update_post = async function (req, res) {
    try {
        console.log("iniciando el update");
        console.log(req.body);
        console.log(req.params);
        var bici = await Bicicleta.findByCode(req.params.code);
        if (!bici) return res.status(404).json({ error: "Bicicleta no encontrada" });
        bici.color = req.body.color || bici.color;
        bici.modelo = req.body.modelo || bici.modelo;
        if (req.body.lng && req.body.lat) {
            bici.ubicacion = [req.body.lng, req.body.lat];
        }
        // Guardamos los cambios en MongoDB
        const biciActualizada = await bici.save();
        res.status(200).json({ bicicleta: bici, bicicleta: biciActualizada });
    }
    catch (err) {
        console.error('Error al actualizar bicicleta:', err);
        res.status(500).json({ error: 'Error al actualizar bicicleta' });
    }

}


exports.bicicleta_delete_post = async function (req, res) {
    try {
        console.log("iniciando el delete3");
        const codigoBici = parseInt(req.params.code, 10);
        console.log(codigoBici);
        const resultado = await Bicicleta.removeByCode(codigoBici);
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "No se encontró la bicicleta para eliminar" });
        }
        res.status(204).send(); // 204 significa "No Content", la eliminación fue exitosa
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.bicicleta_delete_postBody = async function (req, res) {
    try {
        const resultado = await Bicicleta.removeByCode(req.body.code);
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "No se encontró la bicicleta para eliminar" });
        }
        res.status(204).send(); // 204 significa "No Content", la eliminación fue exitosa
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


