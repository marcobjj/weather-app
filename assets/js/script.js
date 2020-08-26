// right now weather 
// http://api.openweathermap.org/data/2.5/weather?q=los%20angeles&appid=

// 5 day forecast every 3 hours (8 forecasts per day = 40 forecasts)
//http://api.openweathermap.org/data/2.5/forecast?q=los%20angeles&appid=

//icon url
//http://openweathermap.org/img/w/{icon-code}.png

//UV Index query
//https://samples.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=


const appID = "859953ab4803d79f48f7a0ab1d43109d";

var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=";
var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=";
var uvURL = "http://api.openweathermap.org/data/2.5/uvi?";

var displayCity = document.querySelector("#display-city");



var getWeather = function (city) {

    var apiUrl = weatherURL + city + "&appid=" + appID;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {


                displayWeather(data);
                getForecast(data.name);
                getUV(data.coord);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });


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


if (value <= 2) index.setAttribute("class","alert alert-success");
else if (value <= 5) index.setAttribute("class","alert alert-warning");
else index.setAttribute("class","alert alert-danger");



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

    for (var i = 5; dayHourArray.length; i += 8) {


        var data1 = dayHourArray[i];
        var displayDay = document.querySelector("#day" + day);

        if (!displayDay) {

            break;
        }

        displayDay.innerHTML = "";

        var icon = document.createElement("img");
        icon.setAttribute("src", "http://openweathermap.org/img/w/" + data1.weather[0].icon + ".png");

        var date = data1.dt_txt.split(" ")[0];

        var cityName = document.createElement("h6");
        cityName.textContent = city + " " + date;

        var temperature = document.createElement("p");
        temperature.textContent = "Temp: " + toFarenheit(data1.main.temp) + " \u00B0F";

        var humidity = document.createElement("p");
        humidity.textContent = "Humidity: " + data1.main.humidity + "%";

        displayDay.appendChild(cityName);
        displayDay.appendChild(icon);
        displayDay.appendChild(temperature);
        displayDay.appendChild(humidity);

        day++;
    }

}


var toFarenheit = function (kelvin) {


    var ff = Math.floor((kelvin - 273.15) * 9 / 5 + 32);

    return ff;
}