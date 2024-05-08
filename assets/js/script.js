/*

TODO: Incorporate current dt/tm w/ dayJS.  convert unix

TODO: 5 day forecast w/ Icon for Weather conditions

TODO: error handling if city doesn't exist

TODO:  Clean up UI
*/

const cityFormEl = $('#city-form');
const cityInputEl = $('#city');
const cityWeatherContainerEl = $('#city-weather-container');
const cityContainerEl = $('#city-container');
const cityContainerBtn = $('#city-container button');
const citySearchTerm = $('#city-search-term');
const cityCurrentDay = $('#city-current-day');

const apiKey = "6e34f58ab2b58e72b5696fe8bcf776e7";
const resultLimit = "1";

const today = dayjs();

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

// // Calls cityClickHandler on Click
// cityContainerBtn.on('click', cityClickHandler);

function handleFormSubmit(event) {
    event.preventDefault();
    const cityName = cityInputEl.val().trim();

    if (!cityName) {
        alert("please enter a city name");
        return;
    } else {
        cityContainerEl.text("");  // Clears out the appended cities upon submit so the updated list can be re-added
        cityCurrentDay.text("");
        cityInputEl.val("");
    }

    const cityList = readCityFromStorage();

    // Keeps duplicates from Local Storage
    if (cityList.indexOf(cityName) === -1) {
        cityList.push(cityName);
    }

    saveCityToStorage(cityList);

    fetchCityLatLon(cityName).then(function (response) {
        fetchCityInfo(response);
        displayCitySearched(cityList);
});
}

// Not sure about this and 42
function cityClickHandler(event) {
    //event.preventDefault();
    const cityName = $(event.target).attr('data-city');
    console.log(cityName);

    cityCurrentDay.text("");

    fetchCityLatLon(cityName).then(function (response) {
        fetchCityInfo(response);

        console.log(cityName);
    });
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
            return cityData;
        })
        .catch(function (error) {
            alert(`Unable to connect to Open Weather`);
            console.log(error);
        });  

}

function fetchCityInfo(cityData) {
    const cityUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+cityData[0].lat+"&lon="+cityData[0].lon+"&appid="+apiKey+"&mode=json&units=imperial";

    fetch(cityUrl)
        .then(function (response) {
            if (!response.ok) {
                alert(`Error:${response.statusText}`);
                return;
            }
            return response.json();
        }).then(function (cityInfo) {
            // Gives all weather data
            console.log(cityInfo);

            if (!cityInfo.city.name) {
                cityCurrentDay.text('No city found');
                return;
            }

            // Set wind direction
            let windDirection = cityInfo.list[0].wind.deg;
            if (windDirection <= 60) {
                windDirection = "North";
            } else if (windDirection <= 140) {
                windDirection = "East";
            } else if (windDirection <= 230) {
                windDirection = "South";
            } else if (windDirection <= 320) {
                windDirection = "West";
            } else if (windDirection > 320) {
                windDirection = "North";
            } else {
                windDirection = "No Wind";
            }

            const singleCityEl = $('<div>');

            const singleCityName = $('<h2>');
            singleCityName.text(cityInfo.city.name);

            const singleCityDate = $('<p>');
            let todayUnixDate = cityInfo.list[0].dt;
            // Convert Unix Date
            singleCityDate.text(dayjs.unix(todayUnixDate).format('MMM D, YYYY, hh:mm:ss a'));

            const singleCityTemp = $('<p>');
            singleCityTemp.text(`Temp: ${cityInfo.list[0].main.temp}*F`);

            const singleCityWind = $('<p>');
            singleCityWind.text(`Wind Speed: ${cityInfo.list[0].wind.speed}mph` + ' ' + `from the ${windDirection}`);    

            const singleCityHumidity = $('<p>');
            singleCityHumidity.text(`Humidity: ${cityInfo.list[0].main.humidity}%`)

            singleCityEl.append(singleCityName, singleCityDate, singleCityTemp, singleCityWind);

            cityCurrentDay.append(singleCityEl);


            // 5 day forecast cards
            for (let i = 8; i <= cityInfo.list.length; i = i + 8) {
                const cityCardEl = $('<div>');

                const cityCardName = $('<h3>');
                cityCardName.text(cityInfo.city.name);

                const cityCardDate = $('<p>');
                let cardUnixDate = cityInfo.list[i].dt;
                cityCardDate.text(dayjs.unix(cardUnixDate).format('MMM D, YYYY, hh:mm:ss a'));

                const cityCardTemp = $('<p>');
                cityCardTemp.text(`Wind Speed: ${cityInfo.list[i].wind.speed}mph`);

                const cityCardHumidity = $('<p>');
                cityCardHumidity.text(`Humidity: ${cityInfo.list[i].main.humidity}%`);

                //append things

            }
        })
        .catch(function (error) {
            alert(`Unable to obtain City Info`);
            console.log(error);
        });
}

function displayCitySearched(city) {
    if (city.length === 0) {
        cityContainerEl.text('No city located');
        return;
    }

    // Appends list of cities in localStorage beneath search bar
    for (let cityName of city) {
        const cityEl = $('<button>');
        cityEl.addClass('d-flex flex-column btn btn-secondary')
        cityEl.attr('data-city', `${cityName}`);
        cityEl.text(cityName);
        cityEl.on('click', cityClickHandler);

        cityContainerEl.append(cityEl);
    }
}


