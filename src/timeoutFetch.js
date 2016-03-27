/* globals fetch: false, Promise: true*/

let TIMEOUT = 8000;

export default function() {
  return timeout(TIMEOUT, fetch.apply(this, arguments));
}

function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Server timeout. Please try again later."));
    }, ms);
    promise.then(resolve, reject);
  });
}
