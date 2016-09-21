/*globals Promise: true*/
import * as persistedStorage from "./persistedStorage";
import InfoToast from "./components/InfoToast";
import config from "./configs/config";
import * as ConferenceDataFactory from "./ConferenceDataFactory";
import texts from "./resources/texts";
import ConfigurationDate from "./ConfigurationDate";
import getSessionsInTimeframe from "./getSessionsInTimeframe";
import {addAttendedSessionId} from "./helpers/attendedSessionService";

export default class {
  constructor(bundledConferenceData) {
    this._bundledConferenceData = bundledConferenceData;
  }

  setNewDataFetcher(newDataFetcher) {
    this._newDataFetcher = newDataFetcher;
  }

  get() {
    this._handleWindows();

    if (this._conferenceData) {
      return Promise.resolve(this._conferenceData);
    }

    this._handleAppUpgrade();

    if (!(config.SERVICES && config.SERVICES.SESSIONS)) {
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
        this._setConferenceData(persistedStorage.getConferenceData());
        return this._conferenceData;
      });
  }

  _setConferenceData(data) {
    this._conferenceData = data;
    this._preselectSingleBlockSessions(data);
  }

  _preselectSingleBlockSessions(data) {
    if (data) {
      if (persistedStorage.getSingleSessionsPreselected()) {
        return;
      }
      config.FREE_BLOCKS.forEach(block => {
        let date1 = new ConfigurationDate(config, block[0]);
        let date2 = new ConfigurationDate(config, block[1]);
        let sessions = getSessionsInTimeframe(data, date1.toJSON(), date2.toJSON());
        if (sessions.length === 1) {
          addAttendedSessionId(sessions[0].id, {focus: false});
        }
      });
      persistedStorage.setSingleSessionsPreselected(true);
    }
  }

  _useBundledData() {
    persistedStorage.setConferenceData(this._bundledConferenceData);
    this._setConferenceData(persistedStorage.getConferenceData());
    return Promise.resolve(this._conferenceData);
  }

  invalidateCache() {
    this._setConferenceData(null);
  }

  _handleWindows() {
    if (device.platform === "windows") {
      if (!this._conferenceData) {
        this._setConferenceData(this._bundledConferenceData);
      }
    }
  }

  _handleAppUpgrade() {
    let currentVersion = tabris._client.get("tabris.App", "version");
    let appVersion = localStorage.getItem("appVersion");
    if (currentVersion !== appVersion && device.platform !== "windows") { // TODO: also handle on Windows when client supports app version
      persistedStorage.removeConferenceData();
    }
    localStorage.setItem("appVersion", currentVersion);
  }

  _fallBackToPresentData(options) {
    let dataStored = persistedStorage.conferenceDataStored();
    if (options.fetchFailed || !dataStored) {
      InfoToast.show({messageText: texts.DATA_UPDATE_FAILED_MESSAGE});
    }
    if (!dataStored) {
      persistedStorage.setConferenceData(this._bundledConferenceData);
    }
  }

}
