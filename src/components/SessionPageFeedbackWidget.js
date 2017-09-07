import _ from "lodash";
import FeedbackButton from "./FeedbackButton";
import FeedbackPage from "../pages/FeedbackPage";
import LoginPage from "../pages/LoginPage";
import addProgressTo from "../helpers/addProgressTo";
import sizes from "../resources/sizes";
import colors from "../resources/colors";
import fontToString from "../helpers/fontToString";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import texts from "../resources/texts";
import {Composite, TextView} from "tabris";
import {pageNavigation} from "../pages/navigation";

export default class extends Composite {
  constructor(session, viewDataProvider, loginService, feedbackService) {
    super({
      id: "sessionPageFeedbackWidget",
      top: sizes.MARGIN, right: sizes.MARGIN, height: 36
    });
    this._session = session;
    this._viewDataProvider = viewDataProvider;
    this._loginService = loginService;
    this._feedbackService = feedbackService;
    addProgressTo(this);
    applyPlatformStyle(this);
    this._showState();
    // No need to refresh on login success, as we do that already on page appear.
    let refreshHandler = () => this.refresh();
    loginService.onLogoutSuccess(refreshHandler);
    this.on("dispose", () => loginService.offLogoutSuccess(refreshHandler));
    this.refresh = function() {
      this.children().dispose();
      this._showState();
    };
  }

  _showState() {
    if (this._loginService.isLoggedIn()) {
      this.showProgress(true);
      this._handleFeedbackState();
    } else {
      this._createFeedbackButton()
        .on("select", () => {
          new LoginPage(this._loginService)
            .on("loginSuccess", () => this._handleFeedbackState({loggedIn: true}))
            .open();
        });
    }
  }

  _handleFeedbackState({loggedIn = false} = {}) {
    this._viewDataProvider.getRemoteService().evaluations()
      .then(evaluations => {
        let alreadyEvaluated = !!_.find(evaluations, {nid: this._session.nid});
        if (alreadyEvaluated) {
          return createNoticeTextView(texts.FEEDBACK_SUBMITTED_MESSAGE).appendTo(this);
        }
        if (loggedIn) {
          return this._openFeedbackPage();
        }
        this._createFeedbackButton().on("select", () => this._openFeedbackPage());
      })
      .catch(err => {
        if (err.match && err.match(/Session expired/)) {
          createErrorTextView(texts.FEEDBACK_LOGIN_AGAIN_MESSAGE).appendTo(this);
        } else if (err.match && err.match(/Network request failed/)) {
          createErrorTextView(texts.FEEDBACK_CONNECT_TO_THE_INTERNET_MESSAGE).appendTo(this);
        } else {
          createErrorTextView(texts.FEEDBACK_SOMETHING_WENT_WRONG).appendTo(this);
        }
      })
      .finally(() => this.showProgress(false));
  }

  _createFeedbackButton() {
    let feedbackButton = new FeedbackButton({
      left: 0, centerY: 0,
      text: texts.SESSION_PAGE_FEEDBACK_BUTTON
    }).appendTo(this);
    applyPlatformStyle(feedbackButton);
    return feedbackButton;
  }

  _openFeedbackPage() {
    return new FeedbackPage(this._session, this._feedbackService).appendTo(pageNavigation);
  }
}

function createErrorTextView(text) {
  return createInfoTextView(text, colors.ERROR_COLOR);
}

function createNoticeTextView(text) {
  return createInfoTextView(text, colors.ACTION_COLOR);
}

function createInfoTextView(text, color) {
  let infoTextView = new TextView({
    left: 0, centerY: 0, right: sizes.MARGIN,
    maxLines: 2,
    textColor: color,
    font: fontToString({style: "italic", size: sizes.FONT_MEDIUM}),
    text: text
  });
  applyPlatformStyle(infoTextView);
  return infoTextView;
}

