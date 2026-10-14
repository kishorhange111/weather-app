/**
 * @file Browser script for the home page search form.
 *
 * On submit it calls the server's /weather endpoint and writes the result
 * into the <p id="msg*"> placeholders in templates/views/index.hbs.
 */

// Grab the elements once up front instead of on every search.
const input = document.getElementById("input");
const btn = document.querySelector("form");
const msg1 = document.getElementById("msg1");
const msg2 = document.getElementById("msg2");
const msg3 = document.getElementById("msg3");
const msg4 = document.getElementById("msg4");
const msg5 = document.getElementById("msg5");
// eslint-disable-next-line no-unused-vars -- placeholder exists in the template but is not used yet
const msg6 = document.getElementById("msg6");
const msg = document.getElementById("msg");

btn.addEventListener("submit", (e) => {
  // Stop the browser's default form submit, which would reload the page.
  e.preventDefault();
  const city = input.value;
  input.value = "";
  // Show a loading message and clear the previous result.
  msg1.textContent = "Loading...";
  msg1.style.textAlign = "center";
  msg1.style.marginTop = "40px";
  msg.textContent = "";
  msg2.textContent = "";
  msg3.textContent = "";
  msg4.textContent = "";
  msg5.textContent = "";
  // Relative URL: works on localhost and on any deployed host/port.
  fetch("/weather?city=" + encodeURIComponent(city)).then((response) => {
    response.json().then((data) => {
      // The server reports problems as { error: "..." }.
      if (data.error) {
        msg1.style.textAlign = "center";
        msg1.textContent = data.error;
        return;
      }
      msg1.style.textAlign = "left";
      msg1.style.marginTop = "0";
      msg.style.marginTop = "40px";
      msg.textContent = `Location : ${data.location.name}`;
      msg1.textContent = `Temperature : ${data.current.temperature}`;
      msg2.textContent = ``;
      msg3.textContent = `Feelslike Temperature : ${data.current.feelslike}`;
      msg4.textContent = `Humidity : ${data.current.humidity}`;
      // Note: msg5 is written twice, so the weather description below
      // replaces the wind speed line on screen.
      msg5.textContent = `Wind Speed : ${data.current.wind_speed}`;
      const t = data.current.weather_descriptions[0];
      msg5.textContent = `Weather : ${t}`;
    });
  });
});
