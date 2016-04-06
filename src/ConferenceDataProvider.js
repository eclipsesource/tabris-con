/*globals Promise: true*/
import * as persistedStorage from "./persistedStorage";
import * as alert from "./components/alert";
import config from "./configs/config";
import * as ConferenceDataFactory from "./ConferenceDataFactory";

export default class {
  constructor(bundledConferenceData) {
    this._bundledConferenceData = bundledConferenceData;
  }

  setNewDataFetcher(newDataFetcher) {
    this._newDataFetcher = newDataFetcher;
  }

  get() {
    this._handleUWP();

    if (this._conferenceData) {
      return Promise.resolve(this._conferenceData);
    }

    this._handleAppUpgrade();

    if (!config.SERVICE_URL) {
      return this._useBundledData();
    }

    return this._newDataFetcher.fetch()
      .then(rawData => {
        if (rawData) {
          let conferenceData = ConferenceDataFactory.createFromRawData(config, rawData);
          persistedStorage.setConferenceData(conferenceData);
        } else {
          this._fallBackToPresentData({fetchFailed: false});
        }
      })
      .catch(e => {
        console.log(e);
        console.log(e.stack);
        this._fallBackToPresentData({fetchFailed: true});
      })
      .then(() => {
        this._conferenceData = persistedStorage.getConferenceData();
        return this._conferenceData;
      });
  }

  _useBundledData() {
    persistedStorage.setConferenceData(this._bundledConferenceData);
    this._conferenceData = persistedStorage.getConferenceData();
    return Promise.resolve(this._conferenceData);
  }

  invalidateCache() {
    this._conferenceData = null;
  }

  _handleUWP() {
    if (device.platform === "UWP") {
      if (!this._conferenceData) {
        this._conferenceData = this._bundledConferenceData;
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

  _fallBackToPresentData(options) {
    let dataStored = persistedStorage.conferenceDataStored();
    if (options.fetchFailed || !dataStored) {
      alert.show(this._dataMayBeOutdatedMessage(), "Warning", "OK");
    }
    if (!dataStored) {
      persistedStorage.setConferenceData(this._bundledConferenceData);
    }
  }

  _dataMayBeOutdatedMessage() {
    return "We could not determine whether newer conference data is available. Shown data may be outdated.";
  }

}
