export let CouldNotFetchDataError = function(message) {
  this.name = "CouldNotFetchDataError";
  this.message = message || "Could not fetch data.";
  this.stack = (new Error()).stack;
};

CouldNotFetchDataError.prototype = Object.create(Error.prototype);
CouldNotFetchDataError.prototype.constructor = CouldNotFetchDataError;
