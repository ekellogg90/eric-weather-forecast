const cityFormEl = $('#city-form');
const cityInputEl = $('#city');
const cityWeatherContainerEl = $('#city-weather-container');
const citySearchTerm = $('#city-search-term');

const apiKey = "6e34f58ab2b58e72b5696fe8bcf776e7";
const resultLimit = "5";
const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={${apiKey}}`;
const geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={${resultLimit}}&appid={${apiKey}}`;

// Retrieve City from Local Storage, initializes if not found
function readCityFromStorage() {
    let cityList = JSON.parse(localStorage.getItem("city"));
    if (!cityList) {
        cityList = [];
    }
    return cityList;
}

// Save City to Local Storage
function saveCityToStorage(cityList) {
    localStorage.setItem('city', JSON.stringify(cityList));
}

// Calls handleFormSubmit on form submittal
cityFormEl.on('submit', handleFormSubmit);

function handleFormSubmit() {
    const cityName = cityInputEl.val().trim();

    if (!cityName) {
        alert("please enter a city name");
        return;
    }

    const cityList = readCityFromStorage();
    cityList.push(cityName);  // add something to check if City is there already
    saveCityToStorage(cityList);
    // renderCityList();
}

const getCityInfo = function (city) {
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},{state code},{country code}&limit=${resultLimit}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data, user);
                });
            } else {
                alert(`Error:${response.statusText}`);
            }
        })
        .catch(function (error) {
            alert(`Unable to connect to Open Weather`);
        });
};

const displayWeather = function (cities, searchTerm) {
    if (cities.length === 0) {
        cityWeatherContainerEl.textContent = `No Cities Found`;
        return;
    }

    citySearchterm.textContent = searchTerm;


}
