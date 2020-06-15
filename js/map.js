var centerD1 = [-122.246048,37.852483];
var bboxLR = [-122.29513,37.81106];
var bboxUL = [-122.19705,37.89389];
var initialZoom = 12.5;


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



//   Construct ArcGIS REST to query Esri geocoder by lonlat by single-line address
var esriTarget = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=';
var esriType = 'f=pjson';
var esriStore = 'forStorage=false';
var esriFields = 'outFields=*';
var esripart2 = '&'
             + esriFields + '&'
             + esriStore + '&'
             + esriType

// https://gomakethings.com/promise-based-xhr/
var makeRequest = function (url) {
  var request = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {
    request.onreadystatechange = function () {
      if (request.readyState !== 4) return;
      if (request.status >= 200 && request.status < 300) {
        resolve(request);
      } else {
        reject({
          status: request.status,
          statusText: request.statusText
        });
      }
    };
    request.open('GET', url, true);
    request.send();
  });
};


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
    'fill-color': 'rgba(0,0,0, .2)'
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

        // var features = map.queryRenderedFeatures(e, {
        //   layers: ['allDistricts']
        // });

        // features.forEach(i => console.log(i.properties.NAME));

      // Get Esri geographic coordinate for MapBox query name or address
      console.log(e.result.place_name);

      // var esriURL = esriTarget + e.result.place_name + esripart2;
      // makeRequest(esriURL)
      // .then(function (esriPt) {
      //   var esri_obj = JSON.parse(esriPt.response);
      //   var esriX = esri_obj.candidates[0].location.x
      //   var esriY = esri_obj.candidates[0].location.y
      //   console.log('The Esri geocode for this address is ' + esriX + ', ' + esriY);
      //   var point = new mapboxgl.Point(esriX,esriY);

        console.log(e.result.place_name);
        console.log(e.result.center);

        var features = map.queryRenderedFeatures(e.result.center, {
          layers: ['allDistricts']
        });

        features.forEach(i => console.log(i.properties.NAME));

        if (features[0]) {
          if (features[0].properties.NAME == 'CCD1') {
            say('Your address is in ' + features[0].properties.FULLNAME, 'darkgreen');
          }
          else {
            say('Your address is in ' + features[0].properties.FULLNAME, 'crimson');
          }
        } else {
            say('Your address is not in an Oakland City Council District','darkgrey');
        }
      });
      // .catch(function (error) {
      //   say('Something went wrong');
      //   console.log(error);
      // });
  // });

  document.getElementById('button').addEventListener('click', function() {
    // say('');
    map.flyTo({
      center: centerD1, 
      zoom: initialZoom
    });
  });

});
