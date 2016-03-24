var sizes = require("../resources/sizes");
var fontToString = require("../helpers/fontToString");
var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var loginService = require("../helpers/loginService");
var Input = require("../components/Input");
var ProgressButton = require("../components/ProgressButton");

exports.create = function() {
  var page = new tabris.Page({topLevel: false, id: "loginPage"});

  var scrollView = new tabris.ScrollView({left: 0, top: 0, right: 0, bottom: 0}).appendTo(page);

  var header = new tabris.Composite({
    id: "pageHeader",
    left: 0, top: 0, right: 0, height: sizes.PROFILE_AREA_TOP_OFFSET
  }).appendTo(scrollView);

  applyPlatformStyle(header);

  var loginTextView = new tabris.TextView({
    id: "loginTextView",
    text: "EclipseCon Login",
    font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
    left: sizes.MARGIN_LARGE, bottom: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE
  }).appendTo(header);

  applyPlatformStyle(loginTextView);

  var inputContainer = new tabris.Composite({
    id: "inputContainer",
    width: sizes.PAGE_CONTAINER_WIDTH, centerX: 0, top: [header, sizes.MARGIN_LARGE]
  }).appendTo(scrollView);

  var usernameInput = Input.create({
    id: "username",
    left: 0, right: 0,
    message: "eclipse.org e-mail address"
  }).on("change:text", updateLoginButtonState).appendTo(inputContainer);

  var passwordInput = Input.create({
    type: "password",
    id: "password",
    left: 0, right: 0,
    top: [usernameInput, sizes.MARGIN],
    message: "password"
  }).on("change:text", updateLoginButtonState).appendTo(inputContainer);

  var button = ProgressButton.create({id: "loginButton", text: "Login", enabled: false})
    .on("select", function() {
      this.set("progress", true);
      loginService.login(usernameInput.get("text"), passwordInput.get("text"));
    })
    .appendTo(inputContainer);

  page
    .on("appear", function() {
      tabris.ui.find("#loginAction").set("visible", false);
    })
    .on("disappear", function() {
      tabris.ui.find("#loginAction").set("visible", true);
    })
    .on("loginSuccess", function() {
      this.close();
    })
    .on("loginFailure", function() {
      button.set("progress", false);
    });

  function updateLoginButtonState() {
    button.set("enabled", inputValid());
  }

  function inputValid() {
    return usernameInput.get("text").length > 0 && passwordInput.get("text").length > 0;
  }

  return page;
};
