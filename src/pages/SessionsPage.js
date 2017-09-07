import LoadingIndicator from "../components/LoadingIndicator";
import CollectionView from "../components/collectionView/TabrisConCollectionView";
import {Page} from "tabris";
import texts from "../resources/texts";

export default class extends Page {

  constructor(viewDataProvider, loginService, feedbackService) {
    super({
      id: "sessionsPage",
      title: texts.SESSIONS_PAGE_TITLE_LOADING
    });

    this._loadingIndicator = new LoadingIndicator().appendTo(this);

    this._list = new CollectionView({
      id: "sessionsCollectionView",
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
      viewDataProvider, loginService, feedbackService
    }).appendTo(this);
  }

  set data(data) {
    this._data = data;
    this.title = data.title;
    this._list.items = data.items;
    this._list.animate({opacity: 1}, {duration: 250});
    this._loadingIndicator.dispose();
  }

  get data() {
    return this._data;
  }

}
