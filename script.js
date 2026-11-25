// My Weather App
// Ye app Open-Meteo API use karti hai. Ye free hai aur isko API key nahi chahiye.
// Main ne async/await seekhne ke liye ye banaya hai.

// pehle saare HTML elements ko pakar lo
let cityInput = document.getElementById("cityInput");
let searchBtn = document.getElementById("searchBtn");
let loadingText = document.getElementById("loadingText");
let errorText = document.getElementById("errorText");
let weatherBox = document.getElementById("weatherBox");
let firstMessage = document.getElementById("firstMessage");
let forecastBox = document.getElementById("forecastBox");
let unitBtn = document.getElementById("unitBtn");

// ye variables baad mein kaam ayenge
let isCelsius = true;      // true matlab abhi °C show ho raha hai
let savedCity = null;      // last wali city ki info yahan save hogi
let savedWeather = null;   // last wala weather yahan save hoga (°C/°F change ke liye)

// --------------------------------------------
// Step 1: weather code ko emoji aur naam mein badlo
// Open-Meteo numbers deta hai, jaise 0 = saaf aasman
// --------------------------------------------
function getWeatherEmoji(code) {
  if (code == 0) {
    return { name: "Clear Sky", emoji: "☀️" };
  } else if (code == 1) {
    return { name: "Mostly Sunny", emoji: "🌤️" };
  } else if (code == 2) {
    return { name: "Partly Cloudy", emoji: "⛅" };
  } else if (code == 3) {
    return { name: "Cloudy", emoji: "☁️" };
  } else if (code == 45 || code == 48) {
    return { name: "Foggy", emoji: "🌫️" };
  } else if (code == 51 || code == 53 || code == 55) {
    return { name: "Drizzle", emoji: "🌦️" };
  } else if (code == 61 || code == 63 || code == 65) {
    return { name: "Rainy", emoji: "🌧️" };
  } else if (code == 71 || code == 73 || code == 75) {
    return { name: "Snowy", emoji: "❄️" };
  } else if (code == 80 || code == 81 || code == 82) {
    return { name: "Rain Showers", emoji: "🌦️" };
  } else if (code == 95 || code == 96 || code == 99) {
    return { name: "Thunderstorm", emoji: "⛈️" };
  } else {
    return { name: "Weather", emoji: "🌤️" };
  }
}

// temperature ko °C se °F mein badalne ke liye chota sa function
function convertTemp(temp) {
  if (isCelsius == true) {
    return Math.round(temp) + "°C";
  } else {
    let f = (temp * 9 / 5) + 32;
    return Math.round(f) + "°F";
  }
}

// error dikhane wala function
function showError(message) {
  errorText.innerText = message;
  errorText.style.display = "block";
}

function hideError() {
  errorText.style.display = "none";
}

// --------------------------------------------
// Step 2: main function jo weather lata hai
// --------------------------------------------
async function getWeather() {
  let city = cityInput.value.trim();

  // agar user ne kuch likha hi nahi
  if (city == "") {
    showError("Please type a city name first! 🙏");
    return;
  }

  // loading dikhao, purana error aur result chupao
  hideError();
  loadingText.style.display = "block";
  searchBtn.disabled = true;
  searchBtn.innerText = "Loading...";

  try {
    // Pehle API No.1: city ke naam se uski jagah (latitude / longitude) lo
    let cityUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1&language=en&format=json";
    let cityResponse = await fetch(cityUrl);
    let cityData = await cityResponse.json();

    // agar city nahi mili
    if (!cityData.results || cityData.results.length == 0) {
      showError('Sorry, city "' + city + '" not found. Please check spelling.');
      loadingText.style.display = "none";
      searchBtn.disabled = false;
      searchBtn.innerText = "Search";
      return;
    }

    let place = cityData.results[0];
    console.log("City mili:", place.name, place.latitude, place.longitude);

    // Phir API No.2: us jagah ka weather lo
    let weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude
      + "&longitude=" + place.longitude
      + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m"
      + "&daily=weather_code,temperature_2m_max,temperature_2m_min"
      + "&timezone=auto&forecast_days=5";

    let weatherResponse = await fetch(weatherUrl);
    let weatherData = await weatherResponse.json();

    // data save kar lo taake °C/°F button dobara API na bulaye
    savedCity = place;
    savedWeather = weatherData;

    // ab screen par dikhao
    showWeather();

  } catch (error) {
    // internet band ho ya koi aur masla ho jaye
    console.log("Error aaya:", error);
    showError("Something went wrong. Please check your internet and try again.");
  }

  // loading band kar do
  loadingText.style.display = "none";
  searchBtn.disabled = false;
  searchBtn.innerText = "Search";
}

