var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.74135, lng: -73.99802},
    zoom: 14
  });
}

function AppViewModel() {
  this.name = 'Jeff';
  console.log('1234');
}

ko.applyBindings(new AppViewModel());