var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");
var fontToString = require("../../fontToString");
var sizes = require("../../../resources/sizes");
var colors = require("../../../resources/colors");
var config = require("../../../config");
var Link = require("../Link");

exports.create = function() {
  var about = Navigatable.create({
    id: "about",
    title: "About",
    image: getImage.forDevicePlatform("about_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
    left: 0, top: 0, right: 0, bottom: 0
  });
  var scrollView = tabris.create("ScrollView", {left: 0, top: 0, right: 0, bottom: 0}).appendTo(about);
  var container = tabris.create("Composite", {id: "container"}).appendTo(scrollView);
  tabris.create("ImageView", {
    id: "logo",
    centerX: 0, top: "8%",
    image: getImage.common("about_logo")
  }).appendTo(container);
  createVendorAttribution().appendTo(container);
  tabris.create("TextView", {
    id: "version",
    centerX: 0, top: ["#vendorAttribution", sizes.MARGIN],
    text: "v" + tabris._client.get("tabris.App", "version")
  }).appendTo(container);
  createAttributionsList([
    {
      subject: "iOS icons",
      author: {name: "Icons8", url: "https://icons8.com/"},
      information: {label: "NOTICE", page: "IconNoticePage"}
    }, {
      subject: "Android icons",
      author: {name: "Material Design Icons", url: "https://materialdesignicons.com/"},
      information: {label: "LICENSE", url: "https://github.com/Templarian/MaterialDesign/blob/master/license.txt"}
    }
  ]).appendTo(container);
  createProjectAttribution().appendTo(container);
  createTabrisJsAttribution().appendTo(container);
  about.on("resize", function(widget, bounds) {
    container.set({left: 0, top: 0, right: 0, height: calculateContainerHeight(bounds)});
  });
  return about;
};

function calculateContainerHeight(scrollViewBounds) {
  if (scrollViewBounds.height < sizes.ABOUT_CONTENT_MIN_HEIGHT) {
    return sizes.ABOUT_CONTENT_MIN_HEIGHT;
  }
  return scrollViewBounds.height;
}

function createTabrisJsAttribution() {
  var tabrisJsAttribution = tabris.create("Composite", {left: 0, top: "58%", right: 0});
  var container = tabris.create("Composite", {centerX: 0, top: 0, height: 48}).appendTo(tabrisJsAttribution);
  tabris.create("ImageView", {
    left: 0, top: 0, width: 48, height: 48,
    image: getImage.common("tabrisjs_logo")
  }).appendTo(container);
  tabris.create("TextView", {
    left: "prev()", centerY: 0,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    text: "Built with "
  }).appendTo(container);
  Link.create({left: "prev()", centerY: 0, url: "http://www.tabrisjs.com", text: "Tabris.js"}).appendTo(container);
  return tabrisJsAttribution;
}

function createVendorAttribution() {
  var vendorAttribution = tabris.create("Composite", {
    id: "vendorAttribution",
    left: 0, top: ["#logo", sizes.MARGIN_LARGE], right: 0
  });
  var firstLine = tabris.create("TextView", {
    centerX: 0, top: 0,
    font: fontToString({weight: "bold", size: sizes.FONT_LARGE}),
    alignment: "center",
    text: config.CONFERENCE_NAME + " app\nis brought to you by"
  }).appendTo(vendorAttribution);
  Link.create({
    centerX: 0, top: firstLine,
    font: fontToString({weight: "bold", size: sizes.FONT_LARGE}),
    text: config.VENDOR,
    url: config.VENDOR_WEBSITE
  }).appendTo(vendorAttribution);
  return vendorAttribution;
}

function createProjectAttribution() {
  var projectAttribution = tabris.create("Composite", {
    id: "projectAttribution",
    left: sizes.MARGIN_LARGE, bottom: ["#attributionsList", sizes.MARGIN_LARGE], right: sizes.MARGIN_LARGE
  });
  var firstLine = tabris.create("TextView", {
    left: 0, top: 0, right: 0,
    alignment: "center",
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    text: "This app is open source."
  }).appendTo(projectAttribution);
  var secondLine = tabris.create("Composite", {centerX: 0, top: firstLine}).appendTo(projectAttribution);
  var seeSourceText = tabris.create("TextView", {
    left: 0, top: 0,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    text: "View it on "
  }).appendTo(secondLine);
  Link.create({text: "GitHub", url: config.PROJECT_URL, left: seeSourceText, top: 0}).appendTo(secondLine);
  return projectAttribution;
}

function createAttributionsList(attributions) {
  var attributionsList = tabris.create("Composite", {
    id: "attributionsList",
    left: sizes.MARGIN_LARGE, bottom: sizes.MARGIN, right: sizes.MARGIN_LARGE
  });
  attributions.forEach(function(attribution) {
    createAttributionRow(attribution).appendTo(attributionsList);
    if (attributions.indexOf(attribution) !== attributions.length - 1) {
      createAttributionListSeparator().appendTo(attributionsList);
    }
  });
  return attributionsList;
}

function createAttributionRow(attribution) {
  var row = tabris.create("Composite", {left: 0, top: "prev()", right: 0, height: sizes.ATTRIBUTION_LIST_ROW_HEIGHT});
  tabris.create("TextView", {
    left: 0, centerY: 0,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    font: fontToString({size: sizes.FONT_SMALL}),
    text: attribution.subject + " by "
  }).appendTo(row);
  Link.create({
    left: "prev()", centerY: 0, text: attribution.author.name, url: attribution.author.url,
    font: fontToString({size: sizes.FONT_SMALL})
  }).appendTo(row);
  Link.create({
    right: 0, centerY: 0,
    text: attribution.information.label,
    page: attribution.information.page,
    url: attribution.information.url,
    font: fontToString({size: sizes.FONT_SMALL})
  }).appendTo(row);
  return row;
}
function createAttributionListSeparator() {
  return tabris.create("Composite", {
    left: 0, top: "prev()", right: 0, height: 1,
    background: colors.LINE_SEPARATOR_COLOR
  });
}
