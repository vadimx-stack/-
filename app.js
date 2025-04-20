const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&q=';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cityElement = document.getElementById('city');
const dateElement = document.getElementById('date');
const tempElement = document.getElementById('temp').querySelector('span');
const weatherElement = document.getElementById('weather');
const weatherIconElement = document.getElementById('weather-icon');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const pressureElement = document.getElementById('pressure');

function formatDate(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('ru-RU', options);
}

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        if (!response.ok) {
            throw new Error('Город не найден');
        }
        
        const data = await response.json();
        
        cityElement.textContent = data.name;
        dateElement.textContent = formatDate(new Date());
        tempElement.textContent = Math.round(data.main.temp);
        weatherElement.textContent = data.weather[0].description;
        weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
        humidityElement.textContent = `${data.main.humidity}%`;
        windSpeedElement.textContent = `${data.wind.speed} м/с`;
        
        const pressureInMmHg = Math.round(data.main.pressure * 0.750062);
        pressureElement.textContent = `${pressureInMmHg} мм рт.ст.`;
        
        document.querySelector('.weather-app').style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
        
    } catch (error) {
        weatherElement.textContent = 'Город не найден';
        console.error('Ошибка при получении данных о погоде:', error);
    }
}

searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        checkWeather(city);
    }
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            checkWeather(city);
        }
    }
});

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${apiKey}`;
                
                const response = await fetch(geoUrl);
                if (!response.ok) {
                    throw new Error('Не удалось получить данные о погоде');
                }
                
                const data = await response.json();
                cityElement.textContent = data.name;
                dateElement.textContent = formatDate(new Date());
                tempElement.textContent = Math.round(data.main.temp);
                weatherElement.textContent = data.weather[0].description;
                weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
                humidityElement.textContent = `${data.main.humidity}%`;
                windSpeedElement.textContent = `${data.wind.speed} м/с`;
                
                const pressureInMmHg = Math.round(data.main.pressure * 0.750062);
                pressureElement.textContent = `${pressureInMmHg} мм рт.ст.`;
                
            } catch (error) {
                console.error('Ошибка при получении геолокации:', error);
                checkWeather('Москва');
            }
        }, () => {
            checkWeather('Москва');
        });
    } else {
        checkWeather('Москва');
    }
}

window.addEventListener('load', getCurrentLocation); 