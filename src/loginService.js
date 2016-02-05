var Promise = require("promise");

exports.login = function() {
  // TODO: stub
  localStorage.setItem("loginToken", "token");
  return Promise.resolve();
};

exports.logout = function() {
  // TODO: stub
  localStorage.setItem("loginToken", "");
  return Promise.resolve();
};

exports.isLoggedIn = function() {
  // TODO: stub
  return !!localStorage.getItem("loginToken");
};
