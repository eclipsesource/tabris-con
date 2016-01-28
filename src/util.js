exports.deepClone = function(object) {
  return JSON.parse(JSON.stringify(object));
};
