var colors = require("../../resources/colors");
var LoadingIndicator = require("../ui/LoadingIndicator");
var sizes = require("../../resources/sizes");
var fontToString = require("../fontToString");
var getImage = require("../getImage");

var titleCompY = 0;

exports.create = function() {
  var page = tabris.create("Page", {
    topLevel: false,
    id: "sessionPage"
  }).on("appear", function() {
    tabris.ui.set("toolbarVisible", false);
  }).on("disappear", function() {
    tabris.ui.set("toolbarVisible", true);
  }).on("change:data", function(widget, data) {
    setWidgetData(data);
    scrollView.on("resize", layoutParallax);
    layoutParallax();
    loadingIndicator.set("visible", false);
  });

  var scrollView = tabris.create("ScrollView", {
    left: 0, right: 0, top: 0, bottom: 0
  }).appendTo(page);

  var imageView = tabris.create("ImageView", {
    left: 0, top: 0, right: 0,
    background: colors.BACKGROUND_COLOR,
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
    left: 0, top: 0, width: sizes.SESSION_HEADER_ICON, height: sizes.SESSION_HEADER_ICON,
    image: getImage("back_arrow"),
    highlightOnTouch: true
  }).on("tap", function() {
    page.close();
  }).appendTo(titleComposite);

  tabris.create("ImageView", { // TODO: implement share
    right: 0, top: 0, width: sizes.SESSION_HEADER_ICON, height: sizes.SESSION_HEADER_ICON,
    image: getImage("share"),
    highlightOnTouch: true
  }).appendTo(titleComposite);

  var titleTextView = tabris.create("TextView", {
    left: sizes.LEFT_CONTENT_MARGIN, top: [backButton, sizes.MARGIN], right: sizes.MARGIN_BIG,
    font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
    textColor: "white"
  }).appendTo(titleComposite);

  var summaryTextView = tabris.create("TextView", {
    left: sizes.LEFT_CONTENT_MARGIN, bottom: sizes.MARGIN_BIG, right: sizes.MARGIN_BIG, top: "prev()",
    font: fontToString({size: sizes.FONT_LARGE}),
    textColor: "white"
  }).appendTo(titleComposite);

  var descriptionTextView = tabris.create("TextView", {
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    left: sizes.LEFT_CONTENT_MARGIN, right: sizes.MARGIN_BIG, top: sizes.MARGIN_BIG
  }).appendTo(contentComposite);


  var speakersComposite = tabris.create("Composite", {
    left: 0, top: "prev()", right: 0
  }).appendTo(contentComposite);

  tabris.create("Composite", {left: 0, top: ["prev()", sizes.MARGIN_BIG], right: 0}).appendTo(contentComposite);

  var loadingIndicator = LoadingIndicator.create({shade: true}).appendTo(page);

  function createSpeakers(speakers) {
    speakersComposite.children().dispose();
    if(speakers.length < 1) {
      return;
    }
    tabris.create("TextView", {
      left: sizes.LEFT_CONTENT_MARGIN, right: sizes.MARGIN_BIG, top: ["prev()", sizes.MARGIN_BIG * 2],
      text: "Speakers",
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: colors.ACCENTED_TEXT_COLOR
    }).appendTo(speakersComposite);
    speakers.forEach(function(speaker) {
      createSpeaker(speaker).appendTo(speakersComposite);
    });
  }

  function createSpeaker(speaker) {
    var speakerContainer = tabris.create("Composite", {
      left: 0, top: ["prev()", sizes.MARGIN_BIG], right: 0
    });
    tabris.create("ImageView", {
      layoutData: {
        left: sizes.MARGIN_BIG,
        top: sizes.MARGIN_SMALL,
        width: sizes.SESSION_SPEAKER_IMAGE,
        height: sizes.SESSION_SPEAKER_IMAGE
      },
      scaleMode: "fit",
      image: speaker.image
    }).appendTo(speakerContainer);
    tabris.create("TextView", {
      left: sizes.LEFT_CONTENT_MARGIN, top: 0, right: sizes.MARGIN_BIG,
      text: speaker.summary,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: colors.DARK_SECONDARY_TEXT_COLOR
    }).appendTo(speakerContainer);
    tabris.create("TextView", {
      left: sizes.LEFT_CONTENT_MARGIN, top: ["prev()", 0], right: sizes.MARGIN_BIG,
      text: speaker.bio,
      font: fontToString({size: sizes.FONT_MEDIUM}),
      textColor: colors.DARK_SECONDARY_TEXT_COLOR
    }).appendTo(speakerContainer);
    return speakerContainer;
  }

  function setWidgetData(data) {
    titleTextView.set("text", data.title);
    summaryTextView.set("text", data.summary);
    descriptionTextView.set("text", data.description);
    imageView.set("image", data.image);
    createSpeakers(data.speakers);
  }

  function layoutParallax(options) {
    var showImageView = imageView.get("image") || options && options.initialLayout;
    var imageHeight = showImageView ? scrollView.get("bounds").height / 3 : 0;
    imageView.set("height", imageHeight);
    titleCompY = Math.min(imageHeight, imageHeight) - 1; // -1 to make up for rounding errors
    titleComposite.set("top", titleCompY);
  }

  scrollView.on("scroll", function(widget, offset) {
    imageView.set("transform", {translationY: Math.max(0, offset.y * 0.4)});
    titleComposite.set("transform", {translationY: Math.max(0, offset.y - titleCompY)});
  });

  scrollView.once("resize", function() {
    layoutParallax({initialLayout: true});
  });

  return page;
};
