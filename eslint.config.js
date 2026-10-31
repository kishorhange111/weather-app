// ESLint flat config: Node (CommonJS) for the server and tests, browser
// globals for the front-end script in public/js.
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["public/js/**/*.js"],
    languageOptions: { sourceType: "script", globals: globals.browser },
  },
];
