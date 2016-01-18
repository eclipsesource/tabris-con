var colors = require("../../resources/colors.json");

var SMALL_MARGIN = 4;
var BIG_MARGIN = 16;
var IMAGE_SIZE = 38;
var LEFT_CONTENT_MARGIN = BIG_MARGIN * 2 + IMAGE_SIZE;

var titleCompY = 0;

exports.create = function() {
  var page = tabris.create("Page", {
    topLevel: true,
    id: "sessionPage",
    title: "Aud'cuisine"
  }).once("resize", function() {
    tabris.ui.set("toolbarVisible", false);
  }).on("appear", function() {
    tabris.app.on("backnavigation", backnavigationHandler);
  }).on("disappear", function() {
    tabris.ui.set("toolbarVisible", true);
    tabris.app.off("backnavigation", backnavigationHandler);
  }).on("change:data", function(widget, data) {
    titleTextView.set("text", data.title);
    summaryTextView.set("text", data.summary);
    descriptionTextView.set("text", data.description);
    imageView.set("image", data.image);
    createSpeakers(data.speakers);
  });

  var scrollView = tabris.create("ScrollView", {
    left: 0, right: 0, top: 0, bottom: 0
  }).appendTo(page);

  var imageView = tabris.create("ImageView", {
    left: 0, top: 0, right: 0,
    scaleMode: "fill"
  }).appendTo(scrollView);

  var contentComposite = tabris.create("Composite", {
    left: 0, right: 0, top: "#titleComposite",
    background: "white"
  }).appendTo(scrollView);

  var titleComposite = tabris.create("Composite", {
    left: 0, right: 0,
    id: "titleComposite",
    background: colors.BACKGROUND_COLOR
  }).appendTo(scrollView);

  var backButton = tabris.create("ImageView", {
    left: BIG_MARGIN, top: BIG_MARGIN,
    image: {src: "resources/images/back_arrow.png", scale: 2},
    highlightOnTouch: true
  }).on("tap", function() {
    page.close();
  }).appendTo(titleComposite);

  tabris.create("ImageView", { // TODO: implement share
    right: BIG_MARGIN, top: BIG_MARGIN,
    image: {src: "resources/images/share.png", scale: 2},
    highlightOnTouch: true
  }).appendTo(titleComposite);

  var titleTextView = tabris.create("TextView", {
    left: LEFT_CONTENT_MARGIN, top: [backButton, BIG_MARGIN], right: BIG_MARGIN,
    font: "bold 18px",
    textColor: "white"
  }).appendTo(titleComposite);

  var summaryTextView = tabris.create("TextView", {
    left: LEFT_CONTENT_MARGIN, bottom: BIG_MARGIN, right: BIG_MARGIN, top: "prev()",
    text: "28 May 2015, 13:30 - 14:00 in Room 2",
    font: "16px",
    textColor: "white"
  }).appendTo(titleComposite);

  var descriptionTextView = tabris.create("TextView", {
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    left: LEFT_CONTENT_MARGIN, right: BIG_MARGIN, top: BIG_MARGIN
  }).appendTo(contentComposite);


  var speakersComposite = tabris.create("Composite", {
    left: 0, top: "prev()", right: 0
  }).appendTo(contentComposite);

  tabris.create("Composite", {left: 0, top: ["prev()", BIG_MARGIN], right: 0}).appendTo(contentComposite);

  function createSpeakers(speakers) {
    speakersComposite.children().dispose();
    if(speakers.length < 1) {
      return;
    }
    tabris.create("TextView", {
      left: LEFT_CONTENT_MARGIN, right: BIG_MARGIN, top: ["prev()", BIG_MARGIN * 2],
      text: "Speakers",
      font: "bold 14px",
      textColor: colors.ACCENTED_TEXT_COLOR
    }).appendTo(speakersComposite);
    speakers.forEach(function(speaker) {
      createSpeaker(speaker).appendTo(speakersComposite);
    });
  }

  function createSpeaker(speaker) {
    var speakerContainer = tabris.create("Composite", {
      left: 0, top: ["prev()", BIG_MARGIN], right: 0
    });
    tabris.create("ImageView", {
      left: BIG_MARGIN, top: SMALL_MARGIN, width: IMAGE_SIZE, height: IMAGE_SIZE,
      scaleMode: "fit",
      image: {src: speaker.image}
    }).appendTo(speakerContainer);
    tabris.create("TextView", {
      left: LEFT_CONTENT_MARGIN, top: 0, right: BIG_MARGIN,
      text: speaker.summary,
      font: "bold 14px",
      textColor: colors.DARK_SECONDARY_TEXT_COLOR
    }).appendTo(speakerContainer);
    tabris.create("TextView", {
      left: LEFT_CONTENT_MARGIN, top: ["prev()", 0], right: BIG_MARGIN,
      text: speaker.bio,
      font: "14px",
      textColor: colors.DARK_SECONDARY_TEXT_COLOR
    }).appendTo(speakerContainer);
    return speakerContainer;
  }

  scrollView.on("resize", function(widget, bounds) {
    var imageHeight = bounds.height / 3;
    imageView.set("height", imageHeight);
    titleCompY = Math.min(imageHeight, bounds.height / 3) - 1; // -1 to make up for rounding errors
    titleComposite.set("top", titleCompY);
  });

  scrollView.on("scroll", function(widget, offset) {
    imageView.set("transform", {translationY: Math.max(0, offset.y * 0.4)});
    titleComposite.set("transform", {translationY: Math.max(0, offset.y - titleCompY)});
  });

  return page;
};

function backnavigationHandler(app, options) {
  options.preventDefault = true;
  tabris.ui.find("#sessionPage").first().close();
}
