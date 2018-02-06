var options = {
  enableHighAccuracy : true,
  timeout: 6000,
  maximumAge: 0
};

navigator.geolocation.getCurrentPosition( success, error, options );

function success(position) {
  var coordenadas = position.coords;
  console.log('Tu posición actual es: ');
  console.log('Latitud: ' + coordenadas.latitude);
  console.log('Longitud: ' + coordenadas.longitude);
  console.log('Más o menos ' + coordenadas.accuracy + ' metros. ');

};

function error(error) {
  console.error('ERROR(' + error.code + '): ' + error.message);
};