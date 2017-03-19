var map;

// yelp pizza query
// https://api.yelp.com/v2/search/?location=San Francisco, CA&category_filter=pizza

var initialLocations = [
  { index: 0, title: 'Katani Pizza', location: { lat: 37.773193359375,  lng: -122.450645446777 } },
  { index: 1, title: 'Slice House By Tony Gemignani', location: { lat: 37.7696380615234, lng: -122.447540283203 } },
  { index: 2, title: 'and', location: { lat: 37.7775382995605, lng: -122.43798828125 } },
  { index: 3, title: 'anything', location: { lat: 37.7997956, lng: -122.4080729 } },
  { index: 4, title: 'aone', location: { lat: 37.7484746, lng: -122.4199315} }
];

var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.764512249999996, lng: -122.43552894999999},
    zoom: 14
  });

  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < initialLocations.length; i++) {
    var position = initialLocations[i].location;
    var title = initialLocations[i].title;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      icon: 'https://www.google.com/mapfiles/marker_orange.png',
      id: i
    });
    markers.push(marker);
    bounds.extend(marker.position);
    var largeInfoWindow = new google.maps.InfoWindow();
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
  }
  map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
      infowindow.setPosition(null);
    });
    markers.forEach(function(marker) {
      marker.setIcon('https://www.google.com/mapfiles/marker_orange.png');
    });
    marker.setAnimation(google.maps.Animation.BOUNCE);
    marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
    setTimeout(function() {
      marker.setAnimation(google.maps.Animation.null);
    },1400);
}

function AppViewModel() {
  var self = this;
  self.locs = ko.observableArray(initialLocations);

  self.pizzaFilter = ko.observable();

  self.filterPizzaPlaces = function() {
    var filtered = initialLocations.filter(function(loc) {
      return loc.title.match(self.pizzaFilter());
    });
    self.locs(filtered);
    this.resetMarkers();
    this.setMarkers(filtered);
  }

  this.resetMarkers = function() {
    for (var i=0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
  }

  this.setMarkers = function(locations) {
    for (var i = 0; i < locations.length; i++) {
      var position = locations[i].location;
      var title = locations[i].title;
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        icon: 'https://www.google.com/mapfiles/marker_orange.png',
        id: i
      });
      var largeInfoWindow = new google.maps.InfoWindow();
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow);
      });
      markers.push(marker);
    }
  }

  this.setAllMarkersRed = function(markers) {
    markers.forEach(function(marker) {
      marker.setIcon('https://www.google.com/mapfiles/marker_orange.png');
    });
  }

  this.locationClick = function(location) {
    self.setAllMarkersRed(markers);
    google.maps.event.trigger(markers[location.index], 'click');
    setTimeout(function() {
      markers[location.index].setAnimation(google.maps.Animation.null);
    },1400);
  }



  this.showListView = ko.observable(true);
}

ko.applyBindings(new AppViewModel());