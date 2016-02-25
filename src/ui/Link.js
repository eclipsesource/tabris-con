var colors = require("../../resources/colors");
var _ = require("lodash");

exports.create = function(configuration) {
  var link = tabris.create("Composite", _.extend({highlightOnTouch: true}, configuration));
  var textViewConfiguration = {
    left: 0, top: 0, right: 0,
    textColor: colors.LINK_COLOR
  };
  maybeSetTextViewProperty(textViewConfiguration, configuration, "font");
  maybeSetTextViewProperty(textViewConfiguration, configuration, "text");
  maybeSetTextViewProperty(textViewConfiguration, configuration, "alignment");
  maybeSetTextViewProperty(textViewConfiguration, configuration, "height");
  tabris.create("TextView", textViewConfiguration).appendTo(link);
  link.on("tap", function() {
    if (link.get("url")) {
      if (!window.open) {
        console.error("cordova-plugin-inappbrowser is not available in this Tabris.js client.");
        return;
      }
      window.open(link.get("url"), "_system");
    } else if (link.get("page")) {
      require("./page/"  + link.get("page")).create().open();
    }
  });
  return link;
};

function maybeSetTextViewProperty(textViewConfiguration, configuration, property) {
  if (configuration[property]) {
    textViewConfiguration[property] = configuration[property];
  }
}
