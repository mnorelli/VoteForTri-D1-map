var centerD1 = [-122.246048,37.852483]

mapboxgl.accessToken = TOKEN;
var map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/mapbox/streets-v11',
  center: centerD1, 
  zoom: 12.6, 
});

var geocoder = new MapboxGeocoder({ 
  accessToken: mapboxgl.accessToken, 
  placeholder: 'Search in District 1',
  mapboxgl: mapboxgl,
  marker: {color: 'rgba(76,0,53,1)'}, 
  bbox: [-122.29513,37.81106,-122.19705,37.89389]
});

map.addControl(geocoder,'top-left');
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

  map.addSource('district1', {
      'type': 'geojson',
      data: data
  });

  map.addLayer({
    'id': 'district',
    'type': 'fill',
    'source': 'district1',
    'layout': {},
    'paint': {
      'fill-color': 'rgba(200, 100, 240, 0.3)',
      'fill-outline-color': 'rgba(106, 34, 132, 1)'
      }
  });

// https://stackoverflow.com/questions/57677373/how-to-get-mapbox-geocoder-result-place-country-text-names-into-a-javascript-fun
  geocoder.on('result', function(e) {
      console.log(e.result.address + ', ' + e.result.text);
      console.log(e)

      var request = new XMLHttpRequest()

      // Open a new connection, using the GET request on the URL endpoint
      request.open('GET', 'http://gisapps1.mapoakland.com/oakgis/rest/services/Prod/CouncilDistricts/MapServer/identify?f=json&tolerance=1&imageDisplay=1440,217,96&geometry={"x":6055964.00,"y":2131689.25}&geometryType=esriGeometryPoint&sr=102643&mapExtent=6035940.637268476,2142924.21076519,6079895.748164229,2149548.0017821193&layers=all:0', true)

      request.onload = function() {
        // Begin accessing JSON data here
        console.log(JSON.parse(this.response))
      }

      // Send request
      request.send()
  });

});

