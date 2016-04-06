import _ from "lodash";
import FeedbackButton from "./FeedbackButton";
import FeedbackPage from "../pages/FeedbackPage";
import addProgressTo from "../helpers/addProgressTo";
import sizes from "../resources/sizes";
import colors from "../resources/colors";
import fontToString from "../helpers/fontToString";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import {Composite, TextView} from "tabris";

export default class extends Composite {
  constructor(adaptedSession, viewDataProvider, loginService, feedbackService) {
    super({
      id: "sessionPageFeedbackWidget",
      top: sizes.MARGIN, right: sizes.MARGIN, height: 36
    });
    this._viewDataProvider = viewDataProvider;
    this._loginService = loginService;
    this._feedbackService = feedbackService;
    addProgressTo(this);
    applyPlatformStyle(this);
    this._showState(this, adaptedSession);
    this.refresh = function() {
      this.children().dispose();
      this._showState(this, adaptedSession);
    };
  }
  _showState(feedbackWidget, adaptedSession) {
    if (this._loginService.isLoggedIn()) {
      feedbackWidget.set("progress", true);
      this._showFeedbackState(feedbackWidget, adaptedSession);
    } else {
      createNoticeTextView("Please login to give feedback.").appendTo(feedbackWidget);
    }
  }

  _showFeedbackState(feedbackWidget, adaptedSession) {
    this._viewDataProvider.getRemoteService().evaluations()
      .then(this._handleSessionValid(feedbackWidget, adaptedSession))
      .catch(this._handleErrors(feedbackWidget))
      .finally(() => feedbackWidget.set("progress", false));
  }

  _handleSessionValid(feedbackWidget, adaptedSession) {
    return function(evaluations) {
      let evaluationAlreadySubmitted = !!_.find(evaluations, {nid: adaptedSession.nid});
      let widget = evaluationAlreadySubmitted ?
        createNoticeTextView("Feedback for this session was submitted.") : this._createFeedbackButton(adaptedSession);
      widget.appendTo(feedbackWidget);
    };
  }

  _handleErrors(feedbackWidget) {
    return function(e) {
      if (e.match && e.match(/Session expired/)) {
        createErrorTextView("Please login again to give feedback.").appendTo(feedbackWidget);
      } else if (e.match && e.match(/Network request failed/)) {
        createErrorTextView("Connect to the Internet to give feedback.").appendTo(feedbackWidget);
      } else {
        createErrorTextView("Something went wrong. Try giving feedback later.").appendTo(feedbackWidget);
      }
    };
  }

  _createFeedbackButton(adaptedSession) {
    let feedbackButton = new FeedbackButton({
      left: 0, centerY: 0,
      text: "Give feedback"
    }).on("select", () => new FeedbackPage(adaptedSession, this._feedbackService).open());

    applyPlatformStyle(feedbackButton);

    return feedbackButton;
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

