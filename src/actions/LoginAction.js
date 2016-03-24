var LoginPage = require("../pages/LoginPage");
var IOSProfilePage = require("../pages/IOSProfilePage");
var loginService = require("../helpers/loginService");
var getImage = require("../helpers/getImage");

exports.create = function() {
  var action = new tabris.Action({
    id: "loginAction",
    title: "Login",
    placementPriority: "high"
  }).on("select", function() {
    var modeAction = {login: showLoginPage, loggedIn: showProfilePage};
    modeAction[this.get("mode")](this);
  }).on("change:mode", function(widget, mode) {
    action.set("title", {login: "Login", loggedIn: "Profile"}[mode]);
    var actionImage = getImage.forDevicePlatform("action_profile");
    action.set("image", {login: null, loggedIn: actionImage}[mode]);
  });

  action.on("logoutSuccess", function() {action.set("mode", "login");});
  action.on("logoutFailure", function() {action.set("mode", "loggedIn");});
  action.set("mode", loginService.isLoggedIn() ? "loggedIn" : "login");
  tabris.ui.on("change:activePage", maybeShowAction(action));
};

function showLoginPage(action) {
  return LoginPage.create()
    .open()
    .on("loginSuccess", function() {action.set("mode", "loggedIn");});
}

function showProfilePage() {
  IOSProfilePage.create()
    .open()
    .set("data", loginService.getUserData());
}

function maybeShowAction(action) {
  return function(widget, page) {action.set("visible", page.get("topLevel"));};
}
