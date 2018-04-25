import { Tab, TabProperties, ActivityIndicator } from "tabris";
import { getById, property, component } from "tabris-decorators";
import TabrisConCollectionView from "../components/collectionView/TabrisConCollectionView";
import ViewDataProvider from "../ViewDataProvider";
import CodFeedbackService from "../helpers/CodFeedbackService";
import LoginService from "../helpers/CodLoginService";
import getImage from "../helpers/getImage";
import texts from "../resources/texts";
import { logError } from "../errors";

interface TracksProperties {
  loginService: LoginService;
  feedbackService: CodFeedbackService;
  viewDataProvider: ViewDataProvider;
}

@component export default class Tracks extends Tab {

  public jsxProperties: JSX.TabProperties & TracksProperties;
  public tsProperties: TabProperties & TracksProperties;

  @getById private readonly tracksList: TabrisConCollectionView;
  @getById private readonly activityIndicator: ActivityIndicator;
  @property private readonly viewDataProvider: any;
  @property private readonly loginService: any;
  @property private readonly feedbackService: any;

  private _data: any = null;

  constructor(properties: TabProperties & TracksProperties) {
    super();
    this.set({
      id: "tracks",
      title: texts.TRACKS_PAGE_TITLE,
      image: getImage.forDevicePlatform("tracks"),
      selectedImage: getImage.forDevicePlatform("tracks_selected"),
      ...properties
    });
    this.append(
      <widgetCollection>
        <TabrisConCollectionView
            id="tracksList"
            left={0} top={0} right={0} bottom={0} opacity={0}
            updatable={true}
            viewDataProvider={this.viewDataProvider}
            loginService={this.loginService}
            feedbackService={this.feedbackService} />
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
      this.data = await this.viewDataProvider.getPreviewCategories();
    } catch (ex) {
      logError(ex);
    }
  }

}
