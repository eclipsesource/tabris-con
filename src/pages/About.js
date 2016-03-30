import getImage from "../helpers/getImage";
import Navigatable from "./Navigatable";
import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";
import colors from "../resources/colors";
import config from "../configs/config";
import Link from "../components/Link";
import {ImageView, TextView, Composite, ScrollView} from "tabris";
import IconNoticePage from "./IconNoticePage";

export default class extends Navigatable {
  constructor({viewDataProvider}) {
    super({
      configuration: {
        id: "about",
        title: "About",
        image: getImage.forDevicePlatform("about_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
        left: 0, top: 0, right: 0, bottom: 0
      },
      viewDataProvider
    });
    let scrollView = new ScrollView({left: 0, top: 0, right: 0, bottom: 0}).appendTo(this);
    let container = new Composite({id: "container"}).appendTo(scrollView);
    new ImageView({
      centerX: 0, top: "8%",
      id: "logo",
      image: getImage.common("about_logo")
    }).appendTo(container);
    createVendorAttribution().appendTo(container);
    new TextView({
      id: "version",
      centerX: 0, top: ["#vendorAttribution", sizes.MARGIN],
      text: "v" + tabris._client.get("tabris.App", "version")
    }).appendTo(container);
    createAttributionsList([
      {
        subject: "iOS icons",
        author: {name: "Icons8", url: "https://icons8.com/"},
        information: {label: "NOTICE", page: IconNoticePage}
      }, {
        subject: "Android icons",
        author: {name: "Material Design Icons", url: "https://materialdesignicons.com/"},
        information: {label: "LICENSE", url: "https://github.com/Templarian/MaterialDesign/blob/master/license.txt"}
      }
    ]).appendTo(container);
    createProjectAttribution().appendTo(container);
    createTabrisJsAttribution().appendTo(container);
    this.on("resize", function(widget, bounds) {
      container.set({left: 0, top: 0, right: 0, height: calculateContainerHeight(bounds)});
    });
  }
}

function calculateContainerHeight(scrollViewBounds) {
  if (scrollViewBounds.height < sizes.ABOUT_CONTENT_MIN_HEIGHT) {
    return sizes.ABOUT_CONTENT_MIN_HEIGHT;
  }
  return scrollViewBounds.height;
}

function createTabrisJsAttribution() {
  let tabrisJsAttribution = new Composite({left: 0, top: "58%", right: 0});
  let container = new Composite({centerX: 0, top: 0, height: 48}).appendTo(tabrisJsAttribution);
  new ImageView({
    left: 0, top: 0, width: 48, height: 48,
    image: getImage.common("tabrisjs_logo")
  }).appendTo(container);
  new TextView({
    left: "prev()", centerY: 0,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    text: "Built with "
  }).appendTo(container);
  new Link({left: "prev()", centerY: 0, url: "http://www.tabrisjs.com", text: "Tabris.js"}).appendTo(container);
  return tabrisJsAttribution;
}

function createVendorAttribution() {
  let vendorAttribution = new Composite({
    id: "vendorAttribution",
    left: 0, top: ["#logo", sizes.MARGIN_LARGE], right: 0
  });
  let firstLine = new TextView({
    centerX: 0, top: 0,
    font: fontToString({weight: "bold", size: sizes.FONT_LARGE}),
    alignment: "center",
    text: config.CONFERENCE_NAME + " app\nis brought to you by"
  }).appendTo(vendorAttribution);
  new Link({
    centerX: 0, top: firstLine,
    font: fontToString({weight: "bold", size: sizes.FONT_LARGE}),
    text: config.VENDOR,
    url: config.VENDOR_WEBSITE
  }).appendTo(vendorAttribution);
  return vendorAttribution;
}

function createProjectAttribution() {
  let projectAttribution = new Composite({
    id: "projectAttribution",
    left: sizes.MARGIN_LARGE, bottom: ["#attributionsList", sizes.MARGIN_LARGE], right: sizes.MARGIN_LARGE
  });
  let firstLine = new TextView({
    left: 0, top: 0, right: 0,
    alignment: "center",
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    text: "This app is open source."
  }).appendTo(projectAttribution);
  let secondLine = new Composite({centerX: 0, top: firstLine}).appendTo(projectAttribution);
  let seeSourceText = new TextView({
    left: 0, top: 0,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    text: "View it on "
  }).appendTo(secondLine);
  new Link({text: "GitHub", url: config.PROJECT_URL, left: seeSourceText, top: 0}).appendTo(secondLine);
  return projectAttribution;
}

function createAttributionsList(attributions) {
  let attributionsList = new Composite({
    id: "attributionsList",
    left: sizes.MARGIN_LARGE, bottom: sizes.MARGIN, right: sizes.MARGIN_LARGE
  });
  attributions.forEach(attribution => {
    createAttributionRow(attribution).appendTo(attributionsList);
    if (attributions.indexOf(attribution) !== attributions.length - 1) {
      createAttributionListSeparator().appendTo(attributionsList);
    }
  });
  return attributionsList;
}

function createAttributionRow(attribution) {
  let row = new Composite({left: 0, top: "prev()", right: 0, height: sizes.ATTRIBUTION_LIST_ROW_HEIGHT});
  new TextView({
    left: 0, centerY: 0,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR,
    font: fontToString({size: sizes.FONT_SMALL}),
    text: attribution.subject + " by "
  }).appendTo(row);
  new Link({
    left: "prev()", centerY: 0, text: attribution.author.name, url: attribution.author.url,
    font: fontToString({size: sizes.FONT_SMALL})
  }).appendTo(row);
  new Link({
    right: 0, centerY: 0,
    text: attribution.information.label,
    page: attribution.information.page,
    url: attribution.information.url,
    font: fontToString({size: sizes.FONT_SMALL})
  }).appendTo(row);
  return row;

}
function createAttributionListSeparator() {
  return new Composite({
    left: 0, top: "prev()", right: 0, height: 1,
    background: colors.LINE_SEPARATOR_COLOR
  });
}
