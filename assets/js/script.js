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
var displayCity = document.querySelector("#display-city");



var getWeather = function(city) {

    var apiUrl = weatherURL + city + "&appid="+appID;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

               
                displayWeather(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });


}


var displayWeather = function (data)
{

//var humidity = data.main.humidity;
//var temperature = data.main.temp;
//var windSpeed = data.wind.speed;
//var icon = data.weather[0].icon;

console.log(data);

//console.log(humidity+ " "+temperature+" "+windSpeed+" "+icon);


displayCity.innerHTML = "";

var city = document.createElement("h2");
city.textContent = data.name;

var icon = document.createElement("img");
icon.setAttribute("src", "http://openweathermap.org/img/w/"+data.weather[0].icon+".png");

city.appendChild(icon);


var temperature = document.createElement("p");
temperature.textContent = "Temperature: "+toFarenheit(data.main.temp)+" F";

var humidity = document.createElement("p");
humidity.textContent = "Humidity: "+data.main.humidity+"%";

var windSpeed = document.createElement("p");
windSpeed.textContent = "Wind: "+data.wind.speed +"MPH";

displayCity.appendChild(city);
displayCity.appendChild(temperature);
displayCity.appendChild(humidity);
displayCity.appendChild(windSpeed);



}

var toFarenheit = function (kelvin) {


   var ff = Math.floor((kelvin - 273.15) * 9/5 + 32) ;

    return ff;
}