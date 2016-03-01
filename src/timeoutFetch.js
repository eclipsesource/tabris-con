/* globals fetch: false, Promise: true*/

require("whatwg-fetch");
var TIMEOUT = 8000;

module.exports = function() {
  return timeout(TIMEOUT, fetch.apply(this, arguments));
};

function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}
