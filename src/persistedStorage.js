import _ from "lodash";
import config from "./configs/config";

export const ATTENDED_SESSIONS = "attendedSessions";
export const PREVIEW_CATEGORIES = "previewCategories";
export const CATEGORIES = "categories";
export const SESSIONS = "sessions";
export const KEYNOTES = "keynotes";
export const BLOCKS = "blocks";
export const SINGLE_SESSIONS_PRESELECTED = "singleSessionsPreselected";

export function addAttendedSessionId(sessionId) {
  let attendedSessions = getAttendedSessions();
  if (!_.some(attendedSessions, el => el === sessionId)) {
    attendedSessions.push(sessionId);
  }
  let attendedSessionsString = JSON.stringify(attendedSessions);
  localStorage.setItem(ATTENDED_SESSIONS, attendedSessionsString);
}

export function removeAttendedSessionId(sessionId) {
  let attendedSessions = getAttendedSessions();
  _.pull(attendedSessions, sessionId);
  let attendedSessionsString = JSON.stringify(attendedSessions);
  localStorage.setItem(ATTENDED_SESSIONS, attendedSessionsString);
}

export function conferenceDataStored() {
  let data = [
    getSessions(),
    getPreviewCategories(),
    getCategories(),
    getKeynotes(),
    getBlocks()
  ];
  return data.every(data => !!data);
}

export function removeConferenceData() {
  removeSessions();
  removePreviewCategories();
  removeCategories();
  removeKeynotes();
  removeBlocks();
}

/* set functions */

export function setPreviewCategories(value, dataType = config.DATA_TYPE) {
  setValue(PREVIEW_CATEGORIES, value, dataType);
}

export function setCategories(value, dataType = config.DATA_TYPE) {
  setValue(CATEGORIES, value, dataType);
}

export function setSessions(value, dataType = config.DATA_TYPE) {
  setValue(SESSIONS, value, dataType);
}

export function setKeynotes(value, dataType = config.DATA_TYPE) {
  setValue(KEYNOTES, value, dataType);
}

export function setBlocks(value, dataType = config.DATA_TYPE) {
  setValue(BLOCKS, value, dataType);
}

export function setConferenceData(conferenceData, dataType = config.DATA_TYPE) {
  setSessions(conferenceData.sessions, dataType);
  setKeynotes(conferenceData.keynotes, dataType);
  setBlocks(conferenceData.blocks, dataType);
  setPreviewCategories(conferenceData.previewCategories, dataType);
  setCategories(conferenceData.categories, dataType);
}

export function setSingleSessionsPreselected(value, dataType = config.DATA_TYPE) {
  setValue(SINGLE_SESSIONS_PRESELECTED, value, dataType);
}

/* get functions */
export function getAttendedSessions() {
  let attendedSessions = localStorage.getItem(ATTENDED_SESSIONS) || "[]";
  return JSON.parse(attendedSessions);
}

export function getPreviewCategories(dataType = config.DATA_TYPE) {
  return getValue(PREVIEW_CATEGORIES, dataType);
}

export function getCategories(dataType = config.DATA_TYPE) {
  return getValue(CATEGORIES, dataType);
}

export function getSessions(dataType = config.DATA_TYPE) {
  return getValue(SESSIONS, dataType);
}

export function getKeynotes(dataType = config.DATA_TYPE) {
  return getValue(KEYNOTES, dataType);
}

export function getBlocks(dataType = config.DATA_TYPE) {
  return getValue(BLOCKS, dataType);
}

export function getConferenceData(dataType = config.DATA_TYPE) {
  return {
    sessions: getSessions(dataType),
    previewCategories: getPreviewCategories(dataType),
    categories: getCategories(dataType),
    keynotes: getKeynotes(dataType),
    blocks: getBlocks(dataType)
  };
}

export function getSingleSessionsPreselected(dataType = config.DATA_TYPE) {
  return getValue(SINGLE_SESSIONS_PRESELECTED, dataType);
}

/* remove functions */

export function removeAttendedSessions() {
  remove(ATTENDED_SESSIONS);
}

export function removePreviewCategories() {
  remove(PREVIEW_CATEGORIES);
}

export function removeCategories() {
  remove(CATEGORIES);
}

export function removeSessions() {
  remove(SESSIONS);
}

export function removeKeynotes() {
  remove(KEYNOTES);
}

export function removeBlocks() {
  remove(BLOCKS);
}

function setValue(property, value, dataType) {
  let itemObject = {};
  itemObject[dataType] = value;
  localStorage.setItem(property, JSON.stringify(itemObject));
}

function getValue(property, dataType) {
  let itemString = localStorage.getItem(property);
  return itemString && itemString !== "undefined" ? JSON.parse(itemString)[dataType] : null;
}

function remove(property) {
  localStorage.removeItem(property);
}
