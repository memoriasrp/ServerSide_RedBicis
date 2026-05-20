const mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta'); // Asegúrate de que la primera letra coincida con tu importación
const Usuario = require('../../models/usuario');
const Reserva = require('../../models/reserva');

describe('Testing Usuario', function () {
    beforeAll(async function () {
        const mongoDB = 'mongodb://localhost/testdb';

        // Si ya hay una conexión abierta (desde app.js), la cerramos primero
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }

        await mongoose.connect(mongoDB);
        console.log('API Testing: Conectado exitosamente a testdb.');
    });
    beforeEach(async function () {
        try {
            // Limpiamos absolutamente todo para empezar cada test desde cero
            await Bicicleta.deleteMany({});
            await Usuario.deleteMany({});
            await Reserva.deleteMany({});

            // Reiniciamos el contador del código autoincrementable
            if (mongoose.connection.models['Counter']) {
                await mongoose.connection.models['Counter'].deleteMany({});
            }
        } catch (err) {
            console.error('Error al limpiar las colecciones del modelo:', err);
        }
    });
    // 3. Cerrar la conexión limpia al finalizar
    afterAll(async function () {
        await mongoose.connection.close();
    });
    // Limpiamos la colección después de CADA test usando promesas (async/await)
    afterEach(async function () {
        try {
            await Usuario.deleteMany({});
            await Bicicleta.deleteMany({});
            await Reserva.deleteMany({});
        } catch (err) {
            console.error('Error al limpiar la base de datos:', err);
        }
    });

    describe('Usuario.reservar', function () {
        it('debe reservar una bicicleta', async function () {
            try {
                // Crear una bicicleta de prueba
                const bici = new Bicicleta({
                    code: 1,
                    color: 'rojo',
                    modelo: 'urbana',
                    ubicacion: [-16.39101, -71.56141]
                });
                await bici.save();
                // Crear un usuario de prueba
                const usuario = new Usuario({
                    nombre: 'Juan Perez',
                    email: 'juan@mail.com',
                    password: '123456'
                });
                await usuario.save();
                // Realizar la reserva
                const desde = new Date();
                const hasta = new Date(desde.getTime() + 60 * 60 * 1000); // 1 hora después
                await usuario.reservar(bici._id, desde, hasta);
                // Verificar que la reserva se haya creado correctamente
                const reservas = await Reserva.find({ usuario: usuario._id }).populate('bicicleta');
                expect(reservas.length).toBe(1);
                expect(reservas[0].bicicleta.code).toBe(1);
                expect(reservas[0].desde.getTime()).toBe(desde.getTime());
                expect(reservas[0].hasta.getTime()).toBe(hasta.getTime());
            } catch (err) {
                console.error('Error en el test de reservar:', err);
                throw err; // Asegúrate de que el error falle el test
            }
        });
    });
});

describe('Testing Bicicleta', function () {
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

    // 2. Limpiamos la colección después de CADA test usando promesas (async/await)
    afterEach(async function () {
        try {
            await Bicicleta.deleteMany({});
        } catch (err) {
            console.error('Error al limpiar la base de datos:', err);
        }
    });

    // 3. Cerramos la conexión una sola vez al FINALIZAR todo el archivo


    describe('Bicicleta.createInstance', function () {
        it('crea una instancia de bicicleta', function () {
            // Nota: Verifica si tu modelo usa 'Bicicleta' en mayúscula o minúscula
            var bici = Bicicleta.createInstance(1, 'rojo', 'urbana', -16.39101, -71.56141);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe('rojo');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toBe(-16.39101);
            expect(bici.ubicacion[1]).toBe(-71.56141);
        });
    });

    describe('Bicicleta.allBicis', function () {
        it('debe devolver un arreglo de bicicletas', async function () {
            try {
                const bicis = await Bicicleta.allBicis();
                expect(bicis.length).toBe(0); // Asegúrate de que la base de datos esté limpia antes de este test
                expect(Array.isArray(bicis)).toBe(true);
            } catch (err) {
                console.error('Error en el test de allBicis:', err);
                throw err; // Asegúrate de que el error falle el test
            }
        });
    });

    describe('Bicicleta.add', function () {
        it('agrega una bicicleta a la base de datos', async function () {
            try {
                const bici = new Bicicleta({
                    color: 'rojo',
                    modelo: 'urbana',
                    ubicacion: [-16.39101, -71.56141]
                });
                const biciGuardada = await bici.save();
                const bicis = await Bicicleta.allBicis();
                expect(bicis.length).toBe(1);
                expect(bicis[0].code).toBe(biciGuardada.code);
                expect(bicis[0].color).toBe('rojo');
                expect(bicis[0].modelo).toBe('urbana');
                expect(bicis[0].ubicacion[0]).toBe(-16.39101);
                expect(bicis[0].ubicacion[1]).toBe(-71.56141);
            } catch (err) {
                console.error('Error en el test de add:', err);
                throw err; // Asegúrate de que el error falle el test
            }
        });
    });

    describe('Bicicleta.findByCode', function () {
        it('debe devolver la bicicleta con code 1', async function () {
            try {
                const bici = new Bicicleta({
                    color: 'rojo',
                    modelo: 'urbana',
                    ubicacion: [-16.39101, -71.56141]
                });
                const biciGuardada = await bici.save();
                const foundBici = await Bicicleta.findByCode(biciGuardada.code);
                expect(foundBici).not.toBeNull();
                expect(foundBici.code).toBe(biciGuardada.code);
                expect(foundBici.color).toBe('rojo');
                expect(foundBici.modelo).toBe('urbana');
                expect(foundBici.ubicacion[0]).toBe(-16.39101);
                expect(foundBici.ubicacion[1]).toBe(-71.56141);
            } catch (err) {
                console.error('Error en el test de findByCode:', err);
                throw err; // Asegúrate de que el error falle el test
            }
        });
    });
});
