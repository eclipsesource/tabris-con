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

    let loadingIndicator = new LoadingIndicator().appendTo(this);

    let collectionView = new CollectionView({
      id: "sessionsCollectionView",
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0
    }, viewDataProvider, loginService, feedbackService).appendTo(this);

    this.on("change:data", (page, data) => {
      page.set("title", data.title);
      collectionView.set("items", data.items);
      collectionView.animate({opacity: 1}, {duration: 250});
      loadingIndicator.dispose();
    });
  }
}
