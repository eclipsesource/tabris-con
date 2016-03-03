var colors = require("../resources/colors");
var LoadingIndicator = require("../components/LoadingIndicator");
var InfoToast = require("../components/InfoToast");
var sizes = require("../resources/sizes");
var fontToString = require("../helpers/fontToString");
var SessionPageHeader = require("../components/SessionPageHeader");
var TimezonedDate = require("../TimezonedDate");
var getImage = require("../helpers/getImage");
var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var attendedSessionService = require("../helpers/attendedSessionService");
var viewDataAdapter = require("../viewDataAdapter");
var getSessionsInTimeframe = require("../getSessionsInTimeframe");
var AttendanceAction = require("../actions/AttendanceAction");
var SessionPageFeedbackWidget = require("../components/SessionPageFeedbackWidget");
var Link = require("../components/Link");
var getSessionFreeBlock = require("../getSessionFreeBlock");
var SessionsPage = require("./SessionsPage");
var config = require("../../config");
var _ = require("lodash");

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
    right: sizes.MARGIN_LARGE
  }).appendTo(contentComposite);
  applyPlatformStyle(descriptionTextView);

  var speakersComposite = tabris.create("Composite", {
    id: "speakersComposite",
    left: 0, top: "prev()", right: 0
  }).appendTo(contentComposite);

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
      image: getImage.common(getSpeakerImage(speaker), sizes.SESSION_SPEAKER_IMAGE, sizes.SESSION_SPEAKER_IMAGE)
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

  function getSpeakerImage(speaker) {
    return hasConnection() ? speaker.image : "speaker_avatar";
  }

  function hasConnection() {
    if (!navigator.connection) {
      console.warn("cordova-plugin-network-information is not available in this Tabris.js client. Trying to download" +
      " speaker image.");
      return true;
    }
    return navigator.connection.type !== window.Connection.NONE;
  }

  function setWidgetData(data) {
    var scrollViewBounds = scrollView.get("bounds");
    sessionPageHeader.set("titleText", data.title);
    sessionPageHeader.set("summaryText", data.summary);
    descriptionTextView.set("text", data.description);
    imageView.set("image", getImage.common(data.image, scrollViewBounds.width, scrollViewBounds.height / 3));
    sessionPageHeader.set("trackIndicatorColor", config.TRACK_COLOR[data.categoryName]);
    SessionPageFeedbackWidget.create(contentComposite, data);
    createSpeakers(data.speakers);
    maybeCreateOtherSessionsLink(data);
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
        attendedSessionService.addAttendedSessionId(session.id);
      } else {
        attendedSessionService.removeAttendedSessionId(session.id);
      }
      widget.set("attending", checked);
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

  function maybeCreateOtherSessionsLink(session) {
    var freeBlock = getSessionFreeBlock(session);
    if (freeBlock) {
      var date1 = new TimezonedDate(freeBlock[0]);
      var date2 = new TimezonedDate(freeBlock[1]);
      getSessionsInTimeframe(date1.toJSON(), date2.toJSON())
        .then(function(sessions) {
          var otherSessions = _.filter(sessions, function(value) {return value.id !== session.id;});
          if (otherSessions.length > 0) {
            createOtherSessionsLink()
              .on("tap", function() {
                var sessionsPage = SessionsPage.create().open();
                var adaptedSessions = viewDataAdapter.adaptCategory({sessions: otherSessions});
                var from = date1.format("HH:mm");
                var to = date2.format("HH:mm");
                sessionsPage.set("data", {title: from + " - " + to, items: adaptedSessions});
              })
              .appendTo(contentComposite);
            createSpacer("prev()").appendTo(contentComposite);
          } else {
            createSpacer("#speakersComposite").appendTo(contentComposite);
          }
        });
    }
  }

  function createOtherSessionsLink() {
    return Link.create({
      left: sizes.LEFT_CONTENT_MARGIN,
      top: ["#speakersComposite", sizes.MARGIN_LARGE],
      height: sizes.SESSION_PAGE_OTHER_SESSIONS_LINK_HEIGHT,
      text: "Other sessions at the same time"
    });
  }

  function createSpacer(prev) {
    return tabris.create("Composite", {
      left: 0, top: prev, right: 0, height: sizes.SESSION_PAGE_SPACER_HEIGHT
    });
  }

  if (device.platform !== "iOS") {
    page.on("appear", function() {
      tabris.ui.set("toolbarVisible", false);
    }).on("disappear", function() {
      tabris.ui.set("toolbarVisible", true);
    });
  }

  page.on("appear", function() {
    var feedbackWidget = page.find("#sessionPageFeedbackWidget").first();
    if (feedbackWidget) {
      feedbackWidget.refresh();
    }
  });

  page.on("change:data", function(widget, data) {
    setWidgetData(data);
    scrollView.on("resize", layoutParallax);
    layoutParallax();
    var attendanceControl = device.platform === "iOS" ? tabris.ui.find("#attendanceAction") : sessionPageHeader;
    attendanceControl.set("attending", attendedSessionService.isAttending(data.id));
    loadingIndicator.dispose();
  });

  return page;
};
