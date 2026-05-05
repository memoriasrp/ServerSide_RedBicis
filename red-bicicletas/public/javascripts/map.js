var map = L.map('map').setView([-16.3869, -71.5531], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([-16.38, -71.55]).addTo(map);

var circle = L.circle([-16.389443, -71.55112], {
    color: 'green',
    fillColor: 'green',
    fillOpacity: 0.5,
    radius: 10
}).addTo(map);

var polygon = L.polygon([
    [-16.383940, -71.551630], // A
    [-16.383916, -71.551566], // B
    [-16.383829, -71.551339], // C
    [-16.384408, -71.551380], // D
    [-16.384492, -71.551448], // E
    [-16.384350, -71.551469], // F
    [-16.384426, -71.551540], // G
    [-16.384471, -71.551574], // H
    [-16.384480, -71.551582], // I
    [-16.384358, -71.551598], // J
    [-16.384257, -71.551486]  // K
]).addTo(map);



marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

// Definir sistemas de coordenadas
const psad56_utm19s = '+proj=utm +zone=19 +south +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

// Vértices del cuadro técnico
const vertices = {
    A: [227701.2761, 8186647.0257],
    B: [227707.3495, 8186649.6600],
    C: [227726.6841, 8186569.1245],
    D: [227728.5201, 8186593.7034],
    E: [227724.4192, 8186604.9935],
    F: [227720.2798, 8186609.9435],
    G: [227719.1183, 8186586.5315],
    H: [227709.0778, 8186578.5175],
    I: [227707.5887, 8186607.2960],
    J: [227707.5887, 8186607.2960],
    K: [227719.7839, 8186611.2991]
};

// Convertir todos los vértices a WGS84
const polygonCoords = Object.values(vertices).map(([x, y]) => {
    const [lon, lat] = proj4(psad56_utm19s, wgs84, [x, y]);
    return [lat, lon]; // Leaflet usa [lat, lon]
});


// Dibujar el polígono
var polygon2 = L.polygon(polygonCoords, {
    color: 'red',
    weight: 2
}).addTo(map);

// Centrar el mapa en el polígono
map.fitBounds(polygon2.getBounds());