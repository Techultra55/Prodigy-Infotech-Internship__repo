// Your OpenWeatherMap API key - Get it from openweathermap.org
var API_KEY = '81ff8640348f5900c9122da15672bab1';
var BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Weather icons for different weather conditions
var weatherIcons = {
    '01d': '☀️', '01n': '🌙',  // clear sky
    '02d': '⛅', '02n': '☁️',  // few clouds
    '03d': '☁️', '03n': '☁️',  // scattered clouds
    '04d': '☁️', '04n': '☁️',  // broken clouds
    '09d': '🌧️', '09n': '🌧️',  // shower rain
    '10d': '🌦️', '10n': '🌧️',  // rain
    '11d': '⛈️', '11n': '⛈️',  // thunderstorm
    '13d': '❄️', '13n': '❄️',  // snow
    '50d': '🌫️', '50n': '🌫️'   // mist
};

// Show loading spinner
function showLoading() {
    var loadingDiv = document.getElementById('loading');
    var weatherDiv = document.getElementById('weatherInfo');
    var errorDiv = document.getElementById('error');

    loadingDiv.classList.remove('hidden');
    weatherDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
}

// Hide loading spinner
function hideLoading() {
    var loadingDiv = document.getElementById('loading');
    loadingDiv.classList.add('hidden');
}

// Show error message
function showError(message) {
    var errorDiv = document.getElementById('error');
    var weatherDiv = document.getElementById('weatherInfo');

    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    weatherDiv.classList.add('hidden');
}

// Display weather data on the page
function displayWeatherData(data) {
    // Get weather icon
    var iconCode = data.weather[0].icon;
    var weatherIcon = weatherIcons[iconCode] || '🌤️';

    // Fill in the main weather info
    document.getElementById('location').textContent = data.name + ', ' + data.sys.country;
    document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°C';
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('weatherIcon').textContent = weatherIcon;

    // Fill in the detailed weather info
    document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like) + '°C';
    document.getElementById('humidity').textContent = data.main.humidity + '%';
    document.getElementById('windSpeed').textContent = data.wind.speed + ' m/s';
    document.getElementById('pressure').textContent = data.main.pressure + ' hPa';

    // Calculate visibility in kilometers
    if (data.visibility) {
        var visibilityKm = (data.visibility / 1000).toFixed(1);
        document.getElementById('visibility').textContent = visibilityKm + ' km';
    } else {
        document.getElementById('visibility').textContent = 'N/A';
    }

    document.getElementById('uvIndex').textContent = 'N/A';

    // Show the weather info section
    document.getElementById('weatherInfo').classList.remove('hidden');
}

// Get weather data from the API
function getWeatherData(url) {
    // Show loading spinner
    showLoading();

    // Check if API key is set properly
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        hideLoading();
        showError('Please set your OpenWeatherMap API key in the script.\n\nCurrent API key value: "' + API_KEY + '"\n\nMake sure it looks like:\nvar API_KEY = \'your-actual-key-here\';');
        return;
    }

    // Make the API request
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                // Handle different error types
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
                } else {
                    throw new Error('Weather data unavailable (' + response.status + ')');
                }
            }
        })
        .then(function (data) {
            // Success - display the weather data
            displayWeatherData(data);
            hideLoading();
        })
        .catch(function (error) {
            // Error - show error message
            console.error('Error getting weather data:', error);
            showError(error.message);
            hideLoading();
        });
}

// Search for weather by city name
function searchWeather() {
    var locationInput = document.getElementById('locationInput');
    var location = locationInput.value.trim();

    // Check if user entered a city name
    if (!location) {
        showError('Please enter a city name');
        return;
    }

    // Build the API URL for city search
    var url = BASE_URL + '?q=' + encodeURIComponent(location) + '&appid=' + API_KEY + '&units=metric';
    getWeatherData(url);
}

// Get weather for current location
function getCurrentLocationWeather() {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser');
        return;
    }

    showLoading();

    // Get current position
    navigator.geolocation.getCurrentPosition(
        function (position) {
            // Success - got location
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // Build API URL with coordinates
            var url = BASE_URL + '?lat=' + latitude + '&lon=' + longitude + '&appid=' + API_KEY + '&units=metric';
            getWeatherData(url);
        },
        function (error) {
            // Error getting location
            hideLoading();
            var errorMessage = 'Unable to get your location. ';

            if (error.code === error.PERMISSION_DENIED) {
                errorMessage += 'Please allow location access and try again.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorMessage += 'Location information is unavailable.';
            } else if (error.code === error.TIMEOUT) {
                errorMessage += 'Location request timed out.';
            } else {
                errorMessage += 'Please try searching for a city instead.';
            }

            showError(errorMessage);
        }
    );
}

// Allow Enter key to search
document.getElementById('locationInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
});

// Show setup instructions when page loads
window.addEventListener('load', function () {
    if (API_KEY === '81ff8640348f5900c9122da15672bab1') {
        showError('To use this weather app, you need to:\n1. Sign up for a free API key at openweathermap.org\n2. Replace "YOUR_API_KEY_HERE" in the script with your actual API key');
    }
});