import { Composite } from "tabris";
import ConfigurationDate from "../ConfigurationDate";
import SessionsPage from "../pages/SessionsPage";
import Link from "./Link";
import getSessionFreeBlock from "../getSessionFreeBlock";
import config from "../configs/config";
import texts from "../resources/texts";
import { pageNavigation } from "../pages/navigation";
import { resolve } from "tabris-decorators";
import ViewDataProvider from "../ViewDataProvider";

export default class OtherSessionsLink extends Composite {

  private _data: any = null;

  set data(session: any) {
    this._data = session;
    let freeBlock = getSessionFreeBlock(session, config);
    if (freeBlock !== null) {
      let date1: ConfigurationDate = new ConfigurationDate(config, freeBlock[0]);
      let date2: ConfigurationDate = new ConfigurationDate(config, freeBlock[1]);
      resolve(ViewDataProvider).getOtherSessionsInTimeframe(date1, date2, session.id)
        .then((otherSessions: any) => {
          if (otherSessions.length > 0) {
            this.createOtherSessionsLink()
              .on("tap", () => {
                let sessionsPage: SessionsPage = new SessionsPage().appendTo(pageNavigation);
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
        left={72} top="#speakersComposite 16" height={16}
        text={texts.SESSION_PAGE_OTHER_SESSIONS_LINK} />
    );
  }

}
