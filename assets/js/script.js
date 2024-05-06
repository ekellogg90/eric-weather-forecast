const cityFormEl = $('#city-form');
const cityInputEl = $('#city');
const cityWeatherContainerEl = $('#city-weather-container');
const citySearchTerm = $('#city-search-term');

const apiKey = "6e34f58ab2b58e72b5696fe8bcf776e7";
const resultLimit = "1";
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

function handleFormSubmit(event) {
    event.preventDefault();
    const cityName = cityInputEl.val().trim();

    if (!cityName) {
        alert("please enter a city name");
        return;
    }

    const cityList = readCityFromStorage();
    cityList.push(cityName);  // TODO add something to check if City is there already.  Add cities searched for as button elements?
    saveCityToStorage(cityList);
    fetchCityLatLon(cityName).then(function (response) {
        displayCity(response);
});
};

function fetchCityLatLon(city) {
    const cityGeoUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit="+resultLimit+"&appid="+apiKey+"&mode=json";  // set result limit to 1 assuming it'll grab most populous

    return fetch(cityGeoUrl)
        .then(function (response) {
            if (!response.ok) {
                alert(`Error:${response.statusText}`);
                return;
            }
            return response.json();
        }).then(function (cityData) {
            console.log(cityData);
            console.log(`${city}'s latitutde: ${cityData[0].lat}`);
            console.log(`${city}'s longitude: ${cityData[0].lon}`);
            return cityData;
        })
        .catch(function (error) {
            alert(`Unable to connect to Open Weather`);
            console.log(error);
        });  

};

function displayCity(cityData) {
    const cityUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+cityData[0].lat+"&lon="+cityData[0].lon+"&appid="+apiKey+"&mode=json&units=imperial";

    fetch(cityUrl)  // need Date, Temp, Wind, Humidity
        .then(function (response) {
            if (!response.ok) {
                alert(`Error:${response.statusText}`);
                return;
            }
            return response.json();
        }).then(function (cityInfo) {
            // Gives all weather data
            // console.log(cityInfo);

            // Date
            console.log(`Date / Time: ${cityInfo.list[0].dt_txt}`); // somehow set this to current dt/tm?

            // Temp
            console.log(`Temp: ${cityInfo.list[0].main.temp}`);

            // Wind
            console.log(`Wind Speed: ${cityInfo.list[0].wind.speed}`);

            // Humidity
            console.log(`Humidity: ${cityInfo.list[0].main.humidity}`);
        })
        .catch(function (error) {
            alert(`Unable to obtain City Info`);
            console.log(error);
        });

}


