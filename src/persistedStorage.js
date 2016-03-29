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

export function setPreviewCategories(value, dataSource = config.DATA_SOURCE) {
  setValue(PREVIEW_CATEGORIES, value, dataSource);
}

export function setCategories(value, dataSource = config.DATA_SOURCE) {
  setValue(CATEGORIES, value, dataSource);
}

export function setSessions(value, dataSource = config.DATA_SOURCE) {
  setValue(SESSIONS, value, dataSource);
}

export function setKeynotes(value, dataSource = config.DATA_SOURCE) {
  setValue(KEYNOTES, value, dataSource);
}

export function setBlocks(value, dataSource = config.DATA_SOURCE) {
  setValue(BLOCKS, value, dataSource);
}

/* get functions */
export function getAttendedSessions() {
  let attendedSessions = localStorage.getItem(ATTENDED_SESSIONS) || "[]";
  return JSON.parse(attendedSessions);
}

export function getPreviewCategories(dataSource = config.DATA_SOURCE) {
  return getValue(PREVIEW_CATEGORIES, dataSource);
}

export function getCategories(dataSource = config.DATA_SOURCE) {
  return getValue(CATEGORIES, dataSource);
}

export function getSessions(dataSource = config.DATA_SOURCE) {
  return getValue(SESSIONS, dataSource);
}

export function getKeynotes(dataSource = config.DATA_SOURCE) {
  return getValue(KEYNOTES, dataSource);
}

export function getBlocks(dataSource = config.DATA_SOURCE) {
  return getValue(BLOCKS, dataSource);
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

function setValue(property, value, dataSource) {
  let itemObject = {};
  itemObject[dataSource] = value;
  localStorage.setItem(property, JSON.stringify(itemObject));
}

function getValue(property, dataSource) {
  let itemString = localStorage.getItem(property);
  return itemString && itemString !== "undefined" ? JSON.parse(itemString)[dataSource] : null;
}

function remove(property) {
  localStorage.removeItem(property);
}
