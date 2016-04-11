/* globals fetch: false, Promise: true*/
import texts from "./resources/texts";

let TIMEOUT = 8000;

export default function() {
  return timeout(TIMEOUT, fetch.apply(this, arguments));
}

function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(texts.SERVER_TIMEOUT_ERROR));
    }, ms);
    promise.then(resolve, reject);
  });
}
