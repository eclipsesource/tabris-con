var fontToString = require("../helpers/fontToString");
var sizes = require("../resources/sizes");
var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var getImage = require("../helpers/getImage");
var addProgressTo = require("../helpers/addProgressTo");
var loginService = require("../helpers/loginService");
var LoginPage = require("../pages/LoginPage");

exports.create = function() {
  var pageListItem = createAccountListItem("Login", getImage.forDevicePlatform("account"));
  var textViewContainer = tabris.create("Composite", {
    left: [".drawerIconImageView", sizes.MARGIN_XLARGE], top: 0, right: 0, bottom: 0
  }).appendTo(pageListItem);
  addProgressTo(pageListItem);
  var emailTextView = tabris.create("TextView", {
    font: fontToString({weight: "bold", size: sizes.FONT_SMALL}),
    textColor: "white",
    left: 0, top: sizes.MARGIN_SMALL
  }).appendTo(textViewContainer);
  var logoutTextView = tabris.create("TextView", {
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
    textColor: "white",
    text: "Logout",
    left: 0, bottom: sizes.MARGIN_SMALL
  }).appendTo(textViewContainer);
  var loginTextView = tabris.create("TextView", {
    font: fontToString({weight: "bold", size: sizes.FONT_LARGE}),
    text: "Login",
    textColor: "white",
    left: 0, centerY: 0
  }).appendTo(textViewContainer);
  pageListItem.on("tap", function() {
    if (this.get("loggedIn")) {
      pageListItem.set("progress", true);
      loginService.logout().then(function() {
        pageListItem.set("progress", false);
        pageListItem.set("loggedIn", false);
      });
    } else {
      var loginPage = LoginPage.create().open();
      loginPage.on("loginSuccess", function() {pageListItem.set("loggedIn", true);});
    }
  });
  pageListItem.on("change:loggedIn", function(widget, loggedIn) {
      if (loggedIn) {
        emailTextView.set({text: loginService.getUserData().mail});
      }
      emailTextView.set("visible", loggedIn);
      logoutTextView.set("visible", loggedIn);
      loginTextView.set("visible", !loggedIn);
    })
    .set("loggedIn", loginService.isLoggedIn());
  return pageListItem;
};

function createAccountListItem(text, image) {
  var listItem = tabris.create("Composite", {
    left: 0, top: "prev()", right: 0, height: sizes.DRAWER_LIST_ITEM_HEIGHT,
    highlightOnTouch: true,
    progress: false
  });
  var drawerIconImageView = tabris.create("ImageView", {
    class: "drawerIconImageView", image: image,
    centerY: 0
  }).appendTo(listItem);
  applyPlatformStyle(drawerIconImageView);
  return listItem;
}
