import texts from "./resources/texts";

export let CouldNotFetchDataError = function(message) {
  this.name = "CouldNotFetchDataError";
  this.message = message || texts.COULD_NOT_FETCH_DATA_ERROR;
  this.stack = (new Error()).stack;
};

CouldNotFetchDataError.prototype = Object.create(Error.prototype);
CouldNotFetchDataError.prototype.constructor = CouldNotFetchDataError;

export let logError = e => console.error(e.message || e, e.stack || "");
