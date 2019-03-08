//DEFINITIONS··································································
var appMap,
    infoMap,
    request,
    service,
    marker,
    coffee,
    weather,
    googleMaps,
    $temp,
    $humidity,
    $description,
    $nameLocation;

//HTML ELEMENTS································································  
    $temp = document.getElementById('temp');
    $humidity = document.getElementById('humidity');
    $description = document.getElementById('description');
    $nameLocation = document.getElementById('nameLocation');

//FUNCTIONS····································································
    function initMap() {
        appMap = new google.maps.Map(document.getElementById('appMap'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 16,
            type: 'cafe',
        });
    }

    googleMaps = {
        settingLocation: function(geolocate) {
            infoMap = new google.maps.InfoWindow({
                map: appMap,
                position: geolocate,
                content: '<i class="fas fa-map-marker-alt iconLocation"> Su ubicación </i>',
            });

            appMap.setCenter(geolocate);
        }
    }

    coffee = {
        settingMarkers: function(place){
            marker = new google.maps.Marker({
                map: appMap,
                position: place.geometry.location,
            });

            google.maps.event.addListener(marker, 'click', function() {
                infoMap.setContent(place.name);
                infoMap.open(appMap, this);
            });
        },

        gettingAllCoffeeShops: function(geolocate){
            request = {
                location: geolocate,
                radius: 5000,
                types: ['cafe']
            };

            service = new google.maps.places.PlacesService(appMap);

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
            let nameLocation = response.data.name,
                propertiesWeather = response.data.main,
                descriptionWeather = response.data.weather[0].description;

            this.addElementNameLocation(nameLocation);
            this.settingPropertiesWeather(propertiesWeather, descriptionWeather);
        },

        addElementNameLocation: function(nameLocation){
            let $elementCity = document.createElement('p');

            $elementCity.innerText = nameLocation + ', Colombia';
            $nameLocation.appendChild($elementCity);
        },

        settingPropertiesWeather: function(propertiesWeather, descriptionWeather){
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