// --------------------------------------------
// Step 3: weather ko screen par dikhao
// --------------------------------------------
function showWeather() {
  let current = savedWeather.current;
  let weatherInfo = getWeatherEmoji(current.weather_code);

  document.getElementById("cityName").innerText = savedCity.name;
  document.getElementById("countryName").innerText = savedCity.country;
  document.getElementById("weatherEmoji").innerText = weatherInfo.emoji;
  document.getElementById("temperature").innerText = convertTemp(current.temperature_2m);
  document.getElementById("description").innerText = weatherInfo.name;
  document.getElementById("feelsLike").innerText = "Feels like " + convertTemp(current.apparent_temperature);
  document.getElementById("humidity").innerText = current.relative_humidity_2m + "%";
  document.getElementById("wind").innerText = Math.round(current.wind_speed_10m) + " km/h";
  document.getElementById("rain").innerText = current.precipitation + " mm";

  if (isCelsius == true) {
    unitBtn.innerText = "Change to °F";
  } else {
    unitBtn.innerText = "Change to °C";
  }

  // 5 din ka forecast banao
  forecastBox.innerHTML = "";
  let days = savedWeather.daily.time;

  // din ke naam nikalne ke liye
  let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < days.length; i++) {
    let date = new Date(days[i] + "T12:00:00");
    let dayName = dayNames[date.getDay()];
    if (i == 0) {
      dayName = "Today";
    }

    let info = getWeatherEmoji(savedWeather.daily.weather_code[i]);
    let high = savedWeather.daily.temperature_2m_max[i];
    let low = savedWeather.daily.temperature_2m_min[i];

    // ek din ka chota sa box
    let box = '<div class="forecast-day">'
      + '<p class="day-name">' + dayName + '</p>'
      + '<p>' + (date.getDate()) + "/" + (date.getMonth() + 1) + '</p>'
      + '<p class="day-emoji">' + info.emoji + '</p>'
      + '<p>' + info.name + '</p>'
      + '<p><b>' + convertTemp(high) + '</b> / ' + convertTemp(low) + '</p>'
      + '</div>';

    forecastBox.innerHTML = forecastBox.innerHTML + box;
  }

  // result wala box dikhao, pehla message chupao
  firstMessage.style.display = "none";
  weatherBox.style.display = "block";
}

// --------------------------------------------
// Step 4: buttons ko kaam par lagao
// --------------------------------------------

// Search button par click
searchBtn.addEventListener("click", getWeather);

// Enter dabane se bhi search ho jaye
cityInput.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    getWeather();
  }
});

// example city buttons
let cityButtons = document.querySelectorAll(".city-btn");
cityButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    cityInput.value = button.getAttribute("data-city");
    getWeather();
  });
});

// °C / °F wala button
unitBtn.addEventListener("click", function () {
  if (isCelsius == true) {
    isCelsius = false;
  } else {
    isCelsius = true;
  }
  // save hue data se dobara dikhao, API dobara nahi bulani
  if (savedWeather != null) {
    showWeather();
  }
});

// jab page pehli baar khule to Karachi ka weather dikha do
cityInput.value = "Karachi";
getWeather();
