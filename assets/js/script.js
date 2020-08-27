// right now weather 
// http://api.openweathermap.org/data/2.5/weather?q=los%20angeles&appid=

// 5 day forecast every 3 hours (8 forecasts per day = 40 forecasts)
//http://api.openweathermap.org/data/2.5/forecast?q=los%20angeles&appid=

//icon url
//http://openweathermap.org/img/w/{icon-code}.png

//UV Index query
//https://samples.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=


const appID = "859953ab4803d79f48f7a0ab1d43109d";

var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
var uvURL = "https://api.openweathermap.org/data/2.5/uvi?";

var weatherApp = {cities:["Los Angeles"]};

var displayCity = document.querySelector("#display-city");
var searchBtn = document.querySelector("#search-btn");
var cityList = document.querySelector("#city-list");

var noSearch = true;



var getWeather = function (city) {

    var apiUrl = weatherURL + city + "&appid=" + appID;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {


                displayWeather(data);
                getForecast(data.name);
                saveCity(data.name);

                return data.coord

            }).then(function(coord) {

                getUV(coord);

            })  ;
        } else {
            alert("Error: " + response.statusText);
        }
    });


}


var saveCity = function (city) {


    var searched = false;

    var cities = weatherApp.cities;

    for (var i = 0; i < cities.length; i++)
    {
        var city1 = cities[i];
        

        if (city == city1) 
        
        {
            searched = true;

            
        }
        
    }

    if (!searched) weatherApp.cities.push(city);
    if(weatherApp.cities.length > 8) weatherApp.cities.shift();

    localStorage.setItem("weatherApp",JSON.stringify(weatherApp));

    displayList();
   
}

var displayList = function () {
  
    cityList.innerHTML = '';
    
    var cities = weatherApp.cities;
    
    for (var i = cities.length -1; i >= 0; i--)
    {

        var li = document.createElement("li");
        li.setAttribute("class", "list-group-item");

        li.textContent = cities[i];
        cityList.appendChild(li);
    }


}

var getForecast = function (city) {

    var apiUrl = forecastURL + city + "&appid=" + appID;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {


                displayForecast(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });


}


var getUV = function (coord) {

    var apiUrl = uvURL + "lat=" + coord.lat + "&lon=" + coord.lon + "&appid=" + appID;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                console.log(data);
                 displayUV(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });


}

var displayUV = function (coord) {

var uv = document.createElement("p");
uv.textContent = "UV Index: ";

var index = document.createElement("span");


var value = coord.value;

index.textContent = value;


if (value <= 2) index.setAttribute("class","bg-success p-2 rounded text-white");
else if (value <= 5) index.setAttribute("class","bg-warning p-2 rounded text-white");
else index.setAttribute("class","alert bg-danger rounded p-2 text-white");



uv.appendChild(index);
displayCity.appendChild(uv);


}


var displayWeather = function (data) {

    console.log(data);

    displayCity.innerHTML = "";



    var city = document.createElement("h2");

    var date = moment.unix(data.dt).format("MM-DD-YYYY");

    city.textContent = data.name + " (" + date + ")";

    var icon = document.createElement("img");
    icon.setAttribute("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

    city.appendChild(icon);


    var temperature = document.createElement("p");
    temperature.textContent = "Temperature: " + toFarenheit(data.main.temp) + " \u00B0F";

    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + data.main.humidity + "%";

    var windSpeed = document.createElement("p");
    windSpeed.textContent = "Wind: " + data.wind.speed + "MPH";

    displayCity.appendChild(city);
    displayCity.appendChild(temperature);
    displayCity.appendChild(humidity);
    displayCity.appendChild(windSpeed);


}

var displayForecast = function (data, city) {

    console.log(data);

    var dayHourArray = data.list;



    var day = 1;

    for (var i = 0; i < dayHourArray.length; i ++) {

        var dt = dayHourArray[i].dt_txt;

        // free api only gives every 3 hours forecast (array with 40 items, therefore 5 days) . Forecast timezone seems off by 6 hours. Returns the weather at 12pm for each day "

        if(dt.split(" ")[1] != "18:00:00") continue;

        var data1 = dayHourArray[i];
        var displayDay = document.querySelector("#day" + day);

        if (!displayDay) {

            break;
        }

        displayDay.innerHTML = "";

        var icon = document.createElement("img");

        icon.setAttribute("src", "http://openweathermap.org/img/w/" + data1.weather[0].icon + ".png");

        var date = data1.dt_txt.split(" ")[0];

        var cityDate = document.createElement("h6");
        cityDate.textContent =  date;

        var temperature = document.createElement("p");
        temperature.textContent = "Temp: " + toFarenheit(data1.main.temp) + " \u00B0F";

        var humidity = document.createElement("p");
        humidity.textContent = "Humidity: " + data1.main.humidity + "%";

        displayDay.appendChild(cityDate);
        displayDay.appendChild(icon);
        displayDay.appendChild(temperature);
        displayDay.appendChild(humidity);

        day++;
    }

}

var init = function ()

{

   var temp = localStorage.getItem("weatherApp");
    if(temp)
    {
        weatherApp = JSON.parse(temp);
        console.log(weatherApp);

        var last = weatherApp.cities.length -1;
        getWeather(weatherApp.cities[last]);

    }
    else{
    getWeather("los angeles");
    }
}

var toFarenheit = function (kelvin) {


    var ff = Math.floor((kelvin - 273.15) * 9 / 5 + 32);

    return ff;
}


var searchHandler = function () {

    var inputField = document.querySelector("#input-field");

   if(inputField.value){
    
    getWeather(inputField.value);
   }
}

var cityClickHandler = function (event) {

    var city = event.target.textContent;

    getWeather(city);
}

init();

cityList.addEventListener('click',cityClickHandler);
searchBtn.addEventListener('click', searchHandler)