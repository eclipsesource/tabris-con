import TabrisConCollectionView from "../components/collectionView/TabrisConCollectionView";
import texts from "../resources/texts";
import { Page, ActivityIndicator } from "tabris";
import { getById, component } from "tabris-decorators";
import ViewDataProvider from "../ViewDataProvider";
import LoginService from "../helpers/CodLoginService";
import CodFeedbackService from "../helpers/CodFeedbackService";

@component export default class SessionsPage extends Page {

  private _data: any;
  @getById private activityIndicator: ActivityIndicator;

  constructor(viewDataProvider: ViewDataProvider, loginService: LoginService, feedbackService: CodFeedbackService) {
    super({
      id: "sessionsPage",
      title: texts.SESSIONS_PAGE_TITLE_LOADING
    });
    this.append(
      <widgetCollection>
        <activityIndicator
            id="activityIndicator"
            centerX={0} centerY={0} />
        <TabrisConCollectionView
            id="sessionsList"
            left={0} top={0} right={0} bottom={0} opacity={0}
            viewDataProvider={viewDataProvider}
            loginService={loginService}
            feedbackService={feedbackService} />
      </widgetCollection>
    );
  }

  set data(data: any) {
    this._data = data;
    this.title = data.title;
    let list = this._find("#sessionsList").first(TabrisConCollectionView);
    list.items = data.items;
    list.animate({opacity: 1}, {duration: 250});
    this.activityIndicator.dispose();
  }

  get data() {
    return this._data;
  }

}
