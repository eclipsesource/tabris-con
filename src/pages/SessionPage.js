import colors from "../resources/colors";
import LoadingIndicator from "../components/LoadingIndicator";
import InfoToast from "../components/InfoToast";
import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import SessionPageHeader from "../components/SessionPageHeader";
import Link from "../components/Link";
import getImage from "../helpers/getImage";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import * as attendedSessionService from "../helpers/attendedSessionService";
import AttendanceAction from "../actions/AttendanceAction";
import SessionPageFeedbackWidget from "../components/SessionPageFeedbackWidget";
import OtherSessionsLink from "../components/OtherSessionsLink";
import config from "../configs/config";
import {Page, ScrollView, ImageView, Composite, TextView} from "tabris";
import texts from "../resources/texts";

export default class extends Page {
  constructor(viewDataProvider, loginService, feedbackService) {
    super({topLevel: false, id: "sessionPage"});
    this._viewDataProvider = viewDataProvider;
    this._loginService = loginService;
    this._feedbackService = feedbackService;
    this._titleCompY = 0;

    if (device.platform === "Android") {
      this
        .on("appear", () => {
          tabris.ui.set("toolbarVisible", false);
        })
        .on("disappear", () => {
          tabris.ui.set("toolbarVisible", true);
        });
    }

    let scrollView = new ScrollView({left: 0, right: 0, top: 0, bottom: 0}).appendTo(this);

    let imageView = new ImageView({
      id: "sessionPageImageView",
      left: 0, top: 0, right: 0,
      background: colors.BACKGROUND_COLOR,
      scaleMode: "fill"
    }).appendTo(scrollView);

    let contentComposite = new Composite({
      left: 0, right: 0, top: "#sessionPageHeader",
      id: "contentComposite",
      background: "white"
    }).appendTo(scrollView);

    let sessionPageHeader = new SessionPageHeader().appendTo(scrollView);

    sessionPageHeader
      .on("backButtonTap", () => this.close())
      .on("attendanceButtonTap", (widget, wasChecked) => this._updateAttendance(widget, wasChecked));

    let descriptionTextView = new TextView({
      id: "sessionPageDescriptionTextView",
      right: sizes.MARGIN_LARGE,
      markupEnabled: true,
      lineSpacing: sizes.LINE_SPACING
    }).appendTo(contentComposite);

    applyPlatformStyle(descriptionTextView);

    new Composite({
      id: "speakersComposite",
      left: 0, top: "prev()", right: 0
    }).appendTo(contentComposite);

    let otherSessionsLink = new OtherSessionsLink(viewDataProvider, loginService);

    otherSessionsLink.set("top", "prev()").appendTo(contentComposite);

    this._createSpacer().appendTo(contentComposite);

    let loadingIndicator = new LoadingIndicator({shade: true}).appendTo(this);

    this
      .on("appear", () => {
        if (device.platform !== "Android") {
          new AttendanceAction().on("select", widget => this._updateAttendance(widget, widget.get("attending")));
        }
      })
      .on("disappear", () => tabris.ui.find("#attendanceAction").dispose())
      .on("appear", () => {
        let feedbackWidget = this.find("#sessionPageFeedbackWidget").first();
        if (feedbackWidget) {
          feedbackWidget.refresh();
        }
      })
      .on("change:data", (widget, data) => {
        this._setWidgetData(data);
        otherSessionsLink.set("data", data);
        scrollView.on("resize", this._layoutParallax);
        this._layoutParallax(scrollView);
        let attendanceControl = device.platform !== "Android" ? tabris.ui.find("#attendanceAction") : sessionPageHeader;
        attendanceControl.set("attending", attendedSessionService.isAttending(data.id));
        loadingIndicator.dispose();
      });

    if (device.platform === "Android") {
      let self = this;
      scrollView.on("scroll", (widget, offset) => {
        imageView.set("transform", {translationY: Math.max(0, offset.y * 0.4)});
        sessionPageHeader.set("transform", {translationY: Math.max(0, offset.y - self._titleCompY)});
      });
    }

    scrollView.once("resize", () => this._layoutParallax(scrollView, {initialLayout: true}));
  }

  _createSpeakers(speakers) {
    let speakersComposite = this.find("#speakersComposite").first();
    speakersComposite.children().dispose();
    if (speakers.length < 1) {
      return;
    }
    let speakersTextView = new TextView({
      id: "sessionPageSpeakersTextView",
      right: sizes.MARGIN_LARGE, top: ["prev()", sizes.MARGIN_LARGE * 2],
      text: texts.SESSION_PAGE_SPEAKERS,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: colors.ACCENTED_TEXT_COLOR
    }).appendTo(speakersComposite);
    applyPlatformStyle(speakersTextView);
    speakers.forEach(speaker => this._createSpeaker(speaker).appendTo(speakersComposite));
  }

