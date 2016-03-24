/* globals fetch: false, Promise: true*/

var TIMEOUT = 8000;

module.exports = function() {
  return timeout(TIMEOUT, fetch.apply(this, arguments));
};

function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("Server timeout. Please try again later."));
    }, ms);
    promise.then(resolve, reject);
  });
}
