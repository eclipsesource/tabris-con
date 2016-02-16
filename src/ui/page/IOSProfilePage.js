var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var ProgressButton = require("../ProgressButton");
var loginService = require("../../loginService");

exports.create = function() {
  var page = tabris.create("Page", {title: "Profile", topLevel: false});

  var container = tabris.create("Composite", {
    width: sizes.PROFILE_AREA_WIDTH, centerX: 0, top: sizes.PROFILE_AREA_TOP_OFFSET
  }).appendTo(page);

  var fullNameTextView = tabris.create("TextView", {
    left: 0, top: "prev()", right: 0,
    font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
  }).appendTo(container);

  var mailTextView = tabris.create("TextView", {
    left: 0, top: ["prev()", sizes.MARGIN_SMALL], right: 0,
    font: fontToString({size: sizes.FONT_LARGE})
  }).appendTo(container);

  ProgressButton.create({
    id: "logoutButton", text: "Logout",
    top: ["prev()", sizes.MARGIN], centerX: 0,
    font: fontToString({weight: "bold", size: sizes.FONT_XXXLARGE})
  }).on("select", function() {
      this.set("progress", true);
      loginService.logout()
        .then(function() {
          page.trigger("logoutSuccess");
          page.close();
        })
        .catch(function() {
          this.set("progress", false);
          page.trigger("logoutFailure");
        });
    })
    .appendTo(container);

  page.on("change:data", function(page, data) {
    fullNameTextView.set("text", data.fullName);
    mailTextView.set("text", data.mail);
  });

  return page;
};
