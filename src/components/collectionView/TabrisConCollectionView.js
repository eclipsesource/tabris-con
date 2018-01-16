import {CollectionView} from "tabris";
import collectionViewItemConfiguration from "./collectionViewItemConfiguration";
import * as viewDataUpdateService from "../../helpers/viewDataUpdateService";
import config from "../../configs/config";

export default class TabrisConCollectionView extends CollectionView {

  constructor(configuration) {
    super(configuration);
    this.set({
      cellType: index => this.items[index].type,
      cellHeight: (item, type) => this._getItemType(type).cellHeight,
      createCell: (type) => this._getItemType(type).createCell(type),
      updateCell: this._updateCell
    });
    this.on("select", ({index}) => {
      let item = this.items[index];
      if (item) {
        this._getItemType(item.type).select(item);
      }
    });
  }

  _updateCell(cell, index) {
    if (this._getItemType(this.items[index].type).updateCell) {
      this._getItemType(this.items[index].type).updateCell(cell, this.items[index]);
    }
  }

  set viewDataProvider(viewDataProvider) {
    this._viewDataProvider = viewDataProvider;
  }

  get viewDataProvider() {
    return this._viewDataProvider;
  }

  set loginService(loginService) {
    this._loginService = loginService;
  }

  get loginService() {
    return this._loginService;
  }

  set feedbackService(feedbackService) {
    this._feedbackService = feedbackService;
  }

  get feedbackService() {
    return this._feedbackService;
  }

  set updatable(updatable) {
    this._updatable = updatable;
    if (!(config.SERVICES && config.SERVICES.SESSIONS)) {
      return;
    }
    this.refreshEnabled = this._updatable;
    if (this._updatable) {
      this.on("refresh", this._onRefresh);
    } else {
      this.off("refresh", this._onRefresh);
    }
  }

  get updatable() {
    return this._updatable;
  }

  set items(items) {
    this._items = items;
    this.itemCount = this._items.length;
  }

  get items() {
    return this._items;
  }

  _onRefresh() {
    this.refreshIndicator = true;
    viewDataUpdateService.updateData(this._viewDataProvider)
      .then(() => this.refreshIndicator = false);
  }

  _getItemType(type) {
    return collectionViewItemConfiguration[type + "Item"].get({
      viewDataProvider: this.viewDataProvider,
      loginService: this.loginService,
      feedbackService: this.feedbackService
    });
  }

}
