const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const Bicicleta = require('../../models/bicicleta');

describe('Bicicleta API', function () {

    // 1. Conectar de forma segura cerrando conexiones previas
    beforeAll(async function () {
        const mongoDB = 'mongodb://localhost/testdb';

        // Si ya hay una conexión abierta (desde app.js), la cerramos primero
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }

        await mongoose.connect(mongoDB);
        console.log('API Testing: Conectado exitosamente a testdb.');
    });

    // 3. Cerrar la conexión limpia al finalizar
    afterAll(async function () {
        await mongoose.connection.close();
    });

    // 2. CORRECCIÓN CRÍTICA: Limpiar bicicletas Y contadores antes de cada test
    beforeEach(async function () {
        try {
            // Borramos todas las bicicletas de prueba
            await Bicicleta.deleteMany({});

            // Accedemos dinámicamente al modelo de contadores de Mongoose para resetear la secuencia
            if (mongoose.connection.models['Counter']) {
                await mongoose.connection.models['Counter'].deleteMany({});
            }
        } catch (err) {
            console.error('Error al limpiar la base de datos de pruebas:', err);
        }
    });

    // ==========================================
    // TEST: READ ALL (GET /api/bicicletas)
    // ==========================================
    describe('GET /api/bicicletas', function () {
        it('debe devolver un status 200 y una lista con las bicicletas existentes', function (done) {
            const biciPrueba = new Bicicleta({ color: 'verde', modelo: 'urbana', ubicacion: [-16.3, -71.5] });

            biciPrueba.save()
                .then(() => {
                    request(app)
                        .get('/api/bicicletas')
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            if (err) return done(err);
                            expect(res.body.bicicletas.length).toBe(1);
                            expect(res.body.bicicletas[0].color).toBe('verde');
                            done();
                        });
                })
                .catch(err => done.fail(err));
        });
    });

    // ==========================================
    // TEST: CREATE (POST /api/bicicletas/create)
    // ==========================================
    describe('POST /api/bicicletas/create', function () {
        it('debe crear una nueva bicicleta y autoincrementar su campo code', function (done) {
            const nuevaBiciJson = {
                color: 'azul',
                modelo: 'electrica',
                lat: -16.38170,
                lng: -71.55190
            };

            request(app)
                .post('/api/bicicletas/create')
                .send(nuevaBiciJson)
                .expect(201)
                .end(function (err, res) {
                    if (err) return done(err);

                    expect(res.body.bicicleta).toBeDefined();
                    expect(res.body.bicicleta.code).toBe(1); // Ahora que el contador se limpia, siempre será 1
                    expect(res.body.bicicleta.color).toBe('azul');
                    expect(res.body.bicicleta.modelo).toBe('electrica');
                    expect(res.body.bicicleta.ubicacion).toEqual([-16.38170, -71.55190]);
                    done();
                });
        });
    });

    // ==========================================
    // TEST: READ ONE (GET /api/bicicletas/:code)
    // ==========================================
    describe('GET /api/bicicletas/:code', function () {
        it('debe devolver el detalle de una bicicleta específica por su código', function (done) {
            const biciPrueba = new Bicicleta({ color: 'blanco', modelo: 'montaña', ubicacion: [0, 0] });

            biciPrueba.save()
                .then((biciGuardada) => {
                    request(app)
                        .get(`/api/bicicletas/${biciGuardada.code}`)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) return done(err);
                            expect(res.body.bicicleta.color).toBe('blanco');
                            expect(res.body.bicicleta.code).toBe(biciGuardada.code);
                            done();
                        });
                })
                .catch(err => done.fail(err));
        });
    });

    // ==========================================
    // TEST: UPDATE (PUT /api/bicicletas/:code/update)
    // ==========================================
    describe('POST /api/bicicletas/:code/update', function () {
        it('debe modificar las propiedades de una bicicleta existente', function (done) {
            const biciPrueba = new Bicicleta({ color: 'negro', modelo: 'pista', ubicacion: [0, 0] });

            biciPrueba.save()
                .then((biciGuardada) => {
                    const datosActualizados = {
                        color: 'rosado',
                        modelo: 'paseo'
                    };

                    request(app)
                        .post(`/api/bicicletas/${biciGuardada.code}/update`)
                        .send(datosActualizados)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) return done(err);
                            expect(res.body.bicicleta.color).toBe('rosado');
                            expect(res.body.bicicleta.modelo).toBe('paseo');
                            expect(res.body.bicicleta.code).toBe(biciGuardada.code);
                            done();
                        });
                })
                .catch(err => done.fail(err));
        });
    });

    // ==========================================
    // TEST: DELETE (DELETE /api/bicicletas/:code/delete)
    // ==========================================
    describe('POST /api/bicicletas/:code/delete', function () {
        it('debe eliminar la bicicleta de la base de datos y retornar status 204', function (done) {
            const biciPrueba = new Bicicleta({ color: 'amarillo', modelo: 'bmx', ubicacion: [0, 0] });

            biciPrueba.save()
                .then((biciGuardada) => {
                    request(app)
                        .post(`/api/bicicletas/${biciGuardada.code}/delete`)
                        .expect(204)
                        .end(function (err) {
                            if (err) return done(err);

                            Bicicleta.findOne({ code: biciGuardada.code })
                                .then(bici => {
                                    expect(bici).toBeNull();
                                    done();
                                })
                                .catch(e => done.fail(e));
                        });
                })
                .catch(err => done.fail(err));
        });
    });
});