const input = document.getElementById("input");
const btn = document.querySelector("form");
const msg1 = document.getElementById("msg1");
const msg2 = document.getElementById("msg2");
const msg3 = document.getElementById("msg3");
const msg4 = document.getElementById("msg4");
const msg5 = document.getElementById("msg5");
const msg6 = document.getElementById("msg6");
const msg = document.getElementById("msg");

btn.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value;
  input.value = "";
  msg1.textContent = "Loading...";
  msg1.style.textAlign = "center";
  msg1.style.marginTop = "40px";
  msg.textContent = "";
  msg2.textContent = "";
  msg3.textContent = "";
  msg4.textContent = "";
  msg5.textContent = "";
  fetch("http://127.0.0.1:4000/weather?city=" + city).then((response) => {
    response.json().then((data) => {
      msg1.style.textAlign = "left";
      msg1.style.marginTop = "0";
      msg.style.marginTop = "40px";
      msg.textContent = `Location : ${data.location.name}`;
      msg1.textContent = `Temperature : ${data.current.temperature}`;
      msg2.textContent = ``;
      msg3.textContent = `Feelslike Temperature : ${data.current.feelslike}`;
      msg4.textContent = `Humidity : ${data.current.humidity}`;
      msg5.textContent = `Wind Speed : ${data.current.wind_speed}`;
      const t = data.current.weather_descriptions[0];
      msg5.textContent = `Weather : ${t}`;
    });
  });
});
