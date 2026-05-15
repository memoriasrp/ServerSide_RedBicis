var bicicleta = require('../../models/bicicleta');

describe('Bicicleta', function () {
    beforeEach(function () {
        bicicleta.allBicis = [];
    });
    describe('Bicicleta.allBicis', function () {
        it('comienza vacía', function () {
            expect(bicicleta.allBicis.length).toBe(0);
        });
    });

    describe('Bicicleta.add', function () {
        it('agrega una bicicleta', function () {
            var aBici = new bicicleta(1, 'azul', 'eléctrica', [-16.39101, -71.56141]);
            bicicleta.add(aBici);

            expect(bicicleta.allBicis.length).toBe(1);

            // Si tu modelo usa 'id', cámbialo aquí. Si usa 'code', asegúrate de que el modelo lo asigne.
            expect(bicicleta.allBicis[0].id).toBe(1);
        });
    });
    describe('Bicicleta.findById', function () {
        it('debe devolver la bicicleta con id 1', function () {
            var aBici = new bicicleta(1, 'azul', 'eléctrica', [-16.39101, -71.56141]);
            bicicleta.add(aBici);
            var foundBici = bicicleta.findById(1);
            expect(foundBici).toBe(aBici);
        });
    });

});
