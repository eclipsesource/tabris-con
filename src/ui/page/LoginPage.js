var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var applyPlatformStyle = require("../applyPlatformStyle");
var Input = require("../Input");
var Button = require("../Button");

exports.create = function() {
  var page = tabris.create("Page", {
    topLevel: false,
    id: "loginPage"
  }).on("appear", function() {
    tabris.ui.find("#loginAction").set("visible", false);
  }).on("disappear", function() {
    tabris.ui.find("#loginAction").set("visible", true);
  });

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
    left: sizes.MARGIN_BIG, bottom: sizes.MARGIN_BIG, right: sizes.MARGIN_BIG
  }).appendTo(header);

  applyPlatformStyle(loginTextView);

  var inputContainer = tabris.create("Composite", {
    id: "inputContainer",
    width: sizes.LOGIN_INPUT_WIDTH, centerX: 0, top: [header, sizes.MARGIN_BIG]
  }).appendTo(scrollView);

  var emailInput = Input.create({
    left: 0, right: 0,
    message: "eclipse.org e-mail address"
  }).appendTo(inputContainer);

  Input.create({
    type: "password",
    left: 0, right: 0,
    top: [emailInput, sizes.MARGIN],
    message: "password"
  }).appendTo(inputContainer);

  Button.create({id: "loginButton", text: "Login"})
    .on("tap", function() {
      page.trigger("loginButtonTapped");
      page.close();
    })
    .appendTo(inputContainer);

  return page;
};
