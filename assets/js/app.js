function initMap() {
  /*
  *ingresando coordenadas por defecto (lab)
  */
  var myLatLng = {lat: -33.418862, lng: -70.641766};
  /*
  *adquiere elemento dnde depositar mapa
  */
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 14
  });
  $('#traffic').click(function() {
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  });
  new AutocompleteDirectionsHandler(map);
  /*
  *adquiriendo localizacion en el mapa con botón encuentrame
  */
  const posicionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(functionSuccess, functionError);
    }
  };
  document.getElementById('encuentrame').addEventListener('click', posicionActual);
  var latitud, longitud;
  var functionSuccess = (position) => {
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;
    var miUbicacion = new google.maps.Marker({
      position: { lat: latitud, lng: longitud },
      animation: google.maps.Animation.DROP,
      map: map,
    });
    map.setZoom(17);
    map.setCenter({ lat: latitud, lng: longitud });
  };
  var functionError = (error) => {
    alert('Tenemos un problema con encontrar tu ubicación');
  };
}

function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'WALKING';
  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);
  var originAutocomplete = new google.maps.places.Autocomplete(
    originInput, {placeIdOnly: true});
  var destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput, {placeIdOnly: true});
  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.place_id) {
      window.alert('Please select an option from the dropdown list.');
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;
  this.directionsService.route({
    origin: {'placeId': this.originPlaceId},
    destination: {'placeId': this.destinationPlaceId},
    travelMode: this.travelMode
  }, function(response, status) {
    if (status === 'OK') {
      $('#ruta').click(() => {
        if ($('#origen').val() === '') {
          alert('Debes ingresar una ruta');
        } else {
          me.directionsDisplay.setDirections(response);
          $('#origin-input').val('');
          $('#destination-input').val('');
        }
      });
    } else {
      window.alert('Se ha producido un error en la solicitud de ' + status);
    }
  });
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
};