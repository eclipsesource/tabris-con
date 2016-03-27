import LoadingIndicator from "../components/LoadingIndicator";
import CollectionView from "../components/collectionView/TabrisConCollectionView";
import {Page} from "tabris";

export default class extends Page {
  constructor(viewDataProvider) {
    super({
      id: "sessionsPage",
      title: "Loading..."
    });

    let loadingIndicator = new LoadingIndicator().appendTo(this);

    let collectionView = new CollectionView({
      id: "sessionsCollectionView",
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0
    }, viewDataProvider).appendTo(this);

    this.on("change:data", (page, data) => {
      page.set("title", data.title);
      collectionView.set("items", data.items);
      collectionView.animate({opacity: 1}, {duration: 250});
      loadingIndicator.dispose();
    });
  }
}
