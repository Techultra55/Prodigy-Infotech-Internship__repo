var API_KEY = '81ff8640348f5900c9122da15672bab1'
var BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

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


// fn Show loading spinner
let showLoading = () => {
    var loadingDiv = document.getElementById('loading');
    var weatherDiv = document.getElementById('weatherInfo');
    var errorDiv = document.getElementById('error');

    loadingDiv.classList.remove('hidden');
    weatherDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
}


// fn Hide loading spinner
let hideLoading = () => {
    var loadingDiv = document.getElementById('loading');
    loadingDiv.classList.add('hidden');
}

// fn Show error message
let showError = (message) => {
    var errorDiv = document.getElementById('error');
    var weatherDiv = document.getElementById('weatherInfo');

    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    weatherDiv.classList.add('hidden');
}

//fn display data on page
let displayWeatherData = (data) => {

    //Get weather icon
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
        document.getElementById('visibility').textContent = visibilityKm + 'km';
    }
    else {
        document.getElementById('visibility').textContent = 'N/A';
    }
    document.getElementById('uvIndex').textContent = 'N/A';

    //show the weather info section
    document.getElementById('weatherInfo').classList.remove('hidden');
}


//Get weather data from the API
let getWeatherData = (url) => {

    //show loading
    showLoading();



    // Check if API key is set properly
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        hideLoading();
        showError('Please set your OpenWeatherMap API key in the script.\n\nCurrent API key value: "' + API_KEY + '"\n\nMake sure it looks like:\nvar API_KEY = \'your-actual-key-here\';');
        return;
    }


    //Make the API request
    fetch(url).then((res) => {
        if (res.ok) {
            return res.json();
        }
        else {
            //handle errors of different types
            if (res.status === 404)
                throw new Error("City not found. Please check the spelling and try again.")
            else if (res.status === 401)
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
            else
                throw new Error('Weather data unavailable (' + res.status + ')');

        }

    }).then((data) => {

        //success = display weather data
        displayWeatherData(data);
        hideLoading();

    }).catch((error) => {
        console.error('Error getting weather data:', error);
        showError(error.message);
        hideLoading();

    });

}

//search for weather by city name
let searchWeather = () => {
    var locationInput = document.getElementById('locationInput');
    var location = locationInput.value.trim();

    //check if user entered a city name

    if (!location) {
        showError("Please enter a city name")
        return;
    }

    // Build the API URL for city search
    var url = BASE_URL + '?q=' + encodeURIComponent(location) + '&appid=' + API_KEY + '&units=metric';
    getWeatherData(url);
}

//Get the weather for current location
let getCurrentLocationWeather = () => {

    //Checking if browser supports geolocation
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by browser');
        return;
    }

    showLoading();

    //Get current position
    navigator.geolocation.getCurrentPosition((pos) => {

        //success-got the location
        var latitude = pos.coords.latitude;
        var longitude = pos.coords.longitude;


        //Building the URL 
        // Build API URL with coordinates
        var url = BASE_URL + '?lat=' + latitude + '&lon=' + longitude + '&appid=' + API_KEY + '&units=metric';
        getWeatherData(url);
    },
        (err) => {

            //Error while getting location
            hideLoading();
            var errorMessage = 'Unable to get your location';

            if (err.code === err.PERMISSION_DENIED)
                errorMessage += 'Please allow location access and try again.';
            else if (err.code === err.POSITION_UNAVAILABLE)
                errorMessage += 'Location information is unavailable.';
            else if (err.code === err.TIMEOUT)
                errorMessage += 'Location request timed out.';
            else
                errorMessage += 'Please try searching for a city instead';


            showError(errorMessage);
        })

}

//Enter key to search
document.getElementById('locationInput').addEventListener('keypress', (e) => {

    if (e.key === 'Enter') {
        searchWeather();
    }
});


//show setup instructions when page loads

window.addEventListener('load', () => {
    if (API_KEY === '81ff8640348f5900c9122da15672bab1') {
        showError('To use this weather app, you need to:\n1. Sign up for a free API key at openweathermap.org\n2. Replace "YOUR_API_KEY_HERE" in the script with your actual API key');
    }
})






