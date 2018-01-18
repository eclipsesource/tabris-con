import { Composite, CompositeProperties } from "tabris";
import * as _ from "lodash";
import ViewDataProvider from "../ViewDataProvider";
import CodFeedbackService from "../helpers/CodFeedbackService";
import LoginService from "../helpers/CodLoginService";
import FeedbackButton from "./FeedbackButton";
import FeedbackPage from "../pages/FeedbackPage";
import LoginPage from "../pages/LoginPage";
import fontToString from "../helpers/fontToString";
import colors from "../resources/colors";
import sizes from "../resources/sizes";
import texts from "../resources/texts";
import { pageNavigation } from "../pages/navigation";
import { property } from "tabris-decorators";
import Progress from "./Progress";

interface SessionPageFeedbackWidgetProperties {
  session: any;
  viewDataProvider: ViewDataProvider;
  loginService: LoginService;
  feedbackService: CodFeedbackService;
}

export default class SessionPageFeedbackWidget extends Progress(Composite) {

  public jsxProperties: JSX.CompositeProperties & SessionPageFeedbackWidgetProperties;
  public tsProperties: CompositeProperties & SessionPageFeedbackWidgetProperties;

  @property public session: any;
  @property public viewDataProvider: ViewDataProvider;
  @property public loginService: LoginService;
  @property public feedbackService: CodFeedbackService;

  constructor(properties: CompositeProperties & SessionPageFeedbackWidgetProperties) {
    super();
    this.set({id: "sessionPageFeedbackWidget", ...properties});
    this.render();
  }

  public refresh() {
    this.children().dispose();
    this.render();
  }

  private async render() {
    if (!this.loginService.isLoggedIn()) {
      return this.showFeedbackButton()
        .on({select: () => this.openLoginPage()});
    }
    this.showProgress(true);
    try {
      let evaluations = await this.viewDataProvider.getRemoteService().evaluations();
      let alreadyEvaluated = !!_.find(evaluations, { nid: this.session.nid });
      if (alreadyEvaluated) {
        this.showNotice(texts.FEEDBACK_SUBMITTED_MESSAGE);
      } else {
        this.showFeedbackButton()
          .on({select: () => this.openFeedbackPage()});
      }
    } catch(e) { this.showError(this.messageForError(e)); }
    this.showProgress(false);
  }

  private messageForError(e: any) {
    if (e.match && e.match(/Session expired/)) {
      return texts.FEEDBACK_LOGIN_AGAIN_MESSAGE;
    } else if (e.match && e.match(/Network request failed/)) {
      return texts.FEEDBACK_CONNECT_TO_THE_INTERNET_MESSAGE;
    } else {
      return texts.FEEDBACK_SOMETHING_WENT_WRONG;
    }
  }

  private openLoginPage() {
    pageNavigation.append(
      <LoginPage
          loginService={this.loginService}
          onLoginSuccess={() => this.openFeedbackPage()} />
    );
  }

  private openFeedbackPage() {
    return new FeedbackPage(this.session, this.feedbackService).appendTo(pageNavigation);
  }

  private showFeedbackButton() {
    return (
      <FeedbackButton
          left={0} centerY={0}
          text={texts.SESSION_PAGE_FEEDBACK_BUTTON} />
    ).appendTo(this);
  }

  private showError(text: string) {
    this.append(
      <textView
          left={0} centerY={0} right={sizes.MARGIN}
          maxLines={2}
          font={fontToString({ style: "italic", size: sizes.FONT_MEDIUM })}
          textColor={colors.ERROR_COLOR}
          text={text} />
    );
  }

  private showNotice(text: string) {
    this.append(
      <textView
          left={0} centerY={0} right={sizes.MARGIN}
          maxLines={2}
          font={fontToString({ style: "italic", size: sizes.FONT_MEDIUM })}
          textColor={colors.ACTION_COLOR}
          text={text} />
    );
  }

}
