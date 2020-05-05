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

//  1. Construct ArcGIS REST to query Oakland District by lonlat
var req1Target = 'http://gisapps1.mapoakland.com/oakgis/rest/services/Prod/CouncilDistricts/MapServer/identify';
var req1Type = 'f=json';
var req1Tol = 'tolerance=1';
var req1ImgDisp = 'imageDisplay=1440,217,96';
var req1GType = 'geometryType=esriGeometryPoint';
var req1GReturn = 'returnGeometry=false';
var req1Lyrs = 'layers=top:0';
var req1SpRef = 'sr=4326';  // WGS84
var req1Ext = 'mapExtent=-122.294970,37.811059,-122.197046,37.893884';
var req1URLpart1 = req1Target + '?'
             + req1GType + '&'
             + req1Lyrs + '&'
             + req1Tol + '&'
             + req1ImgDisp + '&'
             + req1GReturn + '&'
             + req1Type
var req1part2 = req1SpRef + '&'
             + req1Ext

//   2. Construct ArcGIS REST to query Esri geocoder by lonlat by single-line address
var req2Target = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=';
var req2Type = 'f=pjson';
var req2Store = 'forStorage=false';
var req2Fields = 'outFields=*';
var req2part2 = '&'
             + req2Fields + '&'
             + req2Store + '&'
             + req2Type


map.addControl(geocoder,'top-left');
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

  var layers = map.getStyle().layers;

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
      'line-color': 'rgba(200, 100, 240, 0.9)',
      'line-width': 1.5
      }
  });

  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
      firstSymbolId = layers[i].id;
      break;
    }
  }

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

  geocoder.on('result', function(e) {

      // TO DO
      // 
      // check for district by switching from Mapbox to Esri geocode
      //   - implement with promises: https://gomakethings.com/promise-based-xhr/
      // move results from console.log to front end
      // save Search text into database
      // allow database to be exported/viewed

      // Get Esri geographic coordinate for MapBox query name or address
      console.log(e.result.place_name);
      var req2URL = req2Target + e.result.place_name + req2part2;
      var requestEsriGeocode = new XMLHttpRequest();
      requestEsriGeocode.open('GET', req2URL, true);
      requestEsriGeocode.onload = function() {
        var esri_obj = JSON.parse(this.response);
        var req2Lon = esri_obj.candidates[0].location.x
        var req2Lat = esri_obj.candidates[0].location.y
        console.log("The Esri geocode for this address is " + req2Lon + ', ' + req2Lat);
      }
      requestEsriGeocode.send();
      
      // Get Oakland District for MapBox geocoded point
      var req1Lon = e.result.geometry.coordinates[0]
      var req1Lat = e.result.geometry.coordinates[1]
      var req1Geom = 'geometry=' + req1Lon + ',' + req1Lat; 
      var req1URL = req1URLpart1 + '&' + req1Geom + '&' + req1part2
      var requestDistrict = new XMLHttpRequest();
      requestDistrict.open('GET', req1URL, true);
      requestDistrict.onload = function() {
        var oakgis_obj = JSON.parse(this.response);
        if (Object.keys(oakgis_obj.results).length > 0) {
          console.log("Your address is in " + oakgis_obj.results[0].attributes.FULLNAME);
        } else {
          console.log("Your address is not in an Oakland City Council District");
        }


      }
      requestDistrict.send();

  });

});








