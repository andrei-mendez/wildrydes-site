/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};

(function esriMapScopeWrapper($) {
    var wrMap = WildRydes.map;

    wrMap.animate = function animate(origin, dest, callback) {          //  TODO moved
        let tick = 0;
        let id = null;
        const unicorn = WildRydes.unicorn;

        let latlng = unicorn.getLatLng();
        let latInc = (dest.latitude - latlng.lat) / 100;
        let lngInc = (dest.longitude - latlng.lng) / 100;

        clearInterval(id);
        id = setInterval(frame, 5);
        function frame() {
            if (tick === 100) {
                clearInterval(id);
                callback();
            } else {
                tick++;
                latlng = {lat: latlng.lat +  latInc, lng: latlng.lng +  lngInc};
                unicorn.setLatLng(latlng);
            }
        }
    }

    wrMap.unsetLocation = function unsetLocation() {		//	TODO moved
        if (WildRydes.marker)
            WildRydes.marker.remove();
    };

    // Function to retrieve weather data from OpenWeatherMap API
    function getWeatherData(latitude, longitude) {
        var apiKey = '7047dfe3a8d8d2e26bbb76e0c853b8e5';
        var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;

        // Make AJAX request to OpenWeatherMap API
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(response) {
                // Parse weather data from response
                var weather = response.weather[0];
                var main = response.main;

                // Adjust animation based on weather conditions
                adjustAnimation(weather.main);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching weather data:', error);
            }
        });
    }

    // Function to adjust animation based on weather conditions
    function adjustAnimation(weatherCondition) {
        switch (weatherCondition) {
            case 'Rain':
                // Slow down animation for rainy weather
                wrMap.animationSpeed = 10; // Example: Adjust animation speed to 10
                break;
            case 'Clear':
                // Normal animation speed for clear weather
                wrMap.animationSpeed = 50; // Example: Adjust animation speed to 50
                break;
            // Add more cases for other weather conditions as needed
        }
    }

}(jQuery));
