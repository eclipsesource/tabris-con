import _ from "lodash";
import config from "./config";

export const ATTENDED_SESSIONS = "attendedSessions";
export const PREVIEW_CATEGORIES = "previewCategories";
export const CATEGORIES = "categories";
export const SESSIONS = "sessions";
export const KEYNOTES = "keynotes";
export const BLOCKS = "blocks";

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

export function setPreviewCategories(value, dataFormat = config.DATA_FORMAT) {
  setValue(PREVIEW_CATEGORIES, value, dataFormat);
}

export function setCategories(value, dataFormat = config.DATA_FORMAT) {
  setValue(CATEGORIES, value, dataFormat);
}

export function setSessions(value, dataFormat = config.DATA_FORMAT) {
  setValue(SESSIONS, value, dataFormat);
}

export function setKeynotes(value, dataFormat = config.DATA_FORMAT) {
  setValue(KEYNOTES, value, dataFormat);
}

export function setBlocks(value, dataFormat = config.DATA_FORMAT) {
  setValue(BLOCKS, value, dataFormat);
}

/* get functions */
export function getAttendedSessions() {
  let attendedSessions = localStorage.getItem(ATTENDED_SESSIONS) || "[]";
  return JSON.parse(attendedSessions);
}

export function getPreviewCategories(dataFormat = config.DATA_FORMAT) {
  return getValue(PREVIEW_CATEGORIES, dataFormat);
}

export function getCategories(dataFormat = config.DATA_FORMAT) {
  return getValue(CATEGORIES, dataFormat);
}

export function getSessions(dataFormat = config.DATA_FORMAT) {
  return getValue(SESSIONS, dataFormat);
}

export function getKeynotes(dataFormat = config.DATA_FORMAT) {
  return getValue(KEYNOTES, dataFormat);
}

export function getBlocks(dataFormat = config.DATA_FORMAT) {
  return getValue(BLOCKS, dataFormat);
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

function setValue(property, value, dataFormat) {
  let itemObject = {};
  itemObject[dataFormat] = value;
  localStorage.setItem(property, JSON.stringify(itemObject));
}

function getValue(property, dataFormat) {
  let itemString = localStorage.getItem(property);
  return itemString && itemString !== "undefined" ? JSON.parse(itemString)[dataFormat] : null;
}

function remove(property) {
  localStorage.removeItem(property);
}
