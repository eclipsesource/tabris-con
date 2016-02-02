var colors = require("../../resources/colors");
var sizes = require("../../resources/sizes");
var fontToString = require("../fontToString");

exports.create = function() {
  var timeout;

  var infoToast = tabris.create("Composite", {
    background: colors.INFO_TOAST_BACKGROUND_COLOR,
    left: 0, bottom: 0, right: 0, height: sizes.INFO_TOAST_HEIGHT,
    transform: {translationY: sizes.INFO_TOAST_HEIGHT}
  });

  function hideInfoToast() {
    if (!infoToast.isDisposed()) {
      infoToast.animate({
        transform: {translationY: infoToast.get("height")}
      }, {
        duration: 1000,
        easing: "ease-out"
      });
    }
  }

  var infoShadeTextView = tabris.create("TextView", {
    textColor: colors.LIGHT_PRIMARY_TEXT_COLOR,
    font: fontToString({size: sizes.FONT_MEDIUM}),
    markupEnabled: true,
    left: sizes.MARGIN_BIG, right: ["#actionTextView", sizes.MARGIN], centerY: 0
  }).appendTo(infoToast);

  var actionTextView = tabris.create("TextView", {
    highlightOnTouch: true,
    textColor: colors.INFO_TOAST_ACTION_COLOR,
    font: fontToString({size: sizes.FONT_MEDIUM}),
    right: sizes.MARGIN_BIG, centerY: 0, height: sizes.INFO_TOAST_HEIGHT
  }).on("tap", function() {infoToast.trigger("actionTap", infoToast);})
    .appendTo(infoToast);

  infoToast.show = function(toastObject) {
    infoToast.set("toastType", toastObject.type);
    infoShadeTextView.set("text", toastObject.messageText);
    actionTextView.set("text", toastObject.actionText);
    if (infoToast.get("transform").translationY > 0) {
      infoToast.animate({transform: {translationY: 0}}, {
        duration: 1000,
        easing: "ease-out"
      });
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(hideInfoToast, 3000);
  };

  return infoToast;
};