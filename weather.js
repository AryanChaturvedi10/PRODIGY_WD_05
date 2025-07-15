// Weather API configuration
const API_KEY = 'cf56a5aab4c5077e9434ec033e705cbc'; // OpenWeatherMap API key from weather.html
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn'); // New button
const weatherContent = document.getElementById('weatherContent');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const body = document.body; // Reference to the body element

// Weather elements
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const forecast = document.getElementById('forecast');

// Weather icon mapping
const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '⛅',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '🌨️', '13n': '🌨️',
    '50d': '🌫️', '50n': '🌫️'
};

// Background gradient mapping based on OpenWeatherMap icon codes
const backgroundMap = {
    '01d': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', // Clear sky (day)
    '01n': 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)', // Clear sky (night)
    '02d': 'linear-gradient(135deg, #ADD8E6 0%, #87CEEB 100%)', // Few clouds (day)
    '02n': 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)', // Few clouds (night)
    '03d': 'linear-gradient(135deg, #ADD8E6 0%, #87CEEB 100%)', // Scattered clouds (day)
    '03n': 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)', // Scattered clouds (night)
    '04d': 'linear-gradient(135deg, #B0C4DE 0%, #778899 100%)', // Broken clouds (day)
    '04n': 'linear-gradient(135deg, #4F4F4F 0%, #2C3E50 100%)', // Broken clouds (night)
    '09d': 'linear-gradient(135deg, #6A82FB 0%, #FC5C7D 100%)', // Shower rain (day)
    '09n': 'linear-gradient(135deg, #4F4F4F 0%, #2C3E50 100%)', // Shower rain (night)
    '10d': 'linear-gradient(135deg, #6A82FB 0%, #FC5C7D 100%)', // Rain (day)
    '10n': 'linear-gradient(135deg, #4F4F4F 0%, #2C3E50 100%)', // Rain (night)
    '11d': 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)', // Thunderstorm (day)
    '11n': 'linear-gradient(135deg, #232526 0%, #414345 100%)', // Thunderstorm (night)
    '13d': 'linear-gradient(135deg, #B0E0E6 0%, #A9A9A9 100%)', // Snow (day)
    '13n': 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)', // Snow (night)
    '50d': 'linear-gradient(135deg, #B0C4DE 0%, #D3D3D3 100%)', // Mist/Fog/Haze (day)
    '50n': 'linear-gradient(135deg, #4F4F4F 0%, #2C3E50 100%)'  // Mist/Fog/Haze (night)
};

// Function to set the body background based on weather icon code
function setBodyBackground(iconCode) {
    const backgroundStyle = backgroundMap[iconCode] || 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'; // Default to clear sky if not found
    body.style.background = backgroundStyle;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
}

// Initialize app
function init() {
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission behavior
            handleSearch();
        }
    });
    currentLocationBtn.addEventListener('click', getCurrentLocationWeather); // New event listener

    // Hide weather content initially
    weatherContent.style.display = 'none';

    // Set a default background on load (e.g., clear sky day)
    setBodyBackground('01d');
}

// Handle search
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getCurrentWeatherByCity(city);
    } else {
        showError('Please enter a city name.');
    }
}

// Show loading state
function showLoading() {
    weatherContent.style.display = 'none';
    error.style.display = 'none';
    loading.style.display = 'block';
    cityInput.disabled = true; // Disable input
    searchBtn.disabled = true; // Disable search button
    currentLocationBtn.disabled = true; // Disable current location button
}

// Hide loading state
function hideLoading() {
    loading.style.display = 'none';
    cityInput.disabled = false; // Enable input
    searchBtn.disabled = false; // Enable search button
    currentLocationBtn.disabled = false; // Enable current location button
}

// Show error state
function showError(message) {
    weatherContent.style.display = 'none';
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = message;
    hideLoading(); // Ensure controls are re-enabled even on error
}

// Show weather content
function showWeatherContent() {
    loading.style.display = 'none';
    error.style.display = 'none';
    weatherContent.style.display = 'block';
    hideLoading(); // Ensure controls are re-enabled
}

// Get current weather by city name
async function getCurrentWeatherByCity(city) {
    showLoading();
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) {
                throw new Error('Invalid API key. Please ensure your OpenWeatherMap API key is correct and activated. See https://openweathermap.org/faq#error401 for more info.');
            }
            throw new Error(errorData.message || 'Could not fetch weather data.');
        }
        const data = await response.json();
        updateCurrentWeather(data);
        getForecast(city); // Fetch forecast after getting current weather
        showWeatherContent();
    } catch (err) {
        console.error('Error fetching current weather:', err);
        showError(`Error: ${err.message}`);
    } finally {
        // hideLoading() is now called within showWeatherContent or showError
        // to ensure buttons are re-enabled after data is processed or an error occurs.
    }
}

// Get current weather by geolocation
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        if (response.status === 401) {
                            throw new Error('Invalid API key. Please ensure your OpenWeatherMap API key is correct and activated. See https://openweathermap.org/faq#error401 for more info.');
                        }
                        throw new Error(errorData.message || 'Could not fetch weather data.');
                    }
                    const data = await response.json();
                    updateCurrentWeather(data);
                    getForecast(data.name); // Fetch forecast using the obtained city name
                    showWeatherContent();
                } catch (err) {
                    console.error('Error fetching weather by geolocation:', err);
                    showError(`Error: ${err.message}`);
                }
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location.';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location services for this site.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'The request to get user location timed out.';
                        break;
                    case error.UNKNOWN_ERROR:
                        errorMessage = 'An unknown error occurred while getting location.';
                        break;
                }
                showError(errorMessage);
                console.error('Geolocation error:', error);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

// Get forecast
async function getForecast(city) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Could not fetch forecast data.');
        }
        const data = await response.json();
        updateForecast(data);
        
    } catch (err) {
        console.error('Error fetching forecast:', err);
        // Optionally display a less severe error for forecast if current weather is shown
    }
}

// Update current weather display
function updateCurrentWeather(data) {
    cityName.textContent = data.name;
    currentDate.textContent = formatDate(new Date(data.dt * 1000)); // Convert Unix timestamp to Date
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    condition.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1); // Capitalize first letter
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} M/s`;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.textContent = weatherIcons[iconCode] || '🌤️';
    setBodyBackground(iconCode); // Set background based on current weather
}

// Update forecast display
function updateForecast(data) {
    const forecastItems = forecast.querySelectorAll('.forecast-item');
    
    // Filter to get one entry per day for the next 3 days (around noon)
    const dailyForecasts = [];
    const seenDates = new Set();
    for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
        // Check if it's around noon (11-14h) and we haven't added this day yet
        if (!seenDates.has(dateKey) && date.getHours() >= 11 && date.getHours() <= 14) {
            dailyForecasts.push(item);
            seenDates.add(dateKey);
        }
        if (dailyForecasts.length >= 3) break; // Get forecast for next 3 distinct days
    }

    // Clear previous forecast items
    forecastItems.forEach(item => {
        item.querySelector('.forecast-date').textContent = '';
        item.querySelector('.forecast-icon').textContent = '';
        item.querySelector('.forecast-temp').textContent = '';
    });

    dailyForecasts.slice(0, 3).forEach((item, index) => {
        if (forecastItems[index]) {
            const date = new Date(item.dt * 1000);
            const dateStr = formatShortDate(date);
            const temp = Math.round(item.main.temp);
            const icon = weatherIcons[item.weather[0].icon] || '🌤️';
            
            forecastItems[index].querySelector('.forecast-date').textContent = dateStr;
            forecastItems[index].querySelector('.forecast-icon').textContent = icon;
            forecastItems[index].querySelector('.forecast-temp').textContent = `${temp}°C`;
        }
    });
}

// Format date
function formatDate(date) {
    const options = { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Format short date
function formatShortDate(date) {
    const options = { 
        day: '2-digit', 
        month: 'short' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Initialize the app
init();