  _createSpeaker(speaker) {
    let speakerContainer = new Composite({
      left: 0, top: ["prev()", sizes.MARGIN_LARGE], right: 0
    });
    new ImageView({
      left: sizes.MARGIN_LARGE,
      top: sizes.MARGIN_SMALL,
      width: sizes.SESSION_SPEAKER_IMAGE,
      height: sizes.SESSION_SPEAKER_IMAGE,
      cornerRadius: sizes.SESSION_SPEAKER_IMAGE / 2,
      scaleMode: "fit",
      image: getImage.common(this._getSpeakerImage(speaker), sizes.SESSION_SPEAKER_IMAGE, sizes.SESSION_SPEAKER_IMAGE)
    }).appendTo(speakerContainer);
    let speakerSummary = new TextView({
      id: "sessionPageSpeakerSummary",
      left: sizes.LEFT_CONTENT_MARGIN, top: 0, right: sizes.MARGIN_LARGE,
      text: speaker.summary,
      lineSpacing: sizes.LINE_SPACING,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
    }).appendTo(speakerContainer);
    applyPlatformStyle(speakerSummary);
    if (speaker.twitter.length) {
      new ImageView({
        left: sizes.LEFT_CONTENT_MARGIN,
        top: speakerSummary,
        height: sizes.FONT_SMALL * 1.5,
        image: getImage.common("twitter", sizes.FONT_SMALL * 1.5, sizes.FONT_SMALL * 1.5)
      }).appendTo(speakerContainer);
      new Link({
        left: ["prev()", sizes.MARGIN_SMALL], top: speakerSummary,
        font: fontToString({weight: "bold", size: sizes.FONT_SMALL}),
        text: `@${speaker.twitter}`,
        url: `https://twitter.com/${speaker.twitter}`
      }).appendTo(speakerContainer);
    }
    let speakerBio = new TextView({
      id: "sessionPageSpeakerBio",
      left: sizes.LEFT_CONTENT_MARGIN, top: "prev()", right: sizes.MARGIN_LARGE,
      text: speaker.bio,
      lineSpacing: sizes.LINE_SPACING,
      font: fontToString({size: sizes.FONT_MEDIUM})
    }).appendTo(speakerContainer);
    applyPlatformStyle(speakerBio);
    return speakerContainer;
  }

  _getSpeakerImage(speaker) {
    return this._hasConnection() ? speaker.image : "speaker_avatar";
  }

  _hasConnection() {
    if (!navigator.connection) {
      console.warn("cordova-plugin-network-information is not available in this Tabris.js client. Trying to download" +
        " speaker image.");
      return true;
    }
    return navigator.connection.type !== window.Connection.NONE;
  }

  _setWidgetData(data) {
    let scrollView = this.find("ScrollView").first();
    let sessionPageHeader = this.find("#sessionPageHeader").first();
    let descriptionTextView = this.find("#sessionPageDescriptionTextView").first();
    let imageView = this.find("#sessionPageImageView").first();
    let contentComposite = this.find("#contentComposite").first();
    let scrollViewBounds = scrollView.get("bounds");
    sessionPageHeader.set({
      titleText: data.title,
      summaryText: data.summary,
      trackIndicatorColor: config.TRACK_COLOR && config.TRACK_COLOR[data.categoryName] || "initial"
    });
    descriptionTextView.set("text", data.description);
    imageView.set("image", getImage.common(data.image, scrollViewBounds.width, scrollViewBounds.height / 3));
    if (this._feedbackService && this._feedbackService.canGiveFeedbackForSession(data)) {
      new SessionPageFeedbackWidget(data, this._viewDataProvider, this._loginService, this._feedbackService)
        .appendTo(contentComposite);
    }
    this._createSpeakers(data.speakers);
  }

  _layoutParallax(scrollView, options) {
    let imageView = this.find("#sessionPageImageView").first();
    let pageHeader = this.find("#sessionPageHeader").first();
    let showImageView = imageView.get("image") || options && options.initialLayout && config.SESSIONS_HAVE_IMAGES;
    let imageHeight = showImageView ? scrollView.get("bounds").height / 3 : 0;
    imageView.set("height", imageHeight);
    this._titleCompY = imageHeight;
    pageHeader.set("top", this._titleCompY);
  }

  _updateAttendance(widget, wasChecked) {
    let checked = !wasChecked;
    let session = this.get("data");
    if (session) {
      if (checked) {
        attendedSessionService.addAttendedSessionId(session.id);
      } else {
        attendedSessionService.removeAttendedSessionId(session.id);
      }
      widget.set("attending", checked);
      InfoToast
        .show({
          type: "myScheduleOperation",
          messageText: checked ? texts.INFO_TOAST_SESSION_ADDED : texts.INFO_TOAST_SESSION_REMOVED,
          actionText: texts.INFO_TOAST_ACTION
        })
        .on("actionTap", toast => {
          if (!toast.isDisposed()) {
            if (toast.get("toastType") === "myScheduleOperation") {
              tabris.ui.find("#schedule").last().open();
            }
          }
        });
    }
  }

  _createSpacer() {
    return new Composite({
      left: 0, top: "prev()", right: 0, height: sizes.SESSION_PAGE_SPACER_HEIGHT
    });
  }

}
