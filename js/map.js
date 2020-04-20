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


});


