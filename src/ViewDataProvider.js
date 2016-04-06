/*globals Promise:true*/

import _ from "lodash";
import getSessionsInTimeframe from "./getSessionsInTimeframe";

export default class {
  constructor({
    config, conferenceDataProvider, attendedBlockProvider, viewDataAdapter, remoteService, loginService, feedbackService
  }) {
    this._conferenceDataProvider = conferenceDataProvider;
    this._attendedBlockProvider = attendedBlockProvider;
    this._viewDataAdapter = viewDataAdapter;
    this._remoteService = remoteService;
    this._loginService = loginService;
    this._feedbackService = feedbackService;
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
    return getSessionsInTimeframe(this._conferenceDataProvider, date1.toJSON(), date2.toJSON())
      .then(sessions => _.filter(sessions, value => value.id !== sessionId))
      .then(sessions => {
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
    if (!this._config.SUPPORTS_FEEDBACK || !this._loginService.isLoggedIn()) {
      return Promise.resolve([]);
    }
    return Promise.all([this._attendedBlockProvider.getBlocks(), this._remoteService.evaluations()])
      .then(values => this._feedbackService.getSessionsIndicatorState(values[0], values[1]))
      .catch(() => []);
  }

  getSessionsInTimeframe(timestamp1, timestamp2) {
    return getSessionsInTimeframe(this._conferenceDataProvider, timestamp1, timestamp2)
      .then(sessions => this._viewDataAdapter.adaptCategory({sessions: sessions}));
  }

  getRemoteService() {
    return this._remoteService;
  }

  invalidateCache() {
    this._conferenceDataProvider.invalidateCache();
  }
}

