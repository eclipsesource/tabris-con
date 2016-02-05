var LoginPage = require("./page/LoginPage");
var loginService = require("../loginService");

exports.create = function() {
  var action = tabris.create("Action", {
    id: "loginAction",
    title: "Login",
    placementPriority: "high"
  }).on("select", function() {
    if (this.get("mode") === "login") {
      LoginPage.create()
        .open()
        .on("loginButtonTapped", function() {
          loginService.login().then(function() {
            action.set("mode", "logout");
          });
        });
    } else {
      loginService.logout().then(function() {
        action.set("mode", "login");
      });
    }
  }).on("change:mode", function(widget, mode) {
    action.set("title", mode === "login" ? "Login" : "Logout");
  });
  action.set("mode", loginService.isLoggedIn() ? "logout" : "login");
};
