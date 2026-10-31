/**
 * @file Replace the `postman-request` module with a controllable fake.
 *
 * Must be required *before* src/services/*.js, because they grab the module
 * once at load time. Each test sets `fakeRequest.respond` to decide what the
 * "API" answers, and can inspect `fakeRequest.calls` to see the URLs used.
 * No real network traffic happens in the tests.
 */
const fakeRequest = {
  /** Every options object passed to request(), in order. */
  calls: [],
  /**
   * Decide the response for a call: return [error, response, body].
   * @type {(options: {url: string}) => [any, any, any]}
   */
  respond: () => [new Error("no fake response configured"), undefined, undefined],
  /** Forget previous calls and responses. */
  reset() {
    this.calls = [];
    this.respond = () => [new Error("no fake response configured"), undefined, undefined];
  },
};

/** Stand-in for postman-request: records the call and answers asynchronously. */
function request(options, callback) {
  fakeRequest.calls.push(options);
  const [error, response, body] = fakeRequest.respond(options);
  // Real HTTP calls are async; setImmediate keeps that behaviour.
  setImmediate(() => callback(error, response, body));
}

// Put the fake into Node's module cache under the real module's path, so
// `require("postman-request")` anywhere returns it.
const resolved = require.resolve("postman-request");
require.cache[resolved] = { id: resolved, filename: resolved, loaded: true, exports: request };

module.exports = fakeRequest;
