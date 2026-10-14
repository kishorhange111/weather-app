/**
 * @file HTTP tests for the Express routes in src/app.js.
 * The app is started on a random free port; external APIs are mocked.
 */
const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fakeRequest = require("./helpers/fake-request");
const app = require("../src/app");

let server;
let baseUrl;

before(async () => {
  // Port 0 lets the OS pick any free port, so tests never clash.
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

beforeEach(() => {
  fakeRequest.reset();
  process.env.OPENWEATHER_API_KEY = "geo-key";
  process.env.WEATHERSTACK_API_KEY = "ws-key";
});

/** GET a path on the test server and return { status, text }. */
async function get(path) {
  const res = await fetch(baseUrl + path);
  return { status: res.status, text: await res.text() };
}

test("pages render", async () => {
  for (const path of ["/", "/help", "/about"]) {
    const { status, text } = await get(path);
    assert.equal(status, 200, path);
    assert.match(text, /Weather App/, path);
  }
});

test("unknown URLs render the 404 page", async () => {
  const { status } = await get("/does-not-exist");
  assert.equal(status, 200); // the app renders 404.hbs without changing the status code
});

test("static files are served from /public", async () => {
  const { status } = await get("/css/style.css");
  assert.equal(status, 200);
});

test("/weather without a city returns an error", async () => {
  const { text } = await get("/weather");
  assert.deepEqual(JSON.parse(text), { error: "You must provide an address!" });
});

test("/weather chains geocode -> forecast", async () => {
  const weather = { location: { name: "Pune" }, current: { temperature: 30 } };
  fakeRequest.respond = ({ url }) =>
    url.includes("openweathermap")
      ? [undefined, {}, [{ lat: 18.52, lon: 73.85 }]]
      : [undefined, {}, weather];

  const { text } = await get("/weather?city=Pune");
  assert.deepEqual(JSON.parse(text), weather);
  assert.equal(fakeRequest.calls.length, 2);
  assert.match(fakeRequest.calls[1].url, /query=18.52,73.85/);
});

test("/weather passes geocode errors through", async () => {
  fakeRequest.respond = () => [undefined, {}, []];
  const { text } = await get("/weather?city=Nowhere");
  assert.deepEqual(JSON.parse(text), { error: "Unable to find location. Try another search." });
});
