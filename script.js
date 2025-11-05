// script.js

// API Configuration
const API_KEY = 'e1d3f52f8ffa4a4ed577887d2d51230f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.getElementById('weather-display');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');
const weatherIconEl = document.getElementById('weather-icon');
const errorEl = document.getElementById('error-message');

// Event Listener for the Search Button
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        displayError('Please enter a city name.');
    }
});

/**
 * Fetches weather data from the OpenWeatherMap API.
 * @param {string} city - The name of the city to fetch weather for.
 */
async function fetchWeather(city) {
    // CORRECT URL CONSTRUCTION: Use the base, then '?' for the first parameter, and '&' for the rest.
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    // Clear previous results and errors
    weatherDisplay.classList.add('hidden');
    errorEl.textContent = '';

    try {
        const response = await fetch(url);
        
        // Check if the response status is not OK (e.g., 404 for city not found)
        if (!response.ok) {
            // Parse the error message from the API response body
            const data = await response.json();
            throw new Error(data.message || 'City not found or API error.');
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        console.error('Fetch error:', error);
        displayError(error.message || 'Failed to retrieve weather data.');
    }
}

/**
 * Displays the fetched weather data on the page.
 * @param {object} data - The weather data object from the API.
 */
function displayWeather(data) {
    // Extract key data points
    const city = data.name;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    // Capitalize first letter of each word
    const description = data.weather[0].description.replace(/\b\w/g, char => char.toUpperCase()); 
    const humidity = data.main.humidity;
    // Convert m/s to km/h and round to one decimal
    const windSpeed = (data.wind.speed * 3.6).toFixed(1); 
    const iconCode = data.weather[0].icon;

    // Update HTML elements
    cityNameEl.textContent = city;
    temperatureEl.textContent = `${temp}°C`;
    descriptionEl.textContent = description;
    humidityEl.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windSpeed} km/h`;
    feelsLikeEl.textContent = `${feelsLike}°C`;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconEl.alt = description;

    // Show the weather card with a smooth transition
    weatherDisplay.classList.remove('hidden');
}

/**
 * Displays an error message to the user.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
    errorEl.textContent = `Error: ${message}`;
    weatherDisplay.classList.add('hidden');
}
