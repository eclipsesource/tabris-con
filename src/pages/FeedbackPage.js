import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";
import Button from "../components/TabrisConButton";
import FeedbackThumbs from "../components/FeedbackThumbs";
import addProgressTo from "../helpers/addProgressTo";
import {Page, Composite, TextView, TextInput} from "tabris";

export default class extends Page {
  constructor(adaptedSession, feedbackService) {
    super({title: "Feedback", topLevel: false});

    let container = new Composite({
      centerX: 0, centerY: 0, width: sizes.PAGE_CONTAINER_WIDTH
    }).appendTo(this);

    new TextView({
      alignment: "center",
      text: "Did you enjoy this session?",
      font: fontToString({size: sizes.FONT_XXLARGE})
    }).appendTo(container);

    let feedbackThumbs = new FeedbackThumbs().appendTo(container);

    let commentTextInput = new TextInput({
      message: "Comment...",
      left: 0, right: 0, top: ["prev()", sizes.MARGIN_LARGE]
    }).appendTo(container);

    let button = new Button({
      right: 0, top: ["prev()", sizes.MARGIN],
      text: "Submit"
    }).appendTo(container);

    addProgressTo(button);

    button.on("select", () => {
      button.set("progress", true);
      feedbackService.createEvaluation(
        adaptedSession.id, adaptedSession.nid, commentTextInput.get("text"), feedbackThumbs.get("feedback")
      ).then(() => this.close())
       .catch(() => button.set("progress", false));
    });
  }
}
