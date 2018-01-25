import colors from "../resources/colors";
import InfoToast from "../components/InfoToast";
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
      right: 16,
      top: select({ ios: "#sessionPageFeedbackWidget 8", default: "#sessionPageFeedbackWidget 16" }),
      left: select({ ios: 16, default: 72 }),
      textColor: select({ios: colors.DARK_PRIMARY_TEXT_COLOR, default: colors.DARK_SECONDARY_TEXT_COLOR}),
      markupEnabled: true,
      lineSpacing: 1.2
    }).appendTo(contentComposite);

    new Composite({
      id: "speakersComposite",
      left: 0, top: "prev()", right: 0
    }).appendTo(contentComposite);

    this.otherSessionsLink = new OtherSessionsLink(viewDataProvider, loginService, feedbackService);
    this.otherSessionsLink.top = "prev()";
    this.otherSessionsLink.appendTo(contentComposite);

    new Composite({left: 0, top: "prev()", right: 0, height: 16}).appendTo(contentComposite);

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
      left: select({ios: 16, default: 72}),
      right: 16, top: "prev() 32",
      text: texts.SESSION_PAGE_SPEAKERS,
      font: fontToString({weight: "bold", size: 14}),
      textColor: colors.ACCENTED_TEXT_COLOR
    }).appendTo(speakersComposite);
    speakers.forEach(speaker => this._createSpeaker(speaker).appendTo(speakersComposite));
  }

  _createSpeaker(speaker) {
    let speakerContainer = new Composite({left: 0, top: "prev() 16", right: 0 });
    new ImageView({
      left: 16, top: 4, width: SPEAKER_IMAGE_SIZE, height: SPEAKER_IMAGE_SIZE,
      cornerRadius: 19,
      scaleMode: "fit",
      image: getImage.common(this._getSpeakerImage(speaker), SPEAKER_IMAGE_SIZE, SPEAKER_IMAGE_SIZE)
    }).appendTo(speakerContainer);
    new TextView({
      id: "summary",
      left: 72, top: 0, right: 16,
      text: speaker.summary,
      lineSpacing: 1.2,
      textColor: select({ios: colors.DARK_PRIMARY_TEXT_COLOR, default: colors.DARK_SECONDARY_TEXT_COLOR}),
      font: fontToString({weight: "bold", size: 14})
    }).appendTo(speakerContainer);
    if (speaker.twitter.length) {
      speakerContainer.append(
        new Composite({left: 0, top: "#summary 4"}).append(
          new ImageView({
            left: 72, top: 0, height: TWITTER_ICON_SIZE,
            image: getImage.common("twitter", TWITTER_ICON_SIZE, TWITTER_ICON_SIZE)
          }),
          new Link({
            left: "prev() 4", centerY: 0,
            font: fontToString({weight: "bold", size: 12}),
            text: `@${speaker.twitter}`,
            url: `https://twitter.com/${speaker.twitter}`
          })
        )
      )
    }
    new TextView({
      left: 72, top: "prev() 8", right: 16,
      text: speaker.bio,
      lineSpacing: 1.2,
      textColor: select({ios: colors.DARK_PRIMARY_TEXT_COLOR, default: colors.DARK_SECONDARY_TEXT_COLOR}),
      font: fontToString({size: 14})
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
        left: select({ios: 16, default: 72}), top: 8, right: 8, height: 36,
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

}

const SPEAKER_IMAGE_SIZE = 38;
const TWITTER_ICON_SIZE = 18;
