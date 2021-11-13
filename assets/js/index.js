var weatherAPIKey = "4f19201c0368d72d25707fd34bd61aba";
var weatherURL = "https://api.openweathermap.org";
var storedCities = [];

var formSearch = document.querySelector(".formSearch");
var buttonSearch = document.querySelector(".buttonSearch");
var inputSearch = document.querySelector("inputSearch");
var historyEncap = document.querySelector(".history");
var dailyEncap = document.querySelector(".daily");
var forecastEncap = document.querySelector(".forecast");


function displayStoredCities() {
    historyEncap.innerHTML ="";

    for (var i = 0; i < storedCities.length - 1; i++) {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.classList.add('history-btn', 'btn-history');
  

      btn.setAttribute('data-search', storedCities[i]);
      btn.textContent = storedCities[i];
      historyEncap.append(btn);
    }
}

function addtoStoredCities(userInput) {
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

function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!inputSearch.value) {
      return;
    }
  
    e.preventDefault();
    var userInput = inputSearch.value.trim();
    fetchCoords(userInput);
    inputSearch.value = '';
}

function handleSearchHistoryClick(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    var btn = e.target;
    var userInput = btn.getAttribute('data-search');
    fetchCoords(userInput);
}

grabStoredCities();
formSearch.addEventListener('submit', handleSearchFormSubmit);
historyEncap.addEventListener('click', handleSearchHistoryClick);