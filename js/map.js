var centerD1 = [-122.246048,37.852483];
// with wide margin
// var bboxLR = [-122.29513,37.81106];
// var bboxUL = [-122.19705,37.89389];
var bboxLR = [-122.288740112,37.818867215];
var bboxUL = [-122.2008351947,37.885367996];
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

function roundIfNeeded(num, decimals) {
  return Math.round((num + Number.EPSILON) * Math.pow(10,decimals)) / Math.pow(10,decimals)
};

map.on('load', function() {

  map.fitBounds([
    bboxLR,
    bboxUL
  ],
  {
    padding: {top: 10, bottom:10, left: 10, right: 10}
  });


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
      'data': districtsAll
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

  geocoder.on('result', function(e) {

  // TO DO
  // 
  // save Search text into database
  // allow database to be exported/viewed
  // 4 Eucalyptus Road, Berkeley ??

    say('');
    var resultLng = roundIfNeeded(e.result.center[0],4)
    var resultLat = roundIfNeeded(e.result.center[1],4)

    map.on('moveend', function() {

      var centerLng = roundIfNeeded(map.getCenter().lng,4)
      var centerLat = roundIfNeeded(map.getCenter().lat,4)


      // since 'moveend' is triggered by geocoder or user,
      // only check for point in polygon geocoder moves to new  result
      if (skip == 'no' && resultLng == centerLng && resultLat == centerLat){

         var features = map.queryRenderedFeatures(e.result.center.point, {
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

  geocoder.on('clear', function() {
    say('')
    });

  document.getElementById('button').addEventListener('click', function() {
    map.fitBounds([
        bboxLR,
        bboxUL
      ],
      {
        padding: {top: 10, bottom:10, left: 10, right: 10}
      });
    var skip = 'yes';  // don't change Council message when zooming back to initial point
  });

});
