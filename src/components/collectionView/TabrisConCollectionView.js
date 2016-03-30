import {CollectionView} from "tabris";
import * as viewDataUpdateService from "../../helpers/viewDataUpdateService";
import collectionViewItemConfiguration from "./collectionViewItemConfiguration";

export default class extends CollectionView {
  constructor(configuration, viewDataProvider) {
    super(
      Object.assign({}, configuration, {
        left: 0, top: 0, right: 0, bottom: 0,
        cellType: item => item.type,
        itemHeight: (item, type) => getItemType(type, viewDataProvider).itemHeight,
        initializeCell: (cell, type) => getItemType(type, viewDataProvider).initializeCell(cell)
      })
    );
    this.on("select", (widget, item) => {
      if (item) {
        getItemType(item.type, viewDataProvider).select(widget, item);
      }
    });
    let refreshCallback = collectionView => {
      collectionView.set("refreshIndicator", true);
      viewDataUpdateService.updateData(viewDataProvider)
        .then(() => collectionView.set("refreshIndicator", false));
    };
    let handleUpdatableChange = (collectionView, updatable) => {
      collectionView.set("refreshEnabled", updatable);
      if (updatable) {
        return collectionView.on("refresh", refreshCallback);
      }
      collectionView.off("refresh", refreshCallback);
    };
    this.on("change:updatable", handleUpdatableChange);
    handleUpdatableChange(this, this.get("updatable"));
  }
}

function getItemType(type, viewDataProvider) {
  return collectionViewItemConfiguration[type + "Item"].get(viewDataProvider);
}