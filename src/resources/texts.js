import {device} from "tabris";

let de = {
  ABOUT_PAGE_TITLE: "Über diese App",
  ABOUT_PAGE_IOS_ICONS_ATTRIBUTION_SUBJECT: "iOS Icons",
  ABOUT_PAGE_ANDROID_ICONS_ATTRIBUTION_SUBJECT: "Android Icons",
  ABOUT_PAGE_ATTRIBUTION_LICENSE_LINK: "LIZENZ",
  ABOUT_PAGE_ATTRIBUTION_NOTICE_LINK: "HINWEIS",
  ABOUT_PAGE_ATTRIBUTION_BY: " von ",
  ABOUT_PAGE_BROUGHT_TO_YOU_BY: " \nwurde entwickelt von",
  ABOUT_PAGE_BUILT_WITH: "Erstellt mit ",
  ABOUT_PAGE_OPEN_SOURCE: "Diese App ist Open Source.",
  ABOUT_PAGE_VIEW_IT_ON: "Code anzeigen auf ",
  NOTICE_PAGE_TITLE: "Benutzung von Icons8 iOS Icons",
  NOTICE_PAGE_NOTICE:
    "Icons8 Icons können nur für Projekte abgeleitet von dem tabris-con Open Source-Projekt verwendet werden:",
  NOTICE_PAGE_LICENSING_DETAILS: "Für Lizenzierungsdetails kontaktieren Sie ",
  MAP_PAGE_TITLE: "Karte",
  TRACKS_PAGE_TITLE: "Tracks",
  TITLE_COLLECTION_VIEW_ITEM_MORE_BUTTON: "MEHR",
  MY_SCHEDULE_PAGE_TITLE: "Mein Zeitplan",
  MY_SCHEDULE_PAGE_BROWSE_SESSIONS: "VORTRÄGE DURCHSUCHEN",
  LOGIN_BUTTON: "Anmelden",
  LOGOUT_BUTTON: "Abmelden",
  LOGIN_PAGE_TITLE: "Anmelden",
  INFO_TOAST_SESSION_ADDED: "Vortrag hinzugefügt.",
  INFO_TOAST_SESSION_REMOVED: "Vortrag entfernt.",
  INFO_TOAST_ACTION: "ZEIGE MEINEN ZEITPLAN",
  REMOTE_SERVICE_SESSION_EXPIRED_OR_SERVICE_UNAVAILABLE:
    "Sitzung abgelaufen oder Dienst unerreichbar. Melden Sie sich bitte nochmal an.",
  REMOTE_SERVICE_FEEDBACK_ALREADY_SUBMITTED: "Feedback für diesen Vortrag wurde bereits gesendet.",
  REMOTE_SERVICE_COULD_NOT_SUBMIT_EVALUATION: "Feedback konnte nicht gesendet werden.",
  DIALOG_ERROR: "Fehler",
  DIALOG_OK: "OK",
  DIALOG_WARNING: "Warnung",
  DATA_MAY_BE_OUTDATED_MESSAGE:
    "Wir konnten nicht ermitteln, ob aktuellere Konferenzdaten zur Verfügung stehen. Angezeigte Daten können " +
    "veraltet sein.",
  TRACKS_PAGE_KEYNOTES_TITLE: "Keynotes",
  FEEDBACK_NOT_LOGGED_IN_ERROR: "Bitte melden Sie sich an um Feedback zu senden.",
  FEEDBACK_SUBMITTED_MESSAGE: "Feedback für diesen Vortrag abgeschickt.",
  FEEDBACK_LOGIN_AGAIN_MESSAGE: "Bitte melden Sie sich nochmal an, um Feedback abzugeben.",
  FEEDBACK_CONNECT_TO_THE_INTERNET_MESSAGE: "Sie brauchen eine aktive Internetverbindung um Feedback abzugeben.",
  FEEDBACK_SOMETHING_WENT_WRONG: "Etwas ist schiefgelaufen. Bitte versuchen Sie Ihr Feedback später abzugeben.",
  COULD_NOT_FETCH_DATA_ERROR: "Daten konnten nicht abgerufen werden.",
  SERVER_TIMEOUT_ERROR: "Zeitüberschreitung der Anforderung. Bitte versuchen Sie es später noch einmal.",
  LOGIN_ACTION_TITLE: "Anmelden",
  PROFILE_ACTION_TITLE: "Konto",
  SESSION_PAGE_FEEDBACK_BUTTON: "Feedback abgeben",
  FEEDBACK_PAGE_TITLE: "Feedback",
  FEEDBACK_PAGE_MESSAGE: "Hat Ihnen dieser Vortrag gefallen?",
  FEEDBACK_PAGE_COMMENT: "Kommentar...",
  FEEDBACK_PAGE_SUBMIT_BUTTON: "Abschicken",
  PROFILE_PAGE_TITLE: "Konto",
  SESSION_PAGE_SPEAKERS: "Referenten",
  SESSION_PAGE_OTHER_SESSIONS_LINK: "Andere Vorträge zur selben Zeit",
  SESSIONS_PAGE_TITLE_LOADING: "Lädt..."
};

