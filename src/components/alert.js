let alertShown = false;

export function show(message, title, confirmationButtonText) {
  if (typeof navigator === "undefined" || !navigator.notification) {
    console.error("cordova-plugin-dialogs is not available in this Tabris.js client. " +
      "Alert content: '" + title + ": " + message + "'");
    return;
  }
  if (!alertShown) {
    alertShown = true;
    navigator.notification.alert(message, () => alertShown = false, title, confirmationButtonText);
  }
}
