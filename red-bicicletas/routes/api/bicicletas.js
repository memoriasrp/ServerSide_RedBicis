var express = require('express');
var router = express.Router();
var bicicletaController = require('../../controllers/api/bicicletaControllerAPI');

router.get('/', bicicletaController.bicicleta_list);
router.get('/:code', bicicletaController.bicicleta_detail);
router.get('/create', bicicletaController.bicicleta_create_get);
router.post('/create', bicicletaController.bicicleta_create_post);
router.post('/:code/delete', bicicletaController.bicicleta_delete_post);
router.post('/delete', bicicletaController.bicicleta_delete_postBody);
router.get('/:code/update', bicicletaController.bicicleta_update_get);
router.post('/:code/update', bicicletaController.bicicleta_update_post);
module.exports = router;