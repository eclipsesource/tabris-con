var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var applyPlatformStyle = require("../applyPlatformStyle");
var Input = require("../Input");
var ProgressButton = require("../ProgressButton");

exports.create = function() {
  var page = tabris.create("Page", {topLevel: false, id: "loginPage"});

  var scrollView = tabris.create("ScrollView", {left: 0, top: 0, right: 0, bottom: 0}).appendTo(page);

  var header = tabris.create("Composite", {
    id: "pageHeader",
    left: 0, top: 0, right: 0, height: sizes.DRAWER_USER_AREA_LOGGED_IN_HEIGHT
  }).appendTo(scrollView);

  applyPlatformStyle(header);

  var loginTextView = tabris.create("TextView", {
    id: "loginTextView",
    text: "EclipseCon Login",
    font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
    left: sizes.MARGIN_LARGE, bottom: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE
  }).appendTo(header);

  applyPlatformStyle(loginTextView);

  var inputContainer = tabris.create("Composite", {
    id: "inputContainer",
    width: sizes.LOGIN_INPUT_WIDTH, centerX: 0, top: [header, sizes.MARGIN_LARGE]
  }).appendTo(scrollView);

  var emailInput = Input.create({
    id: "username",
    left: 0, right: 0,
    message: "eclipse.org e-mail address"
  }).on("change:text", updateLoginButtonState).appendTo(inputContainer);

  var passwordInput = Input.create({
    type: "password",
    id: "password",
    left: 0, right: 0,
    top: [emailInput, sizes.MARGIN],
    message: "password"
  }).on("change:text", updateLoginButtonState).appendTo(inputContainer);

  var button = ProgressButton.create({id: "loginButton", text: "Login", enabled: false})
    .on("select", function() {
      this.set("progress", true);
      page.trigger("loginButtonTapped", page, emailInput.get("text"), passwordInput.get("text"));
    })
    .appendTo(inputContainer);

  page
    .on("appear", function() {
      tabris.ui.find("#loginAction").set("visible", false);
    })
    .on("disappear", function() {
      tabris.ui.find("#loginAction").set("visible", true);
    })
    .on("success", function() {
      this.close();
    })
    .on("error", function() {
      button.set("progress", false);
    });

  function updateLoginButtonState() {
    button.set("enabled", inputValid());
  }

  function inputValid() {
    return emailInput.get("text").length > 0 && passwordInput.get("text").length > 0;
  }

  return page;
};
