# Weather App (Node.js + Express)

A server-rendered weather web app: type a city, and the app geocodes it to latitude/longitude and returns the current weather — temperature, feels-like temperature, humidity, wind speed and conditions.

![weather icon](public/img/cloudy-day.png)

## Features
- City search → coordinates via the **OpenWeatherMap Geocoding API**
- Current conditions via the **Weatherstack API**
- Server-side rendered pages with **Handlebars** templates and shared partials (header / footer)
- JSON endpoint `GET /weather?city=<name>` used by the front-end with `fetch`
- Help, About and 404 pages
- API keys loaded from environment variables — nothing secret in the code

## Tech stack
Node.js · Express · Handlebars (hbs) · postman-request · vanilla JavaScript · CSS

## Project structure
```
weather-app/
├── src/
│   ├── app.js              # Express server: routes, views, static files, /weather API
│   └── utils/
│       ├── geocode.js      # city -> { lat, lon }   (OpenWeatherMap)
│       └── forecast.js     # { lat, lon } -> weather (Weatherstack)
├── public/                 # static assets served as-is
│   ├── css/style.css
│   ├── js/index.js         # form handling + fetch('/weather?city=...')
│   └── img/
├── templates/
│   ├── views/              # index, weather, about, help, 404
│   └── partials/           # header, footer
├── .env.example            # required environment variables
└── package.json
```

## Getting started
Requires **Node.js 20.6+** (for the built-in `--env-file` flag).
```bash
git clone https://github.com/kishorhange111/weather-app.git
cd weather-app
npm install
cp .env.example .env        # then add your API keys
npm start                   # http://localhost:4000
```
`npm run dev` restarts the server automatically on file changes.

## API
```
GET /weather?city=Pune
```
Returns the Weatherstack current-conditions JSON, or `{ "error": "..." }` if the city cannot be found or a service is unreachable.

## How it works
`/weather` chains two callbacks: `geocode(city)` resolves the coordinates, then `forecast({ lat, lon })` fetches the current weather. Errors at either step are returned as JSON so the front-end can show a friendly message.
