/**
 * @file Unit tests for src/services/geocode.js and src/services/forecast.js.
 * The network is mocked (see helpers/fake-request.js).
 */
const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fakeRequest = require("./helpers/fake-request");
const geocode = require("../src/services/geocode");
const forecast = require("../src/services/forecast");

/** Wrap an error-first callback API in a promise: resolves to [error, data]. */
const call = (fn, arg) => new Promise((resolve) => fn(arg, (error, data) => resolve([error, data])));

beforeEach(() => {
  fakeRequest.reset();
  process.env.OPENWEATHER_API_KEY = "geo-key";
  process.env.WEATHERSTACK_API_KEY = "ws-key";
});

test("geocode returns the first match's coordinates", async () => {
  fakeRequest.respond = () => [undefined, {}, [{ lat: 18.52, lon: 73.85 }, { lat: 0, lon: 0 }]];
  assert.deepEqual(await call(geocode, "Pune"), [undefined, { lat: 18.52, lon: 73.85 }]);
  const { url, json } = fakeRequest.calls[0];
  assert.equal(json, true);
  assert.match(url, /geo\/1\.0\/direct\?q=Pune&limit=3&appid=geo-key$/);
});

test("geocode URL-encodes the city name", async () => {
  fakeRequest.respond = () => [undefined, {}, [{ lat: 1, lon: 2 }]];
  await call(geocode, "New York & Co");
  assert.match(fakeRequest.calls[0].url, /q=New%20York%20%26%20Co&/);
});

test("geocode reports an unknown city", async () => {
  fakeRequest.respond = () => [undefined, {}, []];
  const [error] = await call(geocode, "Nowhere");
  assert.equal(error, "Unable to find location. Try another search.");
});

test("geocode reports network failures", async () => {
  fakeRequest.respond = () => [new Error("ECONNREFUSED"), undefined, undefined];
  const [error] = await call(geocode, "Pune");
  assert.equal(error, "Unable to connect to location services!");
});

test("geocode needs an API key and makes no request without one", async () => {
  delete process.env.OPENWEATHER_API_KEY;
  const [error] = await call(geocode, "Pune");
  assert.equal(error, "Server is missing OPENWEATHER_API_KEY.");
  assert.equal(fakeRequest.calls.length, 0);
});

test("forecast returns the Weatherstack body", async () => {
  const body = { location: { name: "Pune" }, current: { temperature: 30 } };
  fakeRequest.respond = () => [undefined, {}, body];
  assert.deepEqual(await call(forecast, { lat: 18.52, lon: 73.85 }), [undefined, body]);
  assert.match(fakeRequest.calls[0].url, /current\?access_key=ws-key&query=18.52,73.85$/);
});

test("forecast reports API errors returned in the body", async () => {
  fakeRequest.respond = () => [undefined, {}, { error: { code: 615 } }];
  const [error] = await call(forecast, { lat: 0, lon: 0 });
  assert.equal(error, "Unable to find location");
});

test("forecast reports network failures", async () => {
  fakeRequest.respond = () => [new Error("timeout"), undefined, undefined];
  const [error] = await call(forecast, { lat: 0, lon: 0 });
  assert.equal(error, "Unable to connect to weather service!");
});

test("forecast needs an API key", async () => {
  delete process.env.WEATHERSTACK_API_KEY;
  const [error] = await call(forecast, { lat: 0, lon: 0 });
  assert.equal(error, "Server is missing WEATHERSTACK_API_KEY.");
});
