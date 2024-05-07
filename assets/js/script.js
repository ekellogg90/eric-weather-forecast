const cityFormEl = $('#city-form');
const cityInputEl = $('#city');
const cityWeatherContainerEl = $('#city-weather-container');
const cityContainerEl = $('#city-container');
const citySearchTerm = $('#city-search-term');
const cityCurrentDay = $('#city-current-day');

const apiKey = "6e34f58ab2b58e72b5696fe8bcf776e7";
const resultLimit = "1";

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
        fetchCityInfo(response);
        displayCitySearched(cityList);
});
    //displayCitySearched(cityList);
}

function fetchCityLatLon(city) {
    const cityGeoUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit="+resultLimit+"&appid="+apiKey+"&mode=json";  // set result limit to 1 assuming it'll grab most populous
    console.log(cityGeoUrl);
    return fetch(cityGeoUrl)
        .then(function (response) {
            if (!response.ok) {
                alert(`Error:${response.statusText}`);
                return;
            }
            return response.json();
        }).then(function (cityData) {
            /*
            console.log(cityData);
            console.log(`${city}'s latitutde: ${cityData[0].lat}`);
            console.log(`${city}'s longitude: ${cityData[0].lon}`);
            */
            return cityData;
        })
        .catch(function (error) {
            alert(`Unable to connect to Open Weather`);
            console.log(error);
        });  

}

function fetchCityInfo(cityData) {
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
            //console.log(cityInfo);

            // City Name
            console.log(cityInfo.city.name);

            // Date
            console.log(cityInfo.list[0].dt_txt); // TODO somehow set all these to current dt/tm?

            // Temp
            console.log(`Temp: ${cityInfo.list[0].main.temp}*F`);

            // Wind
            console.log(`Wind Speed: ${cityInfo.list[0].wind.speed}mph`);

            // Humidity
            console.log(`Humidity: ${cityInfo.list[0].main.humidity}%`);
        })
        .catch(function (error) {
            alert(`Unable to obtain City Info`);
            console.log(error);
        });
}

// function getSelectedCity(city) {
//     const cityUrl = 
// }

function displayCitySearched(city) {
    if (city.length === 0) {
        cityContainerEl.textContent = 'No city found';
        return;
    }

    console.log(city);

    for (let cityName of city) {
        const cityEl = $('<h3>');
        cityEl.attr('data-city', `${cityName}`);
        cityEl.text(cityName);

        cityContainerEl.append(cityEl);
    }
}

// function buttonClickHandler(event) {
//     const city = event.target.getAttribute('data-city'); // maybe pair with a .setAttribute('data-city', `${cityName}`)

//     if (city) {

//     }
// }

