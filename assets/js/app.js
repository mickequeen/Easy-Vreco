/*var options = {
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
};*/
/*
*inicializando el mapa
*/
  function initMap() {
    /*
    *ingresando coordenadas por defecto (lab)
    */
    var myLatLng = {lat: -33.418862, lng: -70.641766}
    /*
    *adquiere elemento dnde depositar mapa
    */
    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng ,
      zoom: 14
    });
    new AutocompleteDirectionsHandler(map);
    /*
    *adquiriendo localizacion en el mapa
    */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      var image = 'http://www.bikebarn.co.nz/media/wysiwyg/home-icon-bike.png'
      var bikeMarker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: image,
        title: 'Aquí te encuentras!'
        });
      map.setCenter(pos);
      map.setZoom(16);
      }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
      }
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
            window.alert("Please select an option from the dropdown list.");
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
            me.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      };

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
      }