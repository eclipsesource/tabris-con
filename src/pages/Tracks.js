import CollectionView from "../components/collectionView/TabrisConCollectionView";
import LoadingIndicator from "../components/LoadingIndicator";
import getImage from "../helpers/getImage";
import texts from "../resources/texts";
import {Tab} from "tabris";

export default class TracksScreen extends Tab {

  constructor({viewDataProvider, loginService, feedbackService}) {
    super({
      id: "tracks",
      title: texts.TRACKS_PAGE_TITLE,
      image: getImage.forDevicePlatform("tracks"),
      selectedImage: getImage.forDevicePlatform("tracks_selected")
    });
    this._viewDataProvider = viewDataProvider;
    this.loadingIndicator = new LoadingIndicator().appendTo(this);
    this.collectionView = new CollectionView({
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
      updatable: true,
      viewDataProvider,
      loginService,
      feedbackService
    }).appendTo(this);
    this.once("appear", () => {
      if (!this.data) {
        this.initializeItems();
      }
    });
  }

  set data(data) {
    if (!this._data) {
      this.collectionView.animate({opacity: 1}, {duration: 250});
      this.loadingIndicator.dispose();
    }
    this._data = data;
    this.collectionView.items = data;
  }

  get data() {
    return this._data;
  }

  initializeItems() {
    return this._viewDataProvider.getPreviewCategories()
      .then(previewCategories => {
        this.data = previewCategories;
      })
      .catch(e => console.log(e));
  }
}
