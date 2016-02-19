var getImage = require("../../getImage");
var sizes = require("../../../resources/sizes");

exports.create = function() {
  var feedbackThumbs = tabris.create("Composite", {
    top: ["prev()", sizes.MARGIN_LARGE], centerX: 0,
    feedback: "0"
  });
  var thumbUp = tabris.create("ImageView", {
    id: "thumbUp",
    left: 0, top: 0, width: sizes.FEEDBACK_THUMB_SIZE,
    highlightOnTouch: true,
    image: getImage.forDevicePlatform("feedback_thumb_up"),
    selection: false
  }).appendTo(feedbackThumbs);
  addThumbButtonListeners(feedbackThumbs, thumbUp);
  var thumbDown = tabris.create("ImageView", {
    id: "thumbDown",
    left: [thumbUp, sizes.MARGIN_LARGE], top: 0, width: sizes.FEEDBACK_THUMB_SIZE,
    highlightOnTouch: true,
    image: getImage.forDevicePlatform("feedback_thumb_down"),
    selection: false
  }).appendTo(feedbackThumbs);
  addThumbButtonListeners(feedbackThumbs, thumbDown);
  return feedbackThumbs;
};

function addThumbButtonListeners(thumbs, thumb) {
  thumb
    .on("tap", function() {
      this.set("selection", true);
      this.trigger("select", this);
      thumbs.set("selection", thumbs);
    })
    .on("select", deselectSiblings)
    .on("change:selection", function(widget, selection) {
      var buttonId = this.get("id");
      var selectedPart = selection ? "_selected" : "";
      this.set("image",
        getImage.forDevicePlatform("feedback_thumb_" + buttonId.toLowerCase().replace("thumb", "") + selectedPart));
      if (selection) {
        thumbs.set("feedback", thumb.get("id") === "thumbUp" ? "+1" : "-1");
      }
    });
}

function deselectSiblings(widget) {
  var stepper = widget.parent();
  var sibling = stepper.children().filter(function(child) {
    return child.get("id") !== widget.get("id");
  }).first();
  sibling.set("selection", false);
}
