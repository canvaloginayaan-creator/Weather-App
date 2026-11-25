# 🌦️ My Weather App

This is my Weather App. I made this for my **Bano Qabil** assignment (Async JavaScript / Promises class).

Teacher gave us this repo to learn from: https://github.com/BasitHussain79/FE_BanoQabil/tree/async-js/promises

Then I made my own version in my own simple style. I kept the UI very simple and beginner friendly so I can understand my own code easily.

## What this app does

- Type any city name and press **Search** (or press Enter)
- Shows today's temperature, weather emoji and description
- Shows Feels Like, Humidity 💧, Wind 💨 and Rain 🌧️
- Shows next **5 days** forecast
- Button to change temperature between **°C and °F**
- Example city buttons: Karachi, Lahore, Islamabad, London
- Shows error message if city is not found or internet is not working
- Shows `Loading...` while data is coming
- By default Karachi weather shows when page opens

## How I made it

| File | What it does |
|---|---|
| `index.html` | Page structure (heading, search box, weather box) |
| `style.css` | Simple colors and boxes. I used Arial font, white box on sky-blue background |
| `script.js` | All the logic. Getting elements, calling API with `fetch()` + `async/await`, showing data on screen |

## API I used

I used **Open-Meteo** because it is free and does not need any API key.

1. First I find the city place:
   `https://geocoding-api.open-meteo.com/v1/search?name=Karachi&count=1`
2. Then I get weather from its latitude/longitude:
   `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=..&daily=..&forecast_days=5`

Weather codes (like `0`, `61`, `95`) come as numbers from API, so I wrote a small function `getWeatherEmoji()` that changes number into name + emoji like ☀️ Clear Sky, 🌧️ Rainy, ⛈️ Thunderstorm.

## How to run it

Option 1 (easy):
Just open `index.html` in your browser. Internet must be ON because weather comes live from API.

Option 2 (with a small server):
```bash
python3 -m http.server 8000
# then open http://localhost:8000 in browser
```

## Things I learned

- `fetch()` returns a Promise
- `async` / `await` makes async code easy to read
- `try / catch` for handling errors (like no internet)
- How to take data from JSON and show it on page with `document.getElementById`
- First API gives location, second API gives weather — one `await` after another

## Submission

- **GitHub Repository:** https://github.com/canvaloginayaan-creator/Weather-App
- **Vercel Deployment:** https://weather-app-delta-three-22.vercel.app/

## Ideas to add later

- [ ] My location button (auto detect city)
- [ ] Save last searched city
- [ ] Urdu language option

---
Made by me for learning. Weather data by [Open-Meteo](https://open-meteo.com/).
