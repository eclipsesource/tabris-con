import { Composite, CompositeProperties } from "tabris";
import * as _ from "lodash";
import ViewDataProvider from "../ViewDataProvider";
import LoginService from "../helpers/CodLoginService";
import FeedbackPage from "../pages/FeedbackPage";
import LoginPage from "../pages/LoginPage";
import fontToString from "../helpers/fontToString";
import colors from "../resources/colors";
import texts from "../resources/texts";
import { pageNavigation } from "../pages/navigation";
import { property, resolve } from "tabris-decorators";
import Progress from "./Progress";
import { select } from "../helpers/platform";

interface SessionPageFeedbackWidgetProperties {
  session: any;
}

export default class SessionPageFeedbackWidget extends Progress(Composite) {

  public jsxProperties: JSX.CompositeProperties & SessionPageFeedbackWidgetProperties;
  public tsProperties: CompositeProperties & SessionPageFeedbackWidgetProperties;

  @property public session: any;

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
    if (!resolve(LoginService).isLoggedIn()) {
      return this.showFeedbackButton()
        .on({tap: () => this.openLoginPage()});
    }
    this.showProgress(true);
    try {
      let evaluations = await resolve(ViewDataProvider).getRemoteService().evaluations();
      let alreadyEvaluated = !!_.find(evaluations, { nid: this.session.nid });
      if (alreadyEvaluated) {
        this.showNotice(texts.FEEDBACK_SUBMITTED_MESSAGE);
      } else {
        this.showFeedbackButton()
          .on({tap: () => this.openFeedbackPage()});
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
          onLoginSuccess={() => this.openFeedbackPage()} />
    );
  }

  private openFeedbackPage() {
    pageNavigation.append(
      <FeedbackPage
          session={this.session} />
    );
  }

  private showFeedbackButton() {
    return (
      <textView
          left={0} centerY={0}
          text={FEEDBACK_BUTTON_TEXT}
          textColor={colors.ACTION_COLOR}
          highlightOnTouch={true}
          font={fontToString({ size: 16, weight: "bold" })} />
    ).appendTo(this);
  }

  private showError(text: string) {
    this.append(
      <textView
          left={0} centerY={0} right={8}
          maxLines={2}
          font={fontToString({ style: "italic", size: 14 })}
          textColor={colors.ERROR_COLOR}
          text={text} />
    );
  }

  private showNotice(text: string) {
    this.append(
      <textView
          left={0} centerY={0} right={8}
          maxLines={2}
          font={fontToString({ style: "italic", size: 14 })}
          textColor={colors.ACTION_COLOR}
          text={text} />
    );
  }

}

const FEEDBACK_BUTTON_TEXT = select({
  android: texts.SESSION_PAGE_FEEDBACK_BUTTON.toUpperCase(),
  default: texts.SESSION_PAGE_FEEDBACK_BUTTON
});
