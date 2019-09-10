import { Tab, TabProperties, ActivityIndicator } from "tabris";
import { getById, component, resolve } from "tabris-decorators";
import TabrisConCollectionView from "../components/collectionView/TabrisConCollectionView";
import getImage from "../helpers/getImage";
import texts from "../resources/texts";
import { logError } from "../errors";
import ViewDataProvider from "../ViewDataProvider";

@component export default class Tracks extends Tab {

  @getById private readonly tracksList: TabrisConCollectionView;
  @getById private readonly activityIndicator: ActivityIndicator;

  private _data: any = null;

  constructor(properties: TabProperties) {
    super();
    this.set({
      id: "tracks",
      title: texts.TRACKS_PAGE_TITLE,
      image: getImage("tracks"),
      selectedImage: getImage("tracks_selected"),
      ...properties
    });
    this.append(
      <widgetCollection>
        <TabrisConCollectionView
            id="tracksList"
            left={0} top={0} right={0} bottom={0} opacity={0}
            updatable={true} />
        <activityIndicator
            id="activityIndicator"
            centerX={0} centerY={0} />
      </widgetCollection>
    );
    this.registerEventHandlers();
  }

  set data(data: any) {
    if (this._data === null) {
      this.activityIndicator.dispose();
      this.tracksList.animate({ opacity: 1 }, { duration: 250 });
    }
    this._data = data;
    this.tracksList.items = data;
  }

  get data() {
    return this._data;
  }

  private registerEventHandlers() {
    this.once("appear", () => {
      if (this.data === null) {
        this.initializeItems();
      }
    });
  }

  private async initializeItems() {
    try {
      this.data = await resolve(ViewDataProvider).getPreviewCategories();
    } catch (ex) {
      logError(ex);
    }
  }

}
