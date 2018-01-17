import { Composite } from "tabris";
import CodFeedbackService from "../helpers/CodFeedbackService";
import ConfigurationDate from "../ConfigurationDate";
import ViewDataProvider from "../ViewDataProvider";
import LoginService from "../helpers/CodLoginService";
import SessionsPage from "../pages/SessionsPage";
import Link from "./Link";
import getSessionFreeBlock from "../getSessionFreeBlock";
import config from "../configs/config";
import sizes from "../resources/sizes";
import texts from "../resources/texts";
import { pageNavigation } from "../pages/navigation";

export default class OtherSessionsLink extends Composite {

  private viewDataProvider: ViewDataProvider;
  private loginService: LoginService;
  private feedbackService: CodFeedbackService;

  private _data: any = null;

  constructor(
    viewDataProvider: ViewDataProvider,
    loginService: LoginService,
    feedbackService: CodFeedbackService
  ) {
    super();
    this.viewDataProvider = viewDataProvider;
    this.loginService = loginService;
    this.feedbackService = feedbackService;
  }

  set data(session: any) {
    this._data = session;
    let freeBlock = getSessionFreeBlock(session, config);
    if (freeBlock !== null) {
      let date1: ConfigurationDate = new ConfigurationDate(config, freeBlock[0]);
      let date2: ConfigurationDate = new ConfigurationDate(config, freeBlock[1]);
      this.viewDataProvider.getOtherSessionsInTimeframe(date1, date2, session.id)
        .then((otherSessions: any) => {
          if (otherSessions.length > 0) {
            this.createOtherSessionsLink()
              .on("tap", () => {
                let sessionsPage: SessionsPage = new SessionsPage(
                  this.viewDataProvider,
                  this.loginService,
                  this.feedbackService
                ).appendTo(pageNavigation);
                let from: string = date1.format("LT");
                let to: string = date2.format("LT");
                sessionsPage.data = { title: from + " - " + to, items: otherSessions };
              })
              .appendTo(this);
          }
        });
    }
  }

  get data() {
    return this._data;
  }

  private createOtherSessionsLink() {
    return (
      <Link
        left={sizes.LEFT_CONTENT_MARGIN}
        top={["#speakersComposite", sizes.MARGIN_LARGE]}
        height={sizes.SESSION_PAGE_OTHER_SESSIONS_LINK_HEIGHT}
        text={texts.SESSION_PAGE_OTHER_SESSIONS_LINK} />
    );
  }

}
