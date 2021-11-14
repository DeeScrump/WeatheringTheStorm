var apiKey = "4f19201c0368d72d25707fd34bd61aba";
var weatherURL = "https://api.openweathermap.org";
var storedCities = [];

var formSearch = document.querySelector(".formSearch");
var buttonSearch = document.querySelector(".buttonSearch");
var inputSearch = document.querySelector(".inputSearch");
var historyEncap = document.querySelector(".history");
var dailyEncap = document.querySelector(".daily");
var forecastEncap = document.querySelector(".forecast");


function displayStoredCities() {
    // clear out 
    historyEncap.innerHTML ="";

    for (var i = 0; i < storedCities.length; i++) {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.classList.add('history-btn', 'btn-history');
  

      btn.setAttribute('data-search', storedCities[i]);
      btn.textContent = storedCities[i];
      historyEncap.append(btn);
    }
}

function addToStoredCities(userInput) {
    if (storedCities.indexOf(userInput) !== -1) {
      return;
    }
    storedCities.push(userInput);
  
    localStorage.setItem('city-history', JSON.stringify(storedCities));
    displayStoredCities();
}

function grabStoredCities() {
    var cityHistory = localStorage.getItem('city-history');
    if (cityHistory) {
        storedCities = JSON.parse(cityHistory);
    }
    displayStoredCities();
}

function getCityLatLong(userInput) {
    var apiUrl = `${weatherURL}/geo/1.0/direct?q=${userInput}&limit=5&appid=${apiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert(`Could not find a city named ${userInput}`);
        } else {
          addToStoredCities(userInput);
          getWeather(data[0]);
        }
      })
  }

function citySearchSubmit(e) {
    if (!inputSearch.value) {
      return;
    }
  
    e.preventDefault();
    var userInput = inputSearch.value.trim();
    getCityLatLong(userInput);
    inputSearch.value = '';
}

function cityHistoryLinks(e) {
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    var btn = e.target;
    var userInput = btn.getAttribute('data-search');
    getCityLatLong(userInput);
}

// function getWeatherDetails(lat, lon, city) {
//     var apiUrl = `${weatherURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

//     fetch(apiUrl)
//     .then(function(res) {
//         return res.json();
//     })
//     .then(function (data) {   
//         displayWeatherDetails(city, data)
//     })
// }

// function displayWeatherDetails(userInput) {
//     var lat = userInput.l
// }

function getWeather(location) {
    dailyEncap.innerHTML = "";
    forecastEncap.innerHTML ="<h2></h2>";
    var lat = location.lat;
    var lon = location.lon;
    var city = location.name;
    var apiUrl = `${weatherURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        $("<div>", { class: "row w-100 topBorder" })
          .append(
            $(
              "<div class='col'><h2>" +
                city +
                " (" +
                moment.unix(data.current.dt).format("M/DD/YYYY") +
                ")</h2><p>Temp: " +
                Math.round(data.current.temp) +
                "°F</p><p>Wind: " +
                Math.round(data.current.wind_speed) +
                " MPH</p><p>Humidity: " +
                data.current.humidity +
                "%</p><p>UV Index: <span id='topUvi' class='p-1 rounded text-dark'>" +
                data.current.uvi +
                "</span></p></div><div class='col'><img src='https://openweathermap.org/img/wn/" +
                data.current.weather[0].icon +
                "@4x.png' alt='weather icon'></div></div>"
            )
          )
          .appendTo($("#daily"));
        if (data.current.uvi <= 2) {
          $("#topUvi").css("background-color", "green");
        } else if (data.current.uvi <= 5) {
          $("#topUvi").css("background-color", "yellow");
        } else if (data.current.uvi <= 7) {
          $("#topUvi").css("background-color", "orange");
        } else if (data.current.uvi <= 10) {
          $("#topUvi").css("background-color", "red");
        } else {
          $("#topUvi").css("background-color", "purple");
        }
        $("#forecast").children("h2").text("5-Day Forecast");
        for (var i = 0; i < 5; i++) {
          $("<div>", { class: "col w-20 d-inline-flex" })
            .append(
              $(
                "<div class='card w-20'><img class='card-img-top mw-20' src='https://openweathermap.org/img/wn/" +
                  data.daily[i].weather[0].icon +
                  "@4x.png' alt='weather icon'><div class='card-body'><h5 class='card-title'>" +
                  moment.unix(data.daily[i].dt).format("M/DD/YYYY") +
                  "</h5><p class='card-text'>Temp: " +
                  Math.round(data.daily[i].temp.max) +
                  "°F</p><p class='card-text'>Wind: " +
                  Math.round(data.daily[i].wind_speed) +
                  " MPH</p><p class='card-text'>Humidity: " +
                  data.daily[i].humidity +
                  "%</p></div></div></div>"
              )
            )
            .appendTo($("#forecast"));
        }
        grabStoredCities();
    });
  }



grabStoredCities();
formSearch.addEventListener('submit', citySearchSubmit);
historyEncap.addEventListener('click', cityHistoryLinks);