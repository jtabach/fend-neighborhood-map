var map;

// yelp pizza query
// https://api.yelp.com/v2/search/?location=San Francisco, CA&category_filter=pizza

var locations = [
  { title: 'Katani Pizza', location: { lat: 37.773193359375,  lng: -122.450645446777 } },
  { title: 'Slice House By Tony Gemignani', location: { lat: 37.7696380615234, lng: -122.447540283203 } },
  { title: '3', location: { lat: 37.7775382995605, lng: -122.43798828125 } },
  { title: '4', location: { lat: 37.7997956, lng: -122.4080729 } },
  { title: '5', location: { lat: 37.7484746, lng: -122.4199315} }
];

var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.764512249999996, lng: -122.43552894999999},
    zoom: 14
  });

  var largeInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    markers.push(marker);
    bounds.extend(marker.position);
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow)
    });
  }
  map.fitBounds(bounds);

  function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function() {
        info.setMarker(null);
      });
    }
  }
}

function AppViewModel() {
  this.locs = ko.observableArray(locations);

  this.locationClick = function() {
    console.log('testing1234');
  }
}

ko.applyBindings(new AppViewModel());