# PRODIGY_WD_05
Weather App
This is a simple and interactive Weather App that fetches and displays current weather conditions and a 3-day forecast for a specified city or your current location. The app features dynamic background gradients that change based on the current weather conditions.

Table of Contents
Features

Technologies Used

Setup and Installation

API Key

Usage

File Structure

Weather Icon Mapping

Background Gradient Mapping

Contributing

License

Features
Current Weather Display: Shows city name, date, weather icon, temperature, condition description, humidity, and wind speed.

3-Day Forecast: Provides a short forecast (date, icon, temperature) for the next three distinct days.

City Search: Allows users to search for weather by entering a city name.

Current Location Weather: Fetches weather data based on the user's geographical location (requires browser permission).

Dynamic Backgrounds: The background of the app changes dynamically with a gradient effect based on the current weather conditions (e.g., sunny, cloudy, rainy).

Loading and Error States: Provides visual feedback during data fetching and displays informative error messages if something goes wrong (e.g., invalid city, API key issues, geolocation errors).

Responsive Design: Adapts to different screen sizes for optimal viewing on various devices.

Technologies Used
HTML5: For the structure and content of the web page.

CSS3: For styling the application, including layout, typography, and visual effects like backdrop-filter and transitions.

JavaScript (ES6+): For fetching data from the OpenWeatherMap API, updating the DOM, handling user interactions, and managing dynamic backgrounds.

Setup and Installation
To get this project up and running on your local machine, follow these steps:

Download the files:
Download or clone the project files (weather.html, weather.css, weather.js).

Obtain an OpenWeatherMap API Key:
This app relies on the OpenWeatherMap API. You will need a free API key to fetch weather data.

Go to the OpenWeatherMap website.

Sign up for a free account.

Once logged in, navigate to the "API keys" tab to find your API key.

Insert your API Key:

Open weather.js in a text editor.

Locate the line: const API_KEY = 'YOUR_API_KEY_HERE';

Replace 'YOUR_API_KEY_HERE' with the API key you obtained from OpenWeatherMap.

Open weather.html:
Simply open the weather.html file in your web browser. The app should load, and you can start searching for weather or use the "Current Location" feature.

API Key
The API_KEY is crucial for the app to function. Ensure it is correctly placed in weather.js. If you encounter a 401 Unauthorized error, double-check your API key and ensure it has been activated (this might take a few minutes after generation).

Usage
Search by City: Type a city name into the input field and click the search button (magnifying glass icon) or press Enter.

Get Current Location Weather: Click the "Current Location" button (location pin icon) to fetch weather data based on your device's geolocation. You might be prompted to allow location access by your browser.

File Structure
.
├── weather.html    # Main HTML structure of the application
├── weather.css     # Styles for the application
└── weather.js      # JavaScript logic for fetching data and updating the UI

Weather Icon Mapping
The weather.js file includes a mapping of OpenWeatherMap icon codes to corresponding emojis for a more visual representation of weather conditions:

const weatherIcons = {
    '01d': '☀️', '01n': '🌙', // Clear sky (day/night)
    '02d': '⛅', '02n': '⛅', // Few clouds (day/night)
    '03d': '☁️', '03n': '☁️', // Scattered clouds (day/night)
    '04d': '☁️', '04n': '☁️', // Broken clouds (day/night)
    '09d': '🌧️', '09n': '🌧️', // Shower rain (day/night)
    '10d': '🌦️', '10n': '🌦️', // Rain (day/night)
    '11d': '⛈️', '11n': '⛈️', // Thunderstorm (day/night)
    '13d': '🌨️', '13n': '🌨️', // Snow (day/night)
    '50d': '🌫️', '50n': '🌫️'  // Mist/Fog/Haze (day/night)
};

Background Gradient Mapping
The weather.js file also defines various linear gradients that are applied to the body element based on the fetched weather icon code, providing a dynamic visual experience:

const backgroundMap = {
    '01d': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', // Clear sky (day)
    '01n': 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)', // Clear sky (night)
    '02d': 'linear-gradient(135deg, #ADD8E6 0%, #87CEEB 100%)', // Few clouds (day)
    '02n': 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)', // Few clouds (night)
    // ... (other weather conditions and their gradients)
};

Contributing
Feel free to fork this repository, suggest improvements, or report issues.

License
This project is open-source and available under the MIT License.
