import ConfigurationDate from "../ConfigurationDate";
import getSessionFreeBlock from "../getSessionFreeBlock";
import config from "../configs/config";
import Link from "./Link";
import sizes from "../resources/sizes";
import SessionsPage from "../pages/SessionsPage";
import {Composite} from "tabris";
import texts from "../resources/texts";
import {pageNavigation} from "../pages/navigation";

export default class extends Composite {
  constructor(viewDataProvider, loginService, feedbackService) {
    super();
    this._viewDataProvider = viewDataProvider;
    this._loginService = loginService;
    this._feedbackService = feedbackService;
  }

  set data(session) {
    this._data = session;
    let freeBlock = getSessionFreeBlock(session, config);
    if (freeBlock) {
      let date1 = new ConfigurationDate(config, freeBlock[0]);
      let date2 = new ConfigurationDate(config, freeBlock[1]);
      this._viewDataProvider.getOtherSessionsInTimeframe(date1, date2, session.id)
        .then(otherSessions => {
          if (otherSessions.length > 0) {
            this._createOtherSessionsLink()
              .on("tap", () => {
                let sessionsPage = new SessionsPage(
                    this._viewDataProvider,
                    this._loginService,
                    this._feedbackService
                ).appendTo(pageNavigation);
                let from = date1.format("LT");
                let to = date2.format("LT");
                sessionsPage.data = {title: from + " - " + to, items: otherSessions};
              })
              .appendTo(this);
          }
        });
    }
  }

  get data() {
    return this._data;
  }

  _createOtherSessionsLink() {
    return new Link({
      left: sizes.LEFT_CONTENT_MARGIN,
      top: ["#speakersComposite", sizes.MARGIN_LARGE],
      height: sizes.SESSION_PAGE_OTHER_SESSIONS_LINK_HEIGHT,
      text: texts.SESSION_PAGE_OTHER_SESSIONS_LINK
    });
  }
}
