module.exports = function(globalVariable) {
  var oldGlobal = typeof global[globalVariable] !== "undefined" ? global[globalVariable] : undefined;

  beforeEach(function() {
    global[globalVariable] = {};
  });

  afterEach(function() {
    global[globalVariable] = oldGlobal;
  });
};
