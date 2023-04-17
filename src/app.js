const express = require("express");
const path = require("path");
const hbs = require("hbs");
const forecast = require("./utils/forcast.js");
const geocode = require("./utils/geocode.js");
const app = express();

const pathDirectory = path.join(__dirname, "../public");
const viewsDirectory = path.join(__dirname, "../templates/views/");
const partiaslDir = path.join(__dirname, "../templates/partials/");
app.set("view engine", "hbs");
app.set("views", viewsDirectory);
app.use(express.static(pathDirectory));
hbs.registerPartials(partiaslDir);

app.get("", (req, res) => {
  res.render("index");
});

app.get("/help", (req, res) => {
  res.render("help");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/weather", (req, res) => {
  if (!req.query.city) {
    return res.send({
      error: "You must provide an address!",
    });
  }
  geocode(req.query.city, (error, data = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(data, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send(forecastData);
    });
  });
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(4000, () => {
  console.log("We are running server");
});
