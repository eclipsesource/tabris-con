import CollectionView from "../components/collectionView/TabrisConCollectionView";
import LoadingIndicator from "../components/LoadingIndicator";
import getImage from "../helpers/getImage";
import texts from "../resources/texts";
import {Tab} from "tabris";
import colors from "../resources/colors";

export default class extends Tab {
  constructor({viewDataProvider, loginService, feedbackService}) {
    super({
      id: "tracks",
      title: texts.TRACKS_PAGE_TITLE,
      textColor: colors.TINT_COLOR,
      image: getImage.forDevicePlatform("tracks"),
      selectedImage: getImage.forDevicePlatform("tracks_selected")
    });
    this._viewDataProvider = viewDataProvider;
    let loadingIndicator = new LoadingIndicator().appendTo(this);
    let collectionView = new CollectionView({
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
      updatable: true
    }, viewDataProvider, loginService, feedbackService).appendTo(this);
    this.once("appear", () => {
      if (!this.get("data")) {
        this.initializeItems();
      }
    });
    this.on("change:data", (widget, data) => {
      collectionView.set("items", data);
    });
    this.once("change:data", () => {
      collectionView.animate({opacity: 1}, {duration: 250});
      loadingIndicator.dispose();
    });
  }

  initializeItems() {
    return this._viewDataProvider.getPreviewCategories()
      .then(previewCategories => this.set("data", previewCategories));
  }
}
