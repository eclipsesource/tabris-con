/*globals Promise:true*/

import _ from "lodash";
import {shared} from "tabris-decorators";
import getSessionsInTimeframe from "./getSessionsInTimeframe";
import {logError} from "./errors";
import AttendedBlockProvider from "./AttendedBlockProvider";
import {resolve} from "tabris-decorators";
import CodRemoteService from "./CodRemoteService";
import CodLoginService from "./helpers/CodLoginService";
import ViewDataAdapter from "./ViewDataAdapter";
import CodFeedbackService from "./helpers/CodFeedbackService";
import ConferenceDataProvider from "./ConferenceDataProvider";
import conferenceConfig from "./configs/config";

@shared export default class ViewDataProvider {
  constructor(config = conferenceConfig) {
    this._conferenceDataProvider = resolve(ConferenceDataProvider);
    this._attendedBlockProvider = resolve(AttendedBlockProvider);
    this._viewDataAdapter = resolve(ViewDataAdapter);
    this._remoteService = resolve(CodRemoteService);
    this._loginService = resolve(CodLoginService);
    this._feedbackService = resolve(CodFeedbackService);
    this._config = config;
  }

  getKeynote(keynoteId) {
    return this._conferenceDataProvider.get().then(data => {
      let keynote = _.find(data.keynotes, keynote => keynote.id === keynoteId);
      return this._viewDataAdapter.adaptKeynote(keynote);
    });
  }

  getPreviewCategories() {
    return this._conferenceDataProvider.get().then(data => {
      return this._viewDataAdapter.adaptPreviewCategories(data.previewCategories);
    });
  }

  getOtherSessionsInTimeframe(date1, date2, sessionId) {
    return this._conferenceDataProvider.get().then(data => {
      let sessions = getSessionsInTimeframe(data, date1.toJSON(), date2.toJSON())
        .filter(value => value.id !== sessionId);
      if (sessions.length > 0) {
        return this._viewDataAdapter.adaptCategory({sessions});
      }
      return [];
    });
  }

  getCategory(categoryId) {
    return this._conferenceDataProvider.get().then(data => {
      let category = _.find(data.categories, category => category.id === categoryId);
      return this._viewDataAdapter.adaptCategory(category);
    });
  }

  getKeynotes() {
    return this._conferenceDataProvider.get().then(data => this._viewDataAdapter.adaptKeynotes(data.keynotes));
  }

  getSession(sessionId) {
    return this._conferenceDataProvider.get().then(data => {
      let session = _.find(data.sessions, session => session.id === sessionId);
      return this._viewDataAdapter.adaptSession(session);
    });
  }

  getBlocks() {
    return Promise.all([this._conferenceDataProvider.get(), this._attendedBlockProvider.getBlocks()])
      .then(values => this._viewDataAdapter.adaptBlocks(_.union(values[0].blocks, values[1])));
  }

  getSessionIdIndicatorStates() {
    if (!this._config.SUPPORTS_FEEDBACK) {
      return Promise.resolve([]);
    }
    return Promise.all([this._attendedBlockProvider.getBlocks(), this._getEvaluations()])
      .then(values => this._feedbackService.getSessionsIndicatorState(values[0], values[1]))
      .catch(e => {
        logError(e);
        return [];
      });
  }

  _getEvaluations() {
    return this._loginService.isLoggedIn() ? this._remoteService.evaluations() : [];
  }

  getSessionsInTimeframe(timestamp1, timestamp2) {
    return this._conferenceDataProvider.get().then(data => {
      let sessions = getSessionsInTimeframe(data, timestamp1, timestamp2);
      return this._viewDataAdapter.adaptCategory({sessions});
    });
  }

  getRemoteService() {
    return this._remoteService;
  }

  invalidateCache() {
    this._conferenceDataProvider.invalidateCache();
  }
}

