var map;
var markers = [];
var initialLocations = [];

// Get request to Zomato API for pizza places in SF
$.ajax({
  url: 'https://developers.zomato.com/api/v2.1/search?entity_id=306&entity_type=city&q=pizza',
  headers: {'user-key': 'e3f3f0b858452108ebf56c9166e50583'},
  success: function(data) {
    data.restaurants.forEach(function(obj, i) {
      initialLocations.push({
        index: i,
        title: obj.restaurant.name,
        url: obj.restaurant.url,
        address: obj.restaurant.location.address,
        location: {
          lat: parseFloat(obj.restaurant.location.latitude),
          lng: parseFloat(obj.restaurant.location.longitude)
        }
      });
    });
    // Initiate Map
    initMap();
    // Initiate knockout bindings
    ko.applyBindings(new AppViewModel());
  },
  error: function(err) {
    console.log(err);
    alert('There was an error, please refresh');
  }
});

// Helpers for continuity between list and map
viewHelper = {
  createMarker: function(map, position, title, i, url, address) {
    return new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      url: url,
      address: address,
      icon: 'https://www.google.com/mapfiles/marker_orange.png',
      id: i
    });
  },

  populateInfoWindow: function(marker, infowindow) {
      infowindow.marker = marker;
      infowindow.setContent('<div><a href=' + marker.url + ' target="_blank">' + marker.title + '</a><p>' + marker.address + '</p></div>');
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function() {
        infowindow.setPosition(null);
      });
      viewHelper.resetMarkerColors(markers);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
      viewHelper.stopAnimation(marker);
  },

  resetMarkerColors: function(markers) {
    markers.forEach(function(marker) {
      marker.setIcon('https://www.google.com/mapfiles/marker_orange.png');
      marker.setAnimation(google.maps.Animation.null);
    });
  },

  resetMarkers: function() {
    for (var i=0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
  },

  setMarkers: function(locations) {
    for (var i = 0; i < locations.length; i++) {
      var position = locations[i].location;
      var title = locations[i].title;
      var url = locations[i].url;
      var address = locations[i].address;
      var marker = viewHelper.createMarker(map, position, title, i, url, address);
      var largeInfoWindow = new google.maps.InfoWindow();
      marker.addListener('click', function() {
        viewHelper.populateInfoWindow(this, largeInfoWindow);
      });
      markers.push(marker);
    }
  },

  stopAnimation: function(marker) {
    setTimeout(function() {
      marker.setAnimation(google.maps.Animation.null);
    }, 1400);
  }
}

// Initiate Google Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.764512249999996, lng: -122.43552894999999},
    zoom: 14
  });

  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < initialLocations.length; i++) {
    var position = initialLocations[i].location;
    var title = initialLocations[i].title;
    var url = initialLocations[i].url;
    var address = initialLocations[i].address;
    var marker = viewHelper.createMarker(map, position, title, i, url, address);
    markers.push(marker);
    bounds.extend(marker.position);
    var largeInfoWindow = new google.maps.InfoWindow();
    marker.addListener('click', function() {
      viewHelper.populateInfoWindow(this, largeInfoWindow);
    });
    google.maps.event.addDomListener(window, "resize", function() {
     google.maps.event.trigger(map, "resize");
     map.fitBounds(bounds);
    });
  }
  map.fitBounds(bounds);
}

function handleMapsError() {
  alert('map did not load, please refresh page');
}

function AppViewModel() {
  var self = this;
  self.locs = ko.observableArray(initialLocations);

  self.pizzaFilter = ko.observable();

  self.filterPizzaPlaces = function() {
    var filtered = initialLocations.filter(function(loc) {
      return loc.title.toLowerCase().match(self.pizzaFilter().toLowerCase());
    });
    self.locs(filtered);
    viewHelper.resetMarkers();
    viewHelper.setMarkers(filtered);
  }

  self.locationClick = function(location) {
    viewHelper.resetMarkerColors(markers);
    google.maps.event.trigger(markers[location.index], 'click');
    viewHelper.stopAnimation(markers[location.index]);
  }

  self.showListView = ko.observable(true);
}