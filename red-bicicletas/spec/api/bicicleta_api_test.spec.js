const request = require('supertest');
const app = require('../../app'); // Importas tu app de Express

var Bicicleta = require('../../models/bicicleta');


describe('Bicicleta API', function () {
    beforeEach(() => Bicicleta.allBicis = []);

    describe('GET /api/bicicletas0', () => {
        it('Status 200', (done) => {
            Bicicleta.add(new Bicicleta(1, 'rojo', 'bmx', [0, 0]));

            request(app)
                .get('/api/bicicletas')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.body.bicicletas.length).toBe(1);
                    done();
                });
        });
    });

    describe('GET /api/bicicletas', function () {
        it('debe devolver un arreglo de bicicletas', function (done) {
            request(app)
                .get('/api/bicicletas')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (error, response) {
                    if (error) return done(error);
                    // IMPORTANTE: Supertest ya te da el objeto en response.body
                    // No hace falta JSON.parse
                    expect(response.body.bicicletas).toBeInstanceOf(Array);
                    done(); // Avisamos que el test terminó
                });
        });
    });
    describe('POST /api/bicicletas/create', function () {
        it('debe crear una nueva bicicleta', function (done) {
            const nuevaBici = {
                id: 1,
                color: 'rojo',
                modelo: 'urbana',
                lat: -16.39101, // Asegúrate de que tu controlador use estos nombres
                lng: -71.56141
            };

            request(app)
                .post('/api/bicicletas/create')
                .send(nuevaBici) // Enviamos el JSON
                .expect(201)
                .end(function (error, response) {
                    if (error) return done(error);

                    // Validamos la respuesta
                    // Nota: Supertest parsea el JSON automáticamente en response.body
                    expect(response.body.bicicleta.id).toBe(1);
                    expect(response.body.bicicleta.color).toBe('rojo');
                    expect(response.body.bicicleta.modelo).toBe('urbana');

                    // Si tu API devuelve la ubicación como un array en el objeto:
                    expect(response.body.bicicleta.ubicacion).toEqual([-16.39101, -71.56141]);

                    done();
                });

        });
    });
});