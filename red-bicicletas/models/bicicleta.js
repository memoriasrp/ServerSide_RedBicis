var Bicicleta = function (id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
};

Bicicleta.prototype.toString = function () {
    return 'id: ' + this.id + ' | color: ' + this.color;
};

Bicicleta.allBicis = [];

Bicicleta.add = function (bici) {
    Bicicleta.allBicis.push(bici);
};

Bicicleta.findById = function (aBiciId) {
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId);
    if (aBici) {
        return aBici;
    } else {
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);
    }
};

Bicicleta.removeById = function (aBiciId) {
    for (var i = 0; i < Bicicleta.allBicis.length; i++) {
        if (Bicicleta.allBicis[i].id == aBiciId) {
            Bicicleta.allBicis.splice(i, 1);
            return;
        }
    }
};

/* var bici1 = new Bicicleta(1, 'rojo', 'urbana', [-16.39159, -71.55123]);
var bici2 = new Bicicleta(2, 'verde', 'montaña', [-16.38512, -71.55122]);
var bici3 = new Bicicleta(3, 'azul', 'eléctrica', [-16.39101, -71.56141]);

Bicicleta.add(bici1);
Bicicleta.add(bici2);
Bicicleta.add(bici3);
 */
module.exports = Bicicleta;