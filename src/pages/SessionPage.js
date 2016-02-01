var colors = require("../../resources/colors");
var LoadingIndicator = require("../ui/LoadingIndicator");
var InfoToast = require("../ui/InfoToast");
var sizes = require("../../resources/sizes");
var fontToString = require("../fontToString");
var SessionPageHeader = require("../ui/SessionPageHeader");
var getImage = require("../getImage");
var attendedBlockService = require("../attendedBlockService");

var titleCompY = 0;

exports.create = function() {
  var page = tabris.create("Page", {
    topLevel: false,
    id: "sessionPage"
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
    left: 0, right: 0, top: "#sessionPageHeader",
    background: "white"
  }).appendTo(scrollView);

  var sessionPageHeader = SessionPageHeader.create().appendTo(scrollView);

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
    if (speakers.length < 1) {
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
      image: getImage(speaker.image, sizes.SESSION_SPEAKER_IMAGE, sizes.SESSION_SPEAKER_IMAGE)
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
    var scrollViewBounds = scrollView.get("bounds");
    sessionPageHeader.set("titleText", data.title);
    sessionPageHeader.set("summaryText", data.summary);
    descriptionTextView.set("text", data.description);
    imageView.set("image", getImage(data.image, scrollViewBounds.width, scrollViewBounds.height / 3));
    createSpeakers(data.speakers);
  }

  function layoutParallax(options) {
    var showImageView = imageView.get("image") || options && options.initialLayout;
    var imageHeight = showImageView ? scrollView.get("bounds").height / 3 : 0;
    imageView.set("height", imageHeight);
    titleCompY = Math.min(imageHeight, imageHeight) - 1; // -1 to make up for rounding errors
    sessionPageHeader.set("top", titleCompY);
  }

  scrollView.on("scroll", function(widget, offset) {
    imageView.set("transform", {translationY: Math.max(0, offset.y * 0.4)});
    sessionPageHeader.set("transform", {translationY: Math.max(0, offset.y - titleCompY)});
  });

  scrollView.once("resize", function() {
    layoutParallax({initialLayout: true});
  });

  var infoToast = InfoToast.create().appendTo(page);

  sessionPageHeader
    .on("backButtonTap", function() {
      page.close();
    })
    .on("addTap", function(widget, checked) {
      if (page.get("data")) {
        var attendedBlockId = page.get("data").id;
        if (checked) {
          attendedBlockService.removeAttendedBlockId(attendedBlockId);
        } else {
          attendedBlockService.addAttendedBlockId(attendedBlockId);
        }
        sessionPageHeader.set("attending", !checked);
        infoToast.show({
          type: "myScheduleOperation",
          message: !checked ? "Session added to <b>\"My Schedule\"</b>." :
            "Session removed from <b>\"My Schedule\"</b>."
        });
      }
    });

  page.on("appear", function() {
    tabris.ui.set("toolbarVisible", false);
  }).on("disappear", function() {
    tabris.ui.set("toolbarVisible", true);
  }).on("change:data", function(widget, data) {
    setWidgetData(data);
    scrollView.on("resize", layoutParallax);
    layoutParallax();
    sessionPageHeader.set("attending", attendedBlockService.isAttending(data.id));
    loadingIndicator.dispose();
  });

  return page;
};
