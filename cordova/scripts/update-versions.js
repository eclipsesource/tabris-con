module.exports = function(context) {
  var cordovaUtil = context.requireCordovaModule("cordova-lib/src/cordova/util");
  var cordovaCommon = context.requireCordovaModule("cordova-common");
  var projectRoot = cordovaUtil.isCordova();
  var xml = cordovaUtil.projectConfig(projectRoot);
  var cfg = new cordovaCommon.ConfigParser(xml);
  var root = cfg.doc.getroot();
  var version = root.attrib["version"];
  var timestamp = createTimestamp();
  root.attrib["android-versionCode"] = timestamp;
  root.attrib["ios-CFBundleVersion"] = timestamp;
  cfg.write();
};

function createTimestamp() {
  // Number of minutes since 1970/01/01.
  return Math.floor(new Date().getTime() / 1000 / 60);
}
