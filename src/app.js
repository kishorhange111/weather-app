/**
 * @file Express server for the Weather App.
 *
 * Responsibilities:
 *   - serve static files (CSS, browser JS, images) from /public
 *   - render the Handlebars pages (home, help, about, 404)
 *   - expose GET /weather?city=<name>, which chains two API calls:
 *       city --geocode()--> { lat, lon } --forecast()--> current weather JSON
 *
 * The app object is exported without listening, so tests can start it on a
 * random port; src/server.js starts the real server (`npm start`).
 */
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const forecast = require("./services/forecast.js");
const geocode = require("./services/geocode.js");
const app = express();

// Absolute paths built from __dirname, so the server works no matter which
// folder it is started from.
const pathDirectory = path.join(__dirname, "../public");
const viewsDirectory = path.join(__dirname, "../views");
const partialsDirectory = path.join(__dirname, "../views/partials");

// Use Handlebars (.hbs files) to render pages, and look for them in views/.
app.set("view engine", "hbs");
app.set("views", viewsDirectory);
// Anything in /public (css/, js/, img/) is served as-is, e.g. /css/style.css.
app.use(express.static(pathDirectory));
// Partials ({{>header}}, {{>footer}}) are shared snippets reused by every page.
hbs.registerPartials(partialsDirectory);

// Home page with the search form.
app.get("", (req, res) => {
  res.render("index");
});

app.get("/help", (req, res) => {
  res.render("help");
});

app.get("/about", (req, res) => {
  res.render("about");
});

/**
 * JSON API used by public/js/index.js.
 *
 * Query: ?city=<name>
 * Success: the Weatherstack "current" response body.
 * Failure: { error: "<message>" } (still HTTP 200, so the browser code only
 * has to check for an `error` field).
 */
app.get("/weather", (req, res) => {
  if (!req.query.city) {
    // `return` stops here so we never try to send a second response below.
    return res.send({
      error: "You must provide an address!",
    });
  }
  // Step 1: city name -> coordinates. `data = {}` gives a safe default so
  // destructuring inside forecast() cannot crash if data is undefined.
  geocode(req.query.city, (error, data = {}) => {
    if (error) {
      return res.send({ error });
    }
    // Step 2: coordinates -> current weather.
    forecast(data, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send(forecastData);
    });
  });
});

// Catch-all: any other URL gets the 404 page. Must be registered last,
// because Express checks routes in the order they were added.
app.get("*", (req, res) => {
  res.render("404");
});

module.exports = app;
