import colors from "../resources/colors";
import InfoToast from "../components/InfoToast";
import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import {select} from "../helpers/platform";
import SessionPageHeader from "../components/SessionPageHeader";
import Link from "../components/Link";
import getImage from "../helpers/getImage";
import * as attendedSessionService from "../helpers/attendedSessionService";
import AttendanceAction from "../actions/AttendanceAction";
import SessionPageFeedbackWidget from "../components/SessionPageFeedbackWidget";
import OtherSessionsLink from "../components/OtherSessionsLink";
import config from "../configs/config";
import {Page, ScrollView, ImageView, Composite, TextView, ActivityIndicator} from "tabris";
import texts from "../resources/texts";
import {pageNavigation} from "./navigation";

export default class SessionPage extends Page {
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

    this._scrollView = new ScrollView({left: 0, right: 0, top: 0, bottom: 0, visible: false}).appendTo(this);

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

    this._sessionPageHeader = new SessionPageHeader({left: 0, right: 0})
      .on("backButtonTap", () => this.dispose())
      .on("attendanceButtonTap", ({target}) => this._updateAttendance(target))
      .appendTo(this._scrollView);

    new TextView({
      id: "descriptionLabel",
      right: sizes.MARGIN_LARGE,
      top: select({
        ios: ["#sessionPageFeedbackWidget", sizes.MARGIN],
        default: ["#sessionPageFeedbackWidget", sizes.MARGIN_LARGE]
      }),
      left: select({ios: sizes.MARGIN_LARGE, default: sizes.LEFT_CONTENT_MARGIN}),
      textColor: select({ios: colors.DARK_PRIMARY_TEXT_COLOR, default: colors.DARK_SECONDARY_TEXT_COLOR}),
      markupEnabled: true,
      lineSpacing: sizes.LINE_SPACING
    }).appendTo(contentComposite);

    new Composite({
      id: "speakersComposite",
      left: 0, top: "prev()", right: 0
    }).appendTo(contentComposite);

    this.otherSessionsLink = new OtherSessionsLink(viewDataProvider, loginService, feedbackService);
    this.otherSessionsLink.top = "prev()";
    this.otherSessionsLink.appendTo(contentComposite);

    this._createSpacer().appendTo(contentComposite);

    this._loadingIndicator = new ActivityIndicator({centerX: 0, centerY: 0}).appendTo(this);

    this
      .on("appear", () => {
        if (device.platform !== "Android") {
          new AttendanceAction()
            .on("select", ({target}) => this._updateAttendance(target))
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
    this._scrollView.visible = true;
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
    new TextView({
      left: select({ios: sizes.MARGIN_LARGE, default: sizes.LEFT_CONTENT_MARGIN}),
      right: sizes.MARGIN_LARGE, top: ["prev()", sizes.MARGIN_LARGE * 2],
      text: texts.SESSION_PAGE_SPEAKERS,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: colors.ACCENTED_TEXT_COLOR
    }).appendTo(speakersComposite);
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
    new TextView({
      left: sizes.LEFT_CONTENT_MARGIN, top: 0, right: sizes.MARGIN_LARGE,
      text: speaker.summary,
      lineSpacing: sizes.LINE_SPACING,
      textColor: select({ios: colors.DARK_PRIMARY_TEXT_COLOR, default: colors.DARK_SECONDARY_TEXT_COLOR}),
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
    }).appendTo(speakerContainer);
    if (speaker.twitter.length) {
      new ImageView({
        left: sizes.LEFT_CONTENT_MARGIN,
        top: "prev()",
        height: sizes.FONT_SMALL * 1.5,
        image: getImage.common("twitter", sizes.FONT_SMALL * 1.5, sizes.FONT_SMALL * 1.5)
      }).appendTo(speakerContainer);
      new Link({
        left: ["prev()", sizes.MARGIN_SMALL], top: "prev()",
        font: fontToString({weight: "bold", size: sizes.FONT_SMALL}),
        text: `@${speaker.twitter}`,
        url: `https://twitter.com/${speaker.twitter}`
      }).appendTo(speakerContainer);
    }
    new TextView({
      left: sizes.LEFT_CONTENT_MARGIN, top: "prev()", right: sizes.MARGIN_LARGE,
      text: speaker.bio,
      lineSpacing: sizes.LINE_SPACING,
      textColor: select({ios: colors.DARK_PRIMARY_TEXT_COLOR, default: colors.DARK_SECONDARY_TEXT_COLOR}),
      font: fontToString({size: sizes.FONT_MEDIUM})
    }).appendTo(speakerContainer);
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
    let descriptionLabel = this.find("#descriptionLabel").first();
    let imageView = this.find("#sessionPageImageView").first();
    let contentComposite = this.find("#contentComposite").first();
    let scrollViewBounds = this._scrollView.bounds;
    this._sessionPageHeader.set({
      titleText: data.title,
      summaryText: data.summary,
      trackIndicatorColor: config.TRACK_COLOR && config.TRACK_COLOR[data.categoryName] || "initial"
    });
    descriptionLabel.text = data.description;
    imageView.image = getImage.common(data.image, scrollViewBounds.width, scrollViewBounds.height / 3);
    if (this._feedbackService && this._feedbackService.canGiveFeedbackForSession(data)) {
      new SessionPageFeedbackWidget({
        left: select({ios: sizes.MARGIN_LARGE, default: sizes.LEFT_CONTENT_MARGIN}),
        top: sizes.MARGIN,
        right: sizes.MARGIN,
        height: 36,
        session: data,
        viewDataProvider: this._viewDataProvider,
        loginService: this._loginService,
        feedbackService: this._feedbackService
      })
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

  _updateAttendance(target) {
    let attending = !target.attending;
    let session = this.data;
    if (session) {
      if (attending) {
        attendedSessionService.addAttendedSessionId(session.id);
      } else {
        attendedSessionService.removeAttendedSessionId(session.id);
      }
      target.attending = attending;
      InfoToast.show({
        messageText: attending ? texts.INFO_TOAST_SESSION_ADDED : texts.INFO_TOAST_SESSION_REMOVED,
        actionText: texts.INFO_TOAST_ACTION
      }).on("actionTap", ({target}) => {
        this._openSchedule();
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
