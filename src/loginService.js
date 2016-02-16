var Promise = require("promise");
var codRemoteService = require("./codRemoteService");

exports.login = function(username, password) {
  return codRemoteService
    .login(username, password)
    .then(function(response) {
      persistUserData(response);
      return Promise.resolve();
    })
    .catch(function(e) {
      resetUserData();
      return Promise.reject(e);
    });
};

exports.logout = function() {
  return codRemoteService.logout().then(resetUserData);
};

exports.isLoggedIn = function() {
  return !!localStorage.getItem("username");
};

exports.getUserData = function() {
  return {
    username: localStorage.getItem("username"),
    fullName: localStorage.getItem("fullName"),
    mail: localStorage.getItem("mail")
  };
};

function persistUserData(response) {
  localStorage.setItem("username", response.user.name);
  localStorage.setItem("fullName",
    response.user.field_profile_first.und[0].value +
    " " +
    response.user.field_profile_last.und[0].value
  );
  localStorage.setItem("mail", response.user.mail);
}

function resetUserData() {
  localStorage.setItem("username", "");
  localStorage.setItem("fullName", "");
  localStorage.setItem("mail", "");
}
