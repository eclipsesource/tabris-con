var colors = require("../../resources/colors.json");
var sizes = require("../../resources/sizes.json");

var create = {
  Android: function() {
    return tabris.create("Composite"); // stub
  },
  iOS:function(options) {
    var animating = true;
    var loadingIndicator = tabris.create("Composite", {
      left: 0, top: 0, right: 0, bottom: 0,
      background: options && options.shade ? "white" : "transparent"
    }).on("change:visible", function(widget, visible) {
      animating = visible;
      if(visible) {
        startAnimation();
      }
    });

    var canvas = tabris.create("Canvas", {
      centerX: 0,
      centerY: 0,
      width: sizes.LOADING_INDICATOR,
      height: sizes.LOADING_INDICATOR
    }).on("resize", function(widget, bounds) {
      var ctx = canvas.getContext("2d", bounds.width, bounds.height);
      ctx.moveTo(0, 0);
      ctx.beginPath();
      ctx.lineWidth = sizes.LOADING_INDICATOR_LINE_WIDTH;
      ctx.strokeStyle = colors.BACKGROUND_COLOR;
      ctx.arc(
        sizes.LOADING_INDICATOR / 2,
        sizes.LOADING_INDICATOR / 2,
        sizes.LOADING_INDICATOR / 2 - sizes.LOADING_INDICATOR_LINE_WIDTH * 2,
        0,
        Math.PI
      );
      ctx.stroke();
    }).appendTo(loadingIndicator);

    function startAnimation() {
      canvas.animate({
        transform: {rotation: 179 * Math.PI / 180}
      }, {duration: 1000, easing: "linear", name: "firstAnimation"});
    }

    canvas.on("animationend", function(widget, options) {
      if(options.name === "firstAnimation") { // TODO: workaround for tabris-ios#832
        canvas.animate({
          transform: {rotation: 359 * Math.PI / 180}
        }, {duration: 1000, easing: "linear", name: "secondAnimation"});
      }
      if(options.name === "secondAnimation") {
        canvas.set("transform", null);
        if (animating) {
          startAnimation();
        }
      }
    });

    startAnimation();

    return loadingIndicator;
  }
};

exports.create = function(options) {
  if(["Android", "iOS"].indexOf(device.platform) > -1) {
    return create[device.platform](options);
  }
  return tabris.create("Composite"); // not implemented for this platform
};
