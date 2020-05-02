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

// ArcGIS REST query parts
var reqTarget = 'http://gisapps1.mapoakland.com/oakgis/rest/services/Prod/CouncilDistricts/MapServer/identify';
var reqType = 'f=json';
var reqTol = 'tolerance=1';
var reqImgDisp = 'imageDisplay=1440,217,96';
var reqGType = 'geometryType=esriGeometryPoint';
var reqGeomRet = 'returnGeometry=false';
var reqLyrs = 'layers=top:0';
var reqURLpart1 = reqTarget + '?'
             + reqGType + '&'
             + reqLyrs + '&'
             + reqTol + '&'
             + reqImgDisp + '&'
             + reqGeomRet + '&'
             + reqType

map.addControl(geocoder,'top-left');
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

  var layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
      firstSymbolId = layers[i].id;
      break;
    }
  }

  map.addSource('district1', {
      'type': 'geojson',
      data: data
  });

  map.addLayer({
    'id': 'district-line',
    'type': 'line',
    'source': 'district1',
    'layout': {},
    'paint': {
      'line-color': 'rgba(106, 34, 132, 0.8)',
      'line-width': 2
      }
  });

    map.addLayer({
    'id': 'district',
    'type': 'fill',
    'source': 'district1',
    'layout': {},
    'paint': {
      'fill-color': 'rgba(200, 100, 240, 0.3)'
      }
  },
  firstSymbolId);

// https://stackoverflow.com/questions/57677373/how-to-get-mapbox-geocoder-result-place-country-text-names-into-a-javascript-fun
  geocoder.on('result', function(e) {
      console.log(e.result.address + ' ' + e.result.text);
      var reqLon = e.result.geometry.coordinates[0]
      var reqLat = e.result.geometry.coordinates[1]

      // var reqSpRef = '102643';  // 2227  NAD83 CA State Plane Zone 3 feet
      // var reqExt = 'mapExtent=6043165,2122759,6071995,2152385';
      // var reqGeom = 'geometry=6051461,2130232'; 

      var reqSpRef = 'sr=4326';  // WGS84
      var reqExt = 'mapExtent=-122.294970,37.811059,-122.197046,37.893884';
      var reqGeom = 'geometry=' + reqLon + ',' + reqLat; 

      var reqURL = reqURLpart1 + '&'
                   + reqGeom + '&'
                   + reqSpRef + '&'
                   + reqExt

      var request = new XMLHttpRequest();

      // Open a new connection, using the GET request on the URL endpoint
      request.open('GET', reqURL, true);

      request.onload = function() {
        // Begin accessing JSON data here
        var oakgis_obj = JSON.parse(this.response);

        console.log("Your address is in " + oakgis_obj.results[0].attributes.FULLNAME);
      }

      // Send request
      request.send();
  });

});








