var colors = require("../../../resources/colors");
var LoadingIndicator = require("../LoadingIndicator");
var InfoToast = require("../InfoToast");
var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var SessionPageHeader = require("../SessionPageHeader");
var getImage = require("../../getImage");
var applyPlatformStyle = require("../applyPlatformStyle");
var attendedBlockService = require("../../attendedBlockService");
var AttendanceAction = require("../AttendanceAction");

var titleCompY = 0;

exports.create = function() {
  var page = tabris.create("Page", {
    topLevel: false,
    id: "sessionPage",
    title: "Session"
  }).on("appear", function() {
    if (device.platform === "iOS") {
      AttendanceAction.create().on("select", function() {
        updateAttendance(this, this.get("attending"));
      });
    }
  }).on("disappear", function() {
    tabris.ui.find("#attendanceAction").dispose();
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
    id: "sessionPageDescriptionTextView",
    left: sizes.LEFT_CONTENT_MARGIN, right: sizes.MARGIN_LARGE
  }).appendTo(contentComposite);
  applyPlatformStyle(descriptionTextView);

  var speakersComposite = tabris.create("Composite", {
    left: 0, top: "prev()", right: 0
  }).appendTo(contentComposite);

  tabris.create("Composite", {left: 0, top: ["prev()", sizes.MARGIN_LARGE], right: 0}).appendTo(contentComposite);

  var loadingIndicator = LoadingIndicator.create({shade: true}).appendTo(page);

  function createSpeakers(speakers) {
    speakersComposite.children().dispose();
    if (speakers.length < 1) {
      return;
    }
    var speakersTextView = tabris.create("TextView", {
      id: "sessionPageSpeakersTextView",
      right: sizes.MARGIN_LARGE, top: ["prev()", sizes.MARGIN_LARGE * 2],
      text: "Speakers",
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: colors.ACCENTED_TEXT_COLOR
    }).appendTo(speakersComposite);
    applyPlatformStyle(speakersTextView);

    speakers.forEach(function(speaker) {
      createSpeaker(speaker).appendTo(speakersComposite);
    });
  }

  function createSpeaker(speaker) {
    var speakerContainer = tabris.create("Composite", {
      left: 0, top: ["prev()", sizes.MARGIN_LARGE], right: 0
    });
    tabris.create("ImageView", {
      layoutData: {
        left: sizes.MARGIN_LARGE,
        top: sizes.MARGIN_SMALL,
        width: sizes.SESSION_SPEAKER_IMAGE,
        height: sizes.SESSION_SPEAKER_IMAGE
      },
      scaleMode: "fit",
      image: getImage.common(speaker.image, sizes.SESSION_SPEAKER_IMAGE, sizes.SESSION_SPEAKER_IMAGE)
    }).appendTo(speakerContainer);
    var speakerSummary = tabris.create("TextView", {
      id: "sessionPageSpeakerSummary",
      left: sizes.LEFT_CONTENT_MARGIN, top: 0, right: sizes.MARGIN_LARGE,
      text: speaker.summary,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
    }).appendTo(speakerContainer);
    applyPlatformStyle(speakerSummary);
    var speakerBio = tabris.create("TextView", {
      id: "sessionPageSpeakerBio",
      left: sizes.LEFT_CONTENT_MARGIN, top: "prev()", right: sizes.MARGIN_LARGE,
      text: speaker.bio,
      font: fontToString({size: sizes.FONT_MEDIUM})
    }).appendTo(speakerContainer);
    applyPlatformStyle(speakerBio);
    return speakerContainer;
  }

  function setWidgetData(data) {
    var scrollViewBounds = scrollView.get("bounds");
    sessionPageHeader.set("titleText", data.title);
    sessionPageHeader.set("summaryText", data.summary);
    descriptionTextView.set("text", data.description);
    imageView.set("image", getImage.common(data.image, scrollViewBounds.width, scrollViewBounds.height / 3));
    createSpeakers(data.speakers);
  }

  function layoutParallax(options) {
    var showImageView = imageView.get("image") || options && options.initialLayout;
    var imageHeight = showImageView ? scrollView.get("bounds").height / 3 : 0;
    imageView.set("height", imageHeight);
    titleCompY = Math.min(imageHeight, imageHeight) - 1; // -1 to make up for rounding errors
    sessionPageHeader.set("top", titleCompY);
  }

  if (device.platform === "Android") {
    scrollView.on("scroll", function(widget, offset) {
      imageView.set("transform", {translationY: Math.max(0, offset.y * 0.4)});
      sessionPageHeader.set("transform", {translationY: Math.max(0, offset.y - titleCompY)});
    });
  }

  scrollView.once("resize", function() {
    layoutParallax({initialLayout: true});
  });

  var infoToast = InfoToast.create().appendTo(page);

  sessionPageHeader
    .on("backButtonTap", function() {
      page.close();
    })
    .on("attendanceButtonTap", updateAttendance);

  function updateAttendance(widget, wasChecked) {
    var checked = !wasChecked;
    var session = page.get("data");
    if (session) {
      if (checked) {
        attendedBlockService.addAttendedBlockId(session.id);
      } else {
        attendedBlockService.removeAttendedBlockId(session.id);
      }
      widget.set("attending", checked);
      tabris.ui.find("#schedule").set("focus", checked ? session.id : null);
      infoToast.show({
        type: "myScheduleOperation",
        messageText: checked ? "Session added." : "Session removed.",
        actionText: "SHOW \"MY SCHEDULE\""
      });
      infoToast.on("actionTap", function() {
        if (!this.isDisposed()) {
          if (this.get("toastType") === "myScheduleOperation") {
            tabris.ui.find("#schedule").last().open();
          }
        }
      });
    }
  }

  if (device.platform !== "iOS") {
    page.on("appear", function() {
      tabris.ui.set("toolbarVisible", false);
    }).on("disappear", function() {
      tabris.ui.set("toolbarVisible", true);
    });
  }

  page.on("change:data", function(widget, data) {
    setWidgetData(data);
    scrollView.on("resize", layoutParallax);
    layoutParallax();
    var attendanceControl = device.platform === "Android" ? sessionPageHeader : tabris.ui.find("#attendanceAction");
    attendanceControl.set("attending", attendedBlockService.isAttending(data.id));
    loadingIndicator.dispose();
  });

  return page;
};
