var weatherAPIKey = "4f19201c0368d72d25707fd34bd61aba";
var weatherURL = "https://api.openweathermap.org";
var trackHistory = [];

//Using dayjs to get timezone ifnormation
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

var formSearch = document.querySelector(".formSearch");
var buttonSearch = document.querySelector(".buttonSearch");
var inputSearch = document.querySelector("inputSearch");
var historyEncap = document.querySelector(".history");
var dailyEncap = document.querySelector(".daily");
var forecastEncap = document.querySelector(".forecast");


