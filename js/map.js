var centerD1 = [-122.246048,37.852483];
var bboxLR = [-122.288740112,37.818867215];
var bboxUL = [-122.2008351947,37.885367996];
var initialZoom = 12.5;
var skip = 'no';

const mapboxClient = mapboxSdk({ accessToken: TOKEN });

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

var msg = document.getElementById('message');
function say(message, color) {
  msg.textContent='';
  msg.style.color=color||'black';
  msg.textContent=message;
}

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

map.on('load', function() {

  map.fitBounds([
    bboxLR,
    bboxUL
  ],
  {
    padding: {top: 10, bottom:10, left: 10, right: 10}
  });

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


  geocoder.on('result', function(e) {

  // TO DO
  // 
  // save Search text into database
  // allow database to be exported/viewed

    say('');

    mapboxClient.tilequery.listFeatures({
       mapIds: ['mnorelli.2q8y5xhe'],
       coordinates: e.result.center,
       radius: 1
    })
    .send()
    .then(response => {
      console.log(response.body.features[0]);
      console.log(dist)
      if (response.body.features[0]) {
      var dist = response.body.features[0].properties;
        if (dist.NAME == 'CCD1') {
          say('Your address is in ' + dist.FULLNAME, 'darkgreen');
        }
        else {
          say('Your address is in ' + dist.FULLNAME, 'crimson');
        }
      } else {
          say('Your address is not in an Oakland City Council District','darkgrey');
      }
    })
    .catch(error => {
      say('An error occurred.')
      console.log('Tilequery error: ' + error);
      });

  });

geocoder.on('clear', function() {
  say('')
  });

});
