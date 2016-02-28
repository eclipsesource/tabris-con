var colors = require("../resources/colors");
var sizes = require("../resources/sizes");
var fontToString = require("../helpers/fontToString");
var LoginPage = require("../pages/LoginPage");
var getImage = require("../helpers/getImage");
var loginService = require("../helpers/loginService");

exports.create = function() {
  var userArea = tabris.create("Composite", {
    id: "androidDrawerUserArea",
    layoutData: {left: 0, top: 0, right: 0, height: sizes.DRAWER_USER_AREA_LOGGED_IN_HEIGHT},
    background: colors.BACKGROUND_COLOR
  });

  var loggedOutContainer = tabris.create("Composite", {
    highlightOnTouch: true,
    left: sizes.MARGIN_LARGE, bottom: 0, right: sizes.MARGIN_LARGE, height: sizes.DRAWER_USER_AREA_NOT_LOGGED_IN_HEIGHT
  }).on("tap", function() {
    var loginPage = LoginPage.create().open();
    loginPage.on("loginSuccess", function() {userArea.set("loggedIn", true);});
  }).appendTo(userArea);
  var accountImage = tabris.create("ImageView", {
    left: sizes.MARGIN_XSMALL, centerY: 0,
    image: getImage.forDevicePlatform("account")
  }).appendTo(loggedOutContainer);
  tabris.create("TextView", {
    text: "LOGIN",
    textColor: "white",
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
    left: [accountImage, sizes.MARGIN_LARGE], centerY: 0
  }).appendTo(loggedOutContainer);

  var loggedInContainer = tabris.create("Composite", {
    left: 0, top: 0, right: 0, bottom: 0
  }).on("tap", function() {
    userArea.trigger("loggedInTap", userArea);
  }).appendTo(userArea);
  tabris.create("ImageView", {
    image: getImage.forDevicePlatform("drawer_background"),
    left: 0, top: 0, right: 0, bottom: 0,
    scaleMode: "fill"
  }).appendTo(loggedInContainer);
  var userTextContainer = tabris.create("Composite", {
    left: sizes.MARGIN_LARGE,
    bottom: 0,
    right: sizes.MARGIN_LARGE,
    height: sizes.DRAWER_USER_TEXT_CONTAINER_HEIGHT
  }).appendTo(loggedInContainer);
  var fullNameTextView = tabris.create("TextView", {
    top: sizes.MARGIN,
    textColor: "white",
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
  }).appendTo(userTextContainer);
  var mailTextView = tabris.create("TextView", {
    bottom: sizes.MARGIN,
    text: "jsmith@me.com",
    textColor: "white",
    font: fontToString({size: sizes.FONT_MEDIUM})
  }).appendTo(userTextContainer);
  tabris.create("ImageView", {
    id: "menuArrowImageView",
    image: getImage.forDevicePlatform("menu_down"),
    layoutData: {centerY: 0, right: 0}
  }).appendTo(userTextContainer);

  userArea
    .on("change:loggedIn", function(widget, loggedIn) {
      userArea.set("height",
        loggedIn ? sizes.DRAWER_USER_AREA_LOGGED_IN_HEIGHT : sizes.DRAWER_USER_AREA_NOT_LOGGED_IN_HEIGHT);
      fullNameTextView.set("text", loginService.getUserData().fullName);
      mailTextView.set("text", loginService.getUserData().mail);
      loggedInContainer.set("visible", loggedIn);
      loggedOutContainer.set("visible", !loggedIn);
    })
    .set("loggedIn", loginService.isLoggedIn());

  return userArea;
};
