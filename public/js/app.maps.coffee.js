//DEFINITIONS··································································

//HTML ELEMENTS································································  
    $temp = document.getElementById('temp');
    $humidity = document.getElementById('humidity');
    $nameCity = document.getElementById('nameCity');
    $description = document.getElementById('description');

//FUNCTIONS····································································
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 16,
            type: 'cafe',
        });
    }

    googleMaps = {
        settingLocation: function(geolocate) {
            infowindow = new google.maps.InfoWindow({
                map: map,
                position: geolocate,
                content: '<i class="fas fa-map-marker-alt iconLocation"> Su ubicación </i>',
            });

            map.setCenter(geolocate);
        }
    }

    coffee = {
        settingMarkers: function(place){
            marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        },

        gettingAllCoffeeShops: function(geolocate){
            request = {
                location: geolocate,
                radius: 5000,
                types: ['cafe']
            };

            service = new google.maps.places.PlacesService(map);

            service.nearbySearch(request, function(coffeeShops, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < coffeeShops.length; i++) {
                        coffee.settingMarkers(coffeeShops[i]);
                    }
                }
            });
        },
    }

    weather = {
        getProperties: function(latitude, longitude) {
            let urlApi = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&lang=es&units=metric&APPID=63b93d38aa11f6d8547e1dde018e5a89';

            axios.get(urlApi).then(function(response) {
                weather.executeResponse(response);
            });
        },

        executeResponse: function(response){
            let nameCity = response.data.name,
                propertiesWeather = response.data.main,
                descriptionWeather = response.data.weather[0].description;

            this.addElementNameCity(nameCity);
            this.settingProperties(propertiesWeather, descriptionWeather);
        },

        addElementNameCity: function(nameCity){
            let $elementCity = document.createElement('p');

            $elementCity.innerText = nameCity + ', Colombia';
            $nameCity.appendChild($elementCity);
        },

        settingProperties: function(propertiesWeather, descriptionWeather){
            $temp.innerText = propertiesWeather.temp + '°C';
            $humidity.innerText = propertiesWeather.humidity + '%';
            $description.innerText = descriptionWeather;
        }
    }

//INITIALIZATION ······························································
    navigator.geolocation.getCurrentPosition(function(position) {
        let latitude = position.coords.latitude,
            longitude = position.coords.longitude,
            geolocate = new google.maps.LatLng(latitude, longitude);

        googleMaps.settingLocation(geolocate);

        coffee.gettingAllCoffeeShops(geolocate);

        weather.getProperties(latitude, longitude);
    });
    
