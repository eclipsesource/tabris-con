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
import {pageNavigation} from "./navigation";

export default class extends Page {
  constructor(viewDataProvider, loginService, feedbackService) {
    super({id: "sessionPage"});
    this._viewDataProvider = viewDataProvider;
    this._loginService = loginService;
    this._feedbackService = feedbackService;
    this._titleCompY = 0;

    if (device.platform === "Android") {
      this
        .on("appear", () => pageNavigation.toolbarVisible = false)
        .on("disappear", () => pageNavigation.toolbarVisible = true);
    }

    this._scrollView = new ScrollView({left: 0, right: 0, top: 0, bottom: 0}).appendTo(this);

    let imageView = new ImageView({
      id: "sessionPageImageView",
      left: 0, top: 0, right: 0,
      background: colors.BACKGROUND_COLOR,
      scaleMode: "fill"
    }).appendTo(this._scrollView);

    let contentComposite = new Composite({
      left: 0, right: 0, top: "#sessionPageHeader",
      id: "contentComposite",
      background: "white"
    }).appendTo(this._scrollView);

    this._sessionPageHeader = new SessionPageHeader()
      .on("backButtonTap", () => this.dispose())
      .on("attendanceButtonTap", ({target, wasChecked}) => this._updateAttendance(target, wasChecked))
      .appendTo(this._scrollView);

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

    this.otherSessionsLink = new OtherSessionsLink(viewDataProvider, loginService, feedbackService);
    this.otherSessionsLink.top = "prev()";
    this.otherSessionsLink.appendTo(contentComposite);

    this._createSpacer().appendTo(contentComposite);

    this._loadingIndicator = new LoadingIndicator({shade: true}).appendTo(this);

    this
      .on("appear", () => {
        if (device.platform !== "Android") {
          new AttendanceAction()
            .on("select", ({target}) => this._updateAttendance(target, target.attending))
            .appendTo(pageNavigation);
        }
      })
      .on("disappear", () => tabris.ui.find("#attendanceAction").dispose())
      .on("appear", () => {
        let feedbackWidget = this.find("#sessionPageFeedbackWidget").first();
        if (feedbackWidget) {
          feedbackWidget.refresh();
        }
      });

    if (device.platform === "Android") {
      let self = this;
      this._scrollView.on("scrollY", ({offset}) => {
        imageView.transform = {translationY: Math.max(0, offset * 0.4)};
        this._sessionPageHeader.transform = {translationY: Math.max(0, offset - self._titleCompY)};
      });
    }

    this._scrollView.once("resize", () => this._layoutParallax({initialLayout: true}));
  }

  set data(session) {
    this._data = session;
    this._setWidgetData(session);
    this.otherSessionsLink.data = session;
    this._scrollView.on("resize", () => this._layoutParallax());
    this._layoutParallax();
    let attendanceControl =
      device.platform !== "Android" ? tabris.ui.find("#attendanceAction").first() : this._sessionPageHeader;
    attendanceControl.attending = attendedSessionService.isAttending(session.id);
    this._loadingIndicator.dispose();
  }

  get data() {
    return this._data;
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
    let descriptionTextView = this.find("#sessionPageDescriptionTextView").first();
    let imageView = this.find("#sessionPageImageView").first();
    let contentComposite = this.find("#contentComposite").first();
    let scrollViewBounds = this._scrollView.bounds;
    this._sessionPageHeader.set({
      titleText: data.title,
      summaryText: data.summary,
      trackIndicatorColor: config.TRACK_COLOR && config.TRACK_COLOR[data.categoryName] || "initial"
    });
    descriptionTextView.text = data.description;
    imageView.image = getImage.common(data.image, scrollViewBounds.width, scrollViewBounds.height / 3);
    if (this._feedbackService && this._feedbackService.canGiveFeedbackForSession(data)) {
      new SessionPageFeedbackWidget(data, this._viewDataProvider, this._loginService, this._feedbackService)
        .appendTo(contentComposite);
    }
    this._createSpeakers(data.speakers);
  }

  _layoutParallax(options) {
    let imageView = this.find("#sessionPageImageView").first();
    let pageHeader = this.find("#sessionPageHeader").first();
    let showImageView = imageView.image || options && options.initialLayout && config.SESSIONS_HAVE_IMAGES;
    let imageHeight = showImageView ? this._scrollView.bounds.height / 3 : 0;
    imageView.height = imageHeight;
    this._titleCompY = imageHeight;
    pageHeader.top = this._titleCompY;
  }

  _updateAttendance(widget, wasChecked) {
    let checked = !wasChecked;
    let session = this.data;
    if (session) {
      if (checked) {
        attendedSessionService.addAttendedSessionId(session.id);
      } else {
        attendedSessionService.removeAttendedSessionId(session.id);
      }
      widget.attending = checked;
      InfoToast
        .show({
          type: "myScheduleOperation",
          messageText: checked ? texts.INFO_TOAST_SESSION_ADDED : texts.INFO_TOAST_SESSION_REMOVED,
          actionText: texts.INFO_TOAST_ACTION
        })
        .on("actionTap", ({target}) => {
          if (!target.isDisposed() && target.toastType === "myScheduleOperation") {
            this._openSchedule();
          }
        });
    }
  }

  _openSchedule() {
    let navigation = tabris.ui.find("#navigation").first();
    let schedule = tabris.ui.find("#schedule").first();
    pageNavigation.pages().toArray().forEach((page) => {
      if (page.id !== "mainPage") {
        page.dispose();
      }
    });
    navigation.selection = schedule;
  }

  _createSpacer() {
    return new Composite({
      left: 0, top: "prev()", right: 0, height: sizes.SESSION_PAGE_SPACER_HEIGHT
    });
  }

}
