/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};

(function esriMapScopeWrapper($) {
    var wrMap = WildRydes.map;

    wrMap.animate = function animate(origin, dest, callback) {          
        let tick = 0;
        let id = null;
        const unicorn = WildRydes.unicorn;

        let latlng = origin; // Set the starting point as the origin
        let latInc = (dest.latitude - latlng.latitude) / 100; // Calculate latitude increment
        let lngInc = (dest.longitude - latlng.longitude) / 100; // Calculate longitude increment

        clearInterval(id);
        id = setInterval(frame, 5);
        function frame() {
            if (tick === 100) {
                clearInterval(id);
                callback();
            } else {
                tick++;
                latlng = {latitude: latlng.latitude +  latInc, longitude: latlng.longitude +  lngInc};
                unicorn.setLatLng(latlng);
            }
        }
    };

    wrMap.unsetLocation = function unsetLocation() {		
        if (WildRydes.marker)
            WildRydes.marker.remove();
    };

   // Function to retrieve weather data from OpenWeatherMap API
    function getWeatherData(latitude, longitude) {
        var apiKey = '7047dfe3a8d8d2e26bbb76e0c853b8e5';
        var apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
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

                // Display weather information in the panel
                $('#weatherInfo').html('Weather: ' + weather.main + '<br>Temperature: ' + main.temp + '°C');
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

    // Function to get user's current location using HTML5 Geolocation API
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                
                // Call the function to retrieve weather data with obtained coordinates
                getWeatherData(latitude, longitude);
            }, function(error) {
                console.error('Error getting user location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    // Call the function to get user's location and weather data when the page loads
    getUserLocation();

}(jQuery));

