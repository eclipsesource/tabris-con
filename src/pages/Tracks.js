import CollectionView from "../components/collectionView/TabrisConCollectionView";
import LoadingIndicator from "../components/LoadingIndicator";
import getImage from "../helpers/getImage";
import Navigatable from "./Navigatable";
import texts from "../resources/texts";

export default class extends Navigatable {
  constructor({viewDataProvider, loginService, feedbackService}) {
    super({
      configuration: {
        id: "tracks",
        title: texts.TRACKS_PAGE_TITLE,
        image: getImage.forDevicePlatform("tracks_selected") // TODO: selected image initially shown as part of workaround for tabris-ios#841
      },
      viewDataProvider
    });
    let loadingIndicator = new LoadingIndicator().appendTo(this);
    let collectionView = new CollectionView({
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
      updatable: true
    }, viewDataProvider, loginService, feedbackService).appendTo(this);
    this.on("change:data", (widget, data) => {
      collectionView.set("items", data);
    });
    this.once("change:data", () => {
      collectionView.animate({opacity: 1}, {duration: 250});
      loadingIndicator.dispose();
    });
  }

  initializeItems() {
    return super.getViewDataProvider().getPreviewCategories()
      .then(previewCategories => this.set("data", previewCategories));
  }
}
