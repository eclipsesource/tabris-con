import { CollectionView, CollectionViewProperties, Widget } from "tabris";
import collectionViewItemConfiguration from "./collectionViewItemConfiguration";
import * as viewDataUpdateService from "../../helpers/viewDataUpdateService";
import config from "../../configs/config";
import { logError } from "../../errors";

interface TabrisConCollectionViewProperties {
  updatable?: boolean;
  items?: any[];
}

export default class TabrisConCollectionView extends CollectionView {

  public jsxProperties: JSX.CollectionViewProperties & TabrisConCollectionViewProperties;
  public tsProperties: CollectionViewProperties & TabrisConCollectionViewProperties;

  private _updatable: boolean;
  private _items: any[];

  constructor(properties: CollectionViewProperties & TabrisConCollectionViewProperties) {
    super();
    this.set({
      cellType: index => this.items[index].type,
      cellHeight: (item, type) => this.getItemType(type).cellHeight,
      createCell: (type) => this.getItemType(type).createCell(type),
      updateCell: (cell, index) => this._updateCell(cell, index),
      ...properties
    });
    this.delegateSelect();
  }

  set updatable(updatable: boolean) {
    this._updatable = updatable;
    if (!(config.SERVICES && config.SERVICES.SESSIONS)) {
      return;
    }
    this.refreshEnabled = this._updatable;
    if (this._updatable) {
      this.on("refresh", this.onRefresh);
    } else {
      this.off("refresh", this.onRefresh);
    }
  }

  get updatable() {
    return this._updatable;
  }

  set items(items: any[]) {
    this._items = items;
    this._items.forEach(item => item.collectionView = this);
    this.load(this._items.length);
  }

  get items() {
    return this._items;
  }

  private delegateSelect() {
    this.on({select: ({index}) => {
      let item = this.items[index];
      if (item) {
        this.getItemType(item.type).select(item);
      }
    }});
  }

  private onRefresh = async () => {
    this.refreshIndicator = true;
    try {
      await viewDataUpdateService.updateData();
    } catch(e) { logError(e); }
    this.refreshIndicator = false;
  }

  private _updateCell(cell: Widget, index: number) {
    if (this.getItemType(this.items[index].type).updateCell) {
      this.getItemType(this.items[index].type).updateCell(cell, this.items[index]);
    }
  }

  private getItemType(type: string) {
    return collectionViewItemConfiguration[type + "Item"].get();
  }

}
