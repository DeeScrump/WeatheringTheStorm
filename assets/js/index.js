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

function getWeatherDetails(lat, lon, city) {
    var apiUrl = `${weatherURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
    .then(function(res) {
        return res.json();
    })
    .then(function (data) {   
        displayData(data)
    })
    $("#cityName").text(city.toUpperCase() +" " + moment().format("MM/DD/YYYY"))
}

grabStoredCities();
formSearch.addEventListener('submit', citySearchSubmit);
historyEncap.addEventListener('click', cityHistoryLinks);