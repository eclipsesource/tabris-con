/*globals Promise: true*/
import * as persistedStorage from "./persistedStorage";
import * as DataExtractorFactory from "./DataExtractorFactory";
import InitialData from "./InitialData";
import * as alert from "./components/alert";
import config from "./config";

export default class {
  constructor(newDataFetcher, initialData) {
    this._newDataFetcher = newDataFetcher;
    this._initialData = initialData;
  }

  get() {
    this._handleUWP();
    if (this._conferenceData) {
      return Promise.resolve(this._conferenceData);
    }
    this._handleAppUpgrade();
    return this._newDataFetcher.fetch()
      .then(data => {
        if (data) {
          this._persistData(data);
        } else {
          this._handleFallingBackToOldData({fetchFailed: false});
        }
      })
      .catch((e) => {
        console.log(e);
        console.log(e.stack);
        this._handleFallingBackToOldData({fetchFailed: true});
      })
      .then(() => {
        this._conferenceData = this._getDataFromStorage();
        return this._conferenceData;
      });
  }

  invalidateCache() {
    this._conferenceData = null;
  }

  _handleUWP() {
    if (device.platform === "UWP") {
      if (!this._conferenceData) {
        let dataExtractor = DataExtractorFactory.create(config, this._initialData);
        this._conferenceData = {
          sessions: dataExtractor.extractSessions(),
          previewCategories: dataExtractor.extractPreviewCategories(),
          categories: dataExtractor.extractCategories(),
          keynotes: dataExtractor.extractKeynotes(),
          blocks: dataExtractor.extractBlocks()
        };
      }
    }
  }

  _handleAppUpgrade() {
    let currentVersion = tabris._client.get("tabris.App", "version");
    let appVersion = localStorage.getItem("appVersion");
    if (currentVersion !== appVersion && device.platform !== "UWP") { // TODO: also handle on Windows when client supports app version
      persistedStorage.removeConferenceData();
    }
    localStorage.setItem("appVersion", currentVersion);
  }

  _handleFallingBackToOldData(options) {
    let dataStored = persistedStorage.conferenceDataStored();
    if (options.fetchFailed || !dataStored) {
      alert.show(this._dataMayBeOutdatedMessage(), "Warning", "OK");
    }
    if (!dataStored) {
      this._persistData(InitialData.createFor(config.DATA_FORMAT));
    }
  }

  _persistData(data) {
    let dataExtractor = DataExtractorFactory.create(config, data);
    persistedStorage.setSessions(dataExtractor.extractSessions());
    persistedStorage.setPreviewCategories(dataExtractor.extractPreviewCategories());
    persistedStorage.setCategories(dataExtractor.extractCategories());
    persistedStorage.setKeynotes(dataExtractor.extractKeynotes());
    persistedStorage.setBlocks(dataExtractor.extractBlocks());
  }

  _getDataFromStorage() {
    return {
      sessions: persistedStorage.getSessions(),
      previewCategories: persistedStorage.getPreviewCategories(),
      categories: persistedStorage.getCategories(),
      keynotes: persistedStorage.getKeynotes(),
      blocks: persistedStorage.getBlocks()
    };
  }

  _dataMayBeOutdatedMessage() {
    return "We could not determine whether newer conference data is available. Shown data may be outdated.";
  }

}
