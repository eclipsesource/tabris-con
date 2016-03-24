var colors = require("../resources/colors");
var sizes = require("../resources/sizes");
var fontToString = require("../helpers/fontToString");

exports.create = function() {
  var POP_ANIMATION_DURATION = 500;
  var POP_HIDE_DELAY = 5000;
  var timeout;

  var infoToast = new tabris.Composite({
    background: colors.INFO_TOAST_BACKGROUND_COLOR,
    left: 0, bottom: 0, right: 0, height: sizes.INFO_TOAST_HEIGHT,
    transform: {translationY: sizes.INFO_TOAST_HEIGHT}
  });

  function hideInfoToast() {
    if (!infoToast.isDisposed()) {
      infoToast.animate({
        transform: {translationY: infoToast.get("height")}
      }, {
        duration: POP_ANIMATION_DURATION,
        easing: "ease-out"
      });
    }
  }

  var infoShadeTextView = new tabris.TextView({
    textColor: colors.LIGHT_PRIMARY_TEXT_COLOR,
    font: fontToString({size: sizes.FONT_MEDIUM}),
    markupEnabled: true,
    left: sizes.MARGIN_LARGE, right: ["#actionTextView", sizes.MARGIN], centerY: 0
  }).appendTo(infoToast);

  var actionTextView = new tabris.TextView({
    highlightOnTouch: true,
    textColor: colors.ACTION_COLOR,
    font: fontToString({size: sizes.FONT_MEDIUM}),
    right: sizes.MARGIN_LARGE, centerY: 0, height: sizes.INFO_TOAST_HEIGHT
  }).on("tap", function() {infoToast.trigger("actionTap", infoToast);})
    .appendTo(infoToast);

  infoToast.show = function(toastObject) {
    infoToast.set({toastType: toastObject.type});
    infoShadeTextView.set("text", toastObject.messageText);
    actionTextView.set("text", toastObject.actionText);
    if (infoToast.get("transform").translationY > 0) {
      infoToast.animate({transform: {translationY: 0}}, {
        duration: POP_ANIMATION_DURATION,
        easing: "ease-out"
      });
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(hideInfoToast, POP_HIDE_DELAY);
  };

  return infoToast;
};
