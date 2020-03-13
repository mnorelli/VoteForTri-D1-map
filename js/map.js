var centerD1 = [-122.246048,37.852483]

mapboxgl.accessToken = TOKEN;
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: centerD1, // Starting position [lng, lat]
  zoom: 12, // Starting zoom level
});

var marker = new mapboxgl.Marker() // initialize a new marker
  .setLngLat(centerD1) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map