function drawMap() {
    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        zoom: 15,
    };

    var infowindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);


    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: 'ChIJp2f9gldxw0cRYcDwWtPFEcs'
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    place.formatted_address + '</div>');
                infowindow.open(map, this);
            });
            var latLng = marker.getPosition(); // returns LatLng object
            map.setCenter(latLng)
        }


    });
}