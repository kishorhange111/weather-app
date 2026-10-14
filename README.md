# Weather App (Node.js + Express)

[![CI](https://github.com/kishorhange111/weather-app/actions/workflows/ci.yml/badge.svg)](https://github.com/kishorhange111/weather-app/actions/workflows/ci.yml)

A server-rendered weather web app: type a city, and the app geocodes it to latitude/longitude and returns the current weather — temperature, feels-like temperature, humidity, wind speed and conditions.

<img src="public/img/cloudy-day.png" alt="Weather App icon" width="96">

_The repo has no UI screenshot yet. The image above is the app's icon._

## Features
- City search → coordinates via the **OpenWeatherMap Geocoding API**
- Current conditions via the **Weatherstack API**
- Server-side rendered pages with **Handlebars** templates and shared partials (header / footer)
- JSON endpoint `GET /weather?city=<name>` used by the front-end with `fetch`
- Help, About and 404 pages
- API keys loaded from environment variables — nothing secret in the code

## Tech stack
Node.js · Express · Handlebars (hbs) · postman-request · vanilla JavaScript · CSS · Bootstrap (CDN) · node:test · ESLint · GitHub Actions

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
├── test/                   # node:test suites (APIs mocked, no keys needed)
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

## Development
```bash
npm test       # unit tests for geocode/forecast + HTTP tests for every route
npm run lint   # ESLint (Node rules for the server, browser rules for public/js)
```
The tests replace `postman-request` with a fake (`test/helpers/fake-request.js`), so they make no network calls and need no API keys. GitHub Actions runs lint and the tests on Node 20 and 22 for every push.
