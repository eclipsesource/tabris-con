import CollectionView from "../components/collectionView/TabrisConCollectionView";
import LoadingIndicator from "../components/LoadingIndicator";
import getImage from "../helpers/getImage";
import Navigatable from "./Navigatable";

export default class extends Navigatable {
  constructor({viewDataProvider}) {
    super({
      configuration: {
        id: "tracks",
        title: "Tracks",
        image: getImage.forDevicePlatform("tracks_selected") // TODO: selected image initially shown as part of workaround for tabris-ios#841
      },
      viewDataProvider
    });
    let loadingIndicator = new LoadingIndicator().appendTo(this);
    let collectionView = new CollectionView({
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
      updatable: true
    }, viewDataProvider).appendTo(this);
    this.on("change:data",(widget, data) => {
      if (collectionView.get("items").length > 0) {
        return;
      }
      collectionView.set("items", data);
      collectionView.animate({opacity: 1}, {duration: 250});
      loadingIndicator.dispose();
    });
  }

  initializeItems() {
    return super.getViewDataProvider().getPreviewCategories()
      .then(previewCategories => this.set("data", previewCategories));
  }
}
