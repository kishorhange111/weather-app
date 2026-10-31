/**
 * @file Entry point: start the Weather App HTTP server.
 *
 * Kept separate from src/app.js so the tests can import the Express app
 * without opening a port. Run with `npm start` (reads .env) or `npm run dev`.
 */
const app = require("./app");

// PORT is set by most hosting platforms; 4000 is the local default.
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Weather app running on http://localhost:${port}`);
});
