var LoginPage = require("./page/LoginPage");

exports.create = function() {
  tabris.create("Action", {
    id: "loginAction",
    title: "Login",
    placementPriority: "high"
  }).on("select", function() {
    LoginPage.create().open();
  });
};
