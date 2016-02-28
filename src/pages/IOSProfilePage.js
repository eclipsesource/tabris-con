var sizes = require("../resources/sizes");
var fontToString = require("../helpers/fontToString");
var ProgressButton = require("../components/ProgressButton");
var loginService = require("../helpers/loginService");

exports.create = function() {
  var page = tabris.create("Page", {id: "iOSProfilePage", title: "Profile", topLevel: false});

  var container = tabris.create("Composite", {
    width: sizes.PAGE_CONTAINER_WIDTH, centerX: 0, top: sizes.PROFILE_AREA_TOP_OFFSET
  }).appendTo(page);

  var fullNameTextView = tabris.create("TextView", {
    left: 0, top: "prev()", right: 0,
    font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
  }).appendTo(container);

  var mailTextView = tabris.create("TextView", {
    left: 0, top: ["prev()", sizes.MARGIN_SMALL], right: 0,
    font: fontToString({size: sizes.FONT_LARGE})
  }).appendTo(container);

  var progressButton = ProgressButton.create({
    id: "logoutButton", text: "Logout",
    top: ["prev()", sizes.MARGIN], centerX: 0,
    font: fontToString({weight: "bold", size: sizes.FONT_XXXLARGE})
  }).on("select", function(progressButton) {
      progressButton.set("progress", true);
      loginService.logout();
    })
    .appendTo(container);

  page.on("change:data", function(page, data) {
    fullNameTextView.set("text", data.fullName);
    mailTextView.set("text", data.mail);
  });

  page.on("logoutSuccess", function() {
    page.close();
  });

  page.on("logoutFailure", function() {
    progressButton.set("progress", false);
  });

  return page;
};