let en = {
  ABOUT_PAGE_TITLE: "About",
  ABOUT_PAGE_IOS_ICONS_ATTRIBUTION_SUBJECT: "iOS icons",
  ABOUT_PAGE_ANDROID_ICONS_ATTRIBUTION_SUBJECT: "Android icons",
  ABOUT_PAGE_ATTRIBUTION_LICENSE_LINK: "LICENSE",
  ABOUT_PAGE_ATTRIBUTION_NOTICE_LINK: "NOTICE",
  ABOUT_PAGE_ATTRIBUTION_BY: " by ",
  ABOUT_PAGE_BROUGHT_TO_YOU_BY: " app\nis brought to you by",
  ABOUT_PAGE_BUILT_WITH: "Built with ",
  ABOUT_PAGE_OPEN_SOURCE: "This app is open source.",
  ABOUT_PAGE_VIEW_IT_ON: "View it on ",
  NOTICE_PAGE_TITLE: "Usage of Icon8 iOS icons",
  NOTICE_PAGE_NOTICE:
    "Icon8 icons may only be used for projects derived from the tabris-con open-source project:",
  NOTICE_PAGE_LICENSING_DETAILS: "For licensing details, contact ",
  MAP_PAGE_TITLE: "Map",
  TRACKS_PAGE_TITLE: "Tracks",
  TITLE_COLLECTION_VIEW_ITEM_MORE_BUTTON: "MORE",
  MY_SCHEDULE_PAGE_TITLE: "My Schedule",
  MY_SCHEDULE_PAGE_BROWSE_SESSIONS: "BROWSE SESSIONS",
  LOGIN_BUTTON: "Login",
  LOGOUT_BUTTON: "Logout",
  LOGIN_PAGE_TITLE: "Login",
  INFO_TOAST_SESSION_ADDED: "Session added.",
  INFO_TOAST_SESSION_REMOVED: "Session added.",
  INFO_TOAST_ACTION: "SHOW \"MY SCHEDULE\"",
  REMOTE_SERVICE_SESSION_EXPIRED_OR_SERVICE_UNAVAILABLE:
    "Session expired or evaluations service unavailable. Please log in again.",
  REMOTE_SERVICE_FEEDBACK_ALREADY_SUBMITTED: "Evaluation already submitted for this talk.",
  REMOTE_SERVICE_COULD_NOT_SUBMIT_EVALUATION: "Could not submit evaluation.",
  DIALOG_ERROR: "Error",
  DIALOG_OK: "OK",
  DIALOG_WARNING: "Warning",
  DATA_MAY_BE_OUTDATED_MESSAGE:
    "We could not determine whether newer conference data is available. Shown data may be outdated.",
  TRACKS_PAGE_KEYNOTES_TITLE: "Keynotes",
  COULD_NOT_FETCH_DATA_ERROR: "Could not fetch data.",
  FEEDBACK_NOT_LOGGED_IN_ERROR: "Please login to give feedback.",
  FEEDBACK_SUBMITTED_MESSAGE: "Feedback for this session was submitted.",
  FEEDBACK_LOGIN_AGAIN_MESSAGE: "Please login again to give feedback.",
  FEEDBACK_CONNECT_TO_THE_INTERNET_MESSAGE: "Connect to the Internet to give feedback.",
  FEEDBACK_SOMETHING_WENT_WRONG: "Something went wrong. Try giving feedback later.",
  SERVER_TIMEOUT_ERROR: "Server timeout. Please try again later.",
  LOGIN_ACTION_TITLE: "Login",
  PROFILE_ACTION_TITLE: "Profile",
  SESSION_PAGE_FEEDBACK_BUTTON: "Give feedback",
  FEEDBACK_PAGE_TITLE: "Feedback",
  FEEDBACK_PAGE_MESSAGE: "Did you enjoy this session?",
  FEEDBACK_PAGE_COMMENT: "Comment...",
  FEEDBACK_PAGE_SUBMIT_BUTTON: "Submit",
  PROFILE_PAGE_TITLE: "Profile",
  SESSION_PAGE_SPEAKERS: "Speakers",
  SESSION_PAGE_OTHER_SESSIONS_LINK: "Other sessions at the same time",
  SESSIONS_PAGE_TITLE_LOADING: "Loading..."
};

export default isGerman() ? de : en;

function isGerman() {
  let lang = device.get("language");
  return lang && lang.split("-")[0] === "de";
}
