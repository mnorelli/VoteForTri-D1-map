var centerD1 = [-122.246048,37.852483]

mapboxgl.accessToken = TOKEN;
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: centerD1, // Starting position [lng, lat]
  zoom: 12, // Starting zoom level
});

// var marker = new mapboxgl.Marker() // initialize a new marker
//   .setLngLat(centerD1) // Marker [lng, lat] coordinates
//   .addTo(map); // Add the marker to the map

var geocoder = new MapboxGeocoder({ // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  placeholder: 'Search in District 1',
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: {color: 'orange'}, // https://docs.mapbox.com/mapbox-gl-js/example/point-from-geocoder-result/
  bbox: [-122.30937,37.84214,-122.23715,37.89838]
});

// Add the geocoder to the map
map.addControl(geocoder,'top-left');

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


// Add a GeoJSON polygon
// https://docs.mapbox.com/mapbox-gl-js/example/geojson-polygon/
// https://docs.mapbox.com/mapbox-gl-js/example/timeline-animation/  adding GeoJSON from file

map.on('load', function() {
    // Here we're using d3 to help us make the ajax request but you can use
    // Any request method (library or otherwise) you wish.
    d3.json(
        './geodata/District1.geojson',
        function(err, data) {
            if (err) throw err;

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
                'fill-color': '#088',
                'fill-opacity': 0.8
                }
            });
        }
    );

});
