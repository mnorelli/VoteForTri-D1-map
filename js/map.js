var centerD1 = [-122.246048,37.852483];
var bboxLR = [-122.29513,37.81106];
var bboxUL = [-122.19705,37.89389];
var initialZoom = 12.5;
var skip = 'no';


mapboxgl.accessToken = TOKEN;
var map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/mapbox/streets-v11',
  center: centerD1, 
  zoom: initialZoom, 
});

var geocoder = new MapboxGeocoder({ 
  accessToken: mapboxgl.accessToken, 
  placeholder: 'Search in District 1',
  mapboxgl: mapboxgl,
  marker: {color: 'rgba(76,0,53,1)'}
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


map.on('load', function() {

  var msg = document.getElementById('message');
  function say(message, color) {
    msg.textContent='';
    msg.style.color=color||'black';
    msg.textContent=message;
  }
  
  map.addControl(new mapboxgl.NavigationControl());

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

  map.addSource('districtsAll', {
      'type': 'geojson',
      data: districtsAll
  });

  map.addLayer({
  'id': 'allDistricts',
  'type': 'fill',
  'source': 'districtsAll',
  'layout': {},
  'paint': {
    'fill-color': 'rgba(0,0,0, 0)'
    }
  },
  firstSymbolId);

  map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['allDistricts']
        });

        features.forEach(i => console.log(i.properties.NAME));
    });

  geocoder.on('result', function(e) {

  // TO DO
  // 
  // save Search text into database
  // allow database to be exported/viewed

    var resultPoint = e.result.center.point

    say('');

    map.on('moveend', function() {

      if (skip == 'no') {  // when moving to new geocode result

         var features = map.queryRenderedFeatures(resultPoint, {
            layers: ['allDistricts']
          });
  
          if (features[0]) {
            if (features[0].properties.NAME == 'CCD1') {
              say('Your address is in ' + features[0].properties.FULLNAME, 'darkgreen');
            }
            else {
              say('Your address is in ' + features[0].properties.FULLNAME, 'crimson');
            }
          } else {
              say('Your address is not in an Oakland City Council District','darkgrey');
          };
      };
    
    });

  });

  document.getElementById('button').addEventListener('click', function() {
    // say('');
    map.flyTo({
      center: centerD1, 
      zoom: initialZoom
    });
    var skip = 'yes';  // don't change Council message when zooming back to initial point
  });

});
