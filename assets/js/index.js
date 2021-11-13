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
    // If there is no search term return the function
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
      .catch(function (err) {
        console.error(err);
      });
  }

function citySearchSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!inputSearch.value) {
      return;
    }
  
    e.preventDefault();
    var userInput = inputSearch.value.trim();
    getCityLatLong(userInput);
    inputSearch.value = '';
}

function cityHistoryLinks(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    var btn = e.target;
    var userInput = btn.getAttribute('data-search');
    getCityLatLong(userInput);
}

grabStoredCities();
formSearch.addEventListener('submit', citySearchSubmit);
historyEncap.addEventListener('click', cityHistoryLinks);