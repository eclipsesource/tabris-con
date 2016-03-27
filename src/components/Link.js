/*jshint nonew: false*/
import colors from "../resources/colors";
import {Composite, TextView} from "tabris";

export default class extends Composite {
  constructor(configuration) {
    super(Object.assign({}, {highlightOnTouch: true}, configuration));
    let textViewConfiguration = {
      left: 0, top: 0, right: 0,
      textColor: colors.LINK_COLOR
    };
    maybeSetTextViewProperty(textViewConfiguration, configuration, "font");
    maybeSetTextViewProperty(textViewConfiguration, configuration, "text");
    maybeSetTextViewProperty(textViewConfiguration, configuration, "alignment");
    maybeSetTextViewProperty(textViewConfiguration, configuration, "height");
    new TextView(textViewConfiguration).appendTo(this);
    this.on("tap", () => {
      if (this.get("url")) {
        if (!window.open) {
          console.error("cordova-plugin-inappbrowser is not available in this Tabris.js client.");
          return;
        }
        window.open(this.get("url"), "_system");
      } else if (this.get("page")) {
        new (this.get("page"))().open();
      }
    });
  }
}

function maybeSetTextViewProperty(textViewConfiguration, configuration, property) {
  if (configuration[property]) {
    textViewConfiguration[property] = configuration[property];
  }
}
