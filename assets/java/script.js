



//variables
var userFormEl = document.querySelector("#user-form");
var searchButtonEl = document.querySelector("#search-button");
var historyEl = document.querySelector("#history");
var searchCityNameEl = document.querySelector("#search-city-name");
var currentWeatherEl = document.querySelector("#current-weather");
var cityNameEl = document.querySelector("#city-name");
var weatherPicEl = document.querySelector("#weather-pic");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvIndex = document.querySelector("#uv-index");
var fiveDayEl = document.querySelector("#five-day");

//API KEY FOR DATA PULL
var apiKey = "16efe530a03f36f5677812dd45bcb3a02";

//function to get weather
var getWeather = function(cityName) {
  console.log("city name value :",cityName)
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

  //fetch the API and then display data
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      currentWeatherEl.classList.remove("d-none");
      console.log(data.name);
      //current weather 
      var currentDay = moment().format("L"); 
      cityNameEl.textContent = data.name + " (" + currentDay + ")";
      var weatherPic = data.weather[0].icon;
      weatherPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
      weatherPicEl.setAttribute("alt", data.weather[0].description);
      tempEl.textContent = "Temp: " + data.main.temp + " °F";
      humidityEl.textContent = "Humidity: " + data.main.humidity + " %";
      windEl.textContent = "Wind: " + data.wind.speed + " MPH";
    
      // get UV Index 
      var stationLat = data.coord.lat;
      var stationLong = data.coord.lon;
      var uvApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + stationLat + "&lon=" + stationLong + "&appid=" + apiKey;

      //fetch new API for UV Index and then display data
      fetch(uvApiUrl).then(function(response) {
        response.json().then(function(data) {
        var uvIndexSpan = document.createElement("span");

        //adds colors to UV index and append
        if (data.current.uvi < 2) {
          uvIndexSpan.setAttribute("class", "btn btn-success")
        } else if (data.current.uvi < 5) {
          uvIndexSpan.setAttribute("class", "btn btn-warning")
        } else {
          uvIndexSpan.setAttribute("class", "btn btn-danger")
        }
        console.log(data.current.uvi);
        uvIndexSpan.textContent = data.current.uvi
        uvIndex.textContent = "UV Index: ";
        uvIndex.append(uvIndexSpan);
        }); 
      });

      // 5 day forecast section
      var fiveDayApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;
      // fetch new API for 5 day forecast
      fetch(fiveDayApiUrl).then(function(response) {
        response.json().then(function(data) {
          console.log(data);
          fiveDayEl.classList.remove("d-none");
          var outlookEl = document.querySelectorAll(".outlook");

          //loop to add forecasts
          for (i = 0; i < outlookEl.length; i++) {
            outlookEl[i].textContent = "";
            var plusOneDay = moment().add(i, "days").format("MM-DD-YYYY");
            var outlookSpan = document.createElement("p");
            outlookSpan.setAttribute("class", "mt-3 mb-0");
            outlookSpan.textContent = plusOneDay;
            outlookEl[i].append(outlookSpan);

            //icons for forecasts
            var forecastIconEl = document.createElement("img");
            var forecastIndex= i * 8;
            var forecastPic = data.list[forecastIndex].weather[0].icon;
            forecastIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastPic + "@2x.png");
            forecastIconEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
            outlookEl[i].append(forecastIconEl);

            //rest of the forecast data
            var forecastTemp = document.createElement("p");
            var forecastWind = document.createElement("p");
            var forecastHumidity = document.createElement("p");
            forecastTemp.textContent= "Temp: " + data.list[forecastIndex].main.temp + " °F";
            forecastWind.textContent= "Wind: " + data.list[forecastIndex].wind.speed + " MPH";
            forecastHumidity.textContent= "Humidity: " + data.list[forecastIndex].main.humidity + " %";
            outlookEl[i].append(forecastTemp);
            outlookEl[i].append(forecastWind);
            outlookEl[i].append(forecastHumidity);
          };
        });
      });
    });
  });
}
//search button and makes an array if not one already made
searchButtonEl.addEventListener("click", function () {
  var selectedCity = searchCityNameEl.value;
  getWeather(selectedCity);
  var history = JSON.parse(window.localStorage.getItem("city")) || [];
  history.push(selectedCity);
  localStorage.setItem("city", JSON.stringify(history));
  getSearchHistory();
});

//get search history and make buttons
var getSearchHistory = function() {
  historyEl.textContent="";
  var history = JSON.parse(window.localStorage.getItem("city"));
  for (var i = 0; i < history.length; i++) {
  var historyItem = document.createElement("input");
  historyItem.setAttribute("type", "button");
  historyItem.setAttribute("class", "form-control d-block btn btn-light border mt-3");
  historyItem.setAttribute("value", history[i]);
  historyEl.append(historyItem);
  }
}
//recalls search history weather
historyEl.addEventListener("click", function(event) {
  getWeather(event.target.value);
});

getSearchHistory();
