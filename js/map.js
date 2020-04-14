var centerD1 = [-122.246048,37.852483]

mapboxgl.accessToken = TOKEN;
var map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: centerD1, // Starting position [lng, lat]
  zoom: 12.6, // Starting zoom level
});

var geocoder = new MapboxGeocoder({ // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  placeholder: 'Search in District 1',
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: {color: 'rgba(76,0,53,1)'} // https://docs.mapbox.com/mapbox-gl-js/example/point-from-geocoder-result/
  //bbox: [-122.30937,37.84214,-122.23715,37.89838]
});

// Add the geocoder to the map
map.addControl(geocoder,'top-left');

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add a GeoJSON polygon
// https://docs.mapbox.com/mapbox-gl-js/example/geojson-polygon/
// https://docs.mapbox.com/mapbox-gl-js/example/timeline-animation/  adding GeoJSON from file


map.on('load', function() {


    //     var data = $.ajax({
    //       url:"https://raw.githubusercontent.com/mnorelli/VoteForTri-D1-map/master/geodata/District1.geojson",
    //       dataType: "json",
    //       success: console.log("District data loaded\n" + data),
    //       error: function (xhr) {
    //         alert(xhr.statusText)
    //       }
    //     })

    // $.when(data).done(function() {

//console.log("before d3")

  // d3.json(
  //     'https://raw.githubusercontent.com/mnorelli/VoteForTri-D1-map/master/geodata/District1.geojson',
  //     function(err, data) {
  //         if (err) throw err;
          console.log(data);
          console.log("District data loaded");

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


  //     }
  // );

//console.log("after d3")

});


