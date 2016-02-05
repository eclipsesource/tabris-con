var colors = require("../../resources/colors");
var sizes = require("../../resources/sizes");
var fontToString = require("../fontToString");
var LoginPage = require("./page/LoginPage");
var getImage = require("../getImage");

exports.create = function() {
  var userArea = tabris.create("Composite", {
    id: "userArea",
    layoutData: {left: 0, top: 0, right: 0, height: sizes.DRAWER_USER_AREA_LOGGED_IN_HEIGHT},
    background: colors.BACKGROUND_COLOR
  });

  var loggedOutContainer = tabris.create("Composite", {
    highlightOnTouch: true,
    left: sizes.MARGIN_BIG, bottom: 0, right: sizes.MARGIN_BIG, height: sizes.DRAWER_USER_AREA_NOT_LOGGED_IN_HEIGHT
  }).on("tap", function() {
    var loginPage = LoginPage.create().open();
    loginPage.on("loginButtonTapped", function() {
      userArea.set("loggedIn", true);
    });
    userArea.trigger("loginPageOpened", userArea);
  }).appendTo(userArea);
  var accountImage = tabris.create("ImageView", {
    left: sizes.MARGIN_XSMALL, centerY: 0,
    image: getImage("account")
  }).appendTo(loggedOutContainer);
  tabris.create("TextView", {
    text: "LOGIN",
    textColor: "white",
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
    left: [accountImage, sizes.MARGIN_BIG], centerY: 0
  }).appendTo(loggedOutContainer);

  var loggedInContainer = tabris.create("Composite", {
    left: 0, top: 0, right: 0, bottom: 0
  }).on("tap", function() {
    userArea.trigger("loggedInTap", userArea);
  }).appendTo(userArea);
  tabris.create("ImageView", {
    image: getImage("drawer_background"),
    left: 0, top: 0, right: 0, bottom: 0,
    scaleMode: "fill"
  }).appendTo(loggedInContainer);
  var userTextContainer = tabris.create("Composite", {
    left: sizes.MARGIN_BIG,
    bottom: 0,
    right: sizes.MARGIN_BIG,
    height: sizes.DRAWER_USER_TEXT_CONTAINER_HEIGHT
  }).appendTo(loggedInContainer);
  tabris.create("TextView", {
    top: sizes.MARGIN,
    text: "John Smith",
    textColor: "white",
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
  }).appendTo(userTextContainer);
  tabris.create("TextView", {
    bottom: sizes.MARGIN,
    text: "jsmith@me.com",
    textColor: "white",
    font: fontToString({size: sizes.FONT_MEDIUM})
  }).appendTo(userTextContainer);
  tabris.create("ImageView", {
    id: "menuArrowImageView",
    image: getImage("menu_down"),
    layoutData: {centerY: 0, right: 0}
  }).appendTo(userTextContainer);

  userArea
    .on("change:loggedIn", function(widget, loggedIn) {
      userArea.set("height",
        loggedIn ? sizes.DRAWER_USER_AREA_LOGGED_IN_HEIGHT : sizes.DRAWER_USER_AREA_NOT_LOGGED_IN_HEIGHT);
      loggedInContainer.set("visible", loggedIn);
      loggedOutContainer.set("visible", !loggedIn);
    })
    .set("loggedIn", false);

  return userArea;
};
