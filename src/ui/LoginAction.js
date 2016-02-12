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
        .on("loginButtonTapped", function(page) {
          loginService.login(page.find("#username").get("text"), page.find("#password").get("text"))
          .then(function() {
            action.set("mode", "logout");
            page.trigger("success", this);
          })
          .catch(function(error) {
            page.trigger("error", this, error);
          });
        });
    } else {
      action.set("mode", "loggingOut");
      loginService.logout()
        .then(function() {
          action.set("mode", "login");
        })
        .catch(function() {
          action.set("mode", "logout");
        });
    }
  }).on("change:mode", function(widget, mode) {
    var modeTitle = {
      login: "Login",
      logout: "Logout",
      loggingOut: "Logging out..."
    };
    action.set("enabled", mode !== "loggingOut");
    action.set("title", modeTitle[mode]);
  });
  action.set("mode", loginService.isLoggedIn() ? "logout" : "login");

  tabris.ui.on("change:activePage", function(widget, page) {
    action.set("visible", page.get("topLevel"));
  });
};
