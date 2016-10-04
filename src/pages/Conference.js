import getImage from "../helpers/getImage";
import Navigatable from "./Navigatable";
import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";
import appConfig from "../configs/config";
import Link from "../components/Link";
import {ImageView, TextView, Composite, ScrollView} from "tabris";
import texts from "../resources/texts";
import moment from "moment-timezone";

var config = appConfig.CONFERENCE_PAGE;

const SPACER_HEIGHT = 16;

export default class extends Navigatable {
  constructor({viewDataProvider}) {
    super({
      configuration: {
        id: "conference",
        title: texts.CONFERENCE_PAGE_TITLE,
        image: getImage.forDevicePlatform("conference_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
        left: 0, top: 0, right: 0, bottom: 0
      },
      viewDataProvider
    });
    let container = new ScrollView({left: 0, top: 0, right: 0, bottom: 0}).appendTo(this);
    new ImageView({
      centerX: 0, top: 0,
      id: "logo",
      image: getImage.common("conference_logo")
    }).appendTo(container);
    new TextView({
      id: "date",
      alignment: "center",
      font: fontToString({weight: "bold", size: 18}),
      left: sizes.MARGIN, right: sizes.MARGIN, top: ["prev()", sizes.MARGIN],
      text: [day(config.START_DAY), day(config.END_DAY)].join(" - ")
    }).appendTo(container);
    new TextView({
      id: "location",
      alignment: "center",
      font: fontToString({weight: "bold", size: 18}),
      left: sizes.MARGIN, right: sizes.MARGIN, top: "prev()",
      text: config.LOCATION
    }).appendTo(container);
    let linksContainer = new Composite({
      left: 0, top: ["prev()", sizes.MARGIN_LARGE], right: 0
    }).appendTo(container);
    createSocialLinks(linksContainer, ["facebook", "twitter", "googleplus", "xing", "website"]);
    new TextView({
      id: "conferenceInfo",
      left: sizes.MARGIN_XLARGE, right: sizes.MARGIN_XLARGE, top: ["prev()", sizes.MARGIN_XLARGE],
      markupEnabled: true,
      font: "14px sans-serif",
      text: config.CONFERENCE_INFO || ""
    }).appendTo(container);
    if (config.CONFERENCE_INFO) {
      createSpacer().appendTo(container);
    }
  }
}

function createSpacer() {
  return new Composite({left: 0, top: "prev()", right: 0, height: SPACER_HEIGHT});
}

function createSocialLinks(linksContainer, socialServices) {
  socialServices.forEach(service => {
    let title = config[`${service.toUpperCase()}_TITLE`];
    let url = config[`${service.toUpperCase()}_URL`];
    if (title && url) {
      createSocialLink({service, title, url, tag: config[`${service.toUpperCase()}_TAG`]}).appendTo(linksContainer);
    }
  });
}

function createSocialLink({service, title, url, tag}) {
  let container = new Composite({width: 272, top: ["prev()", sizes.MARGIN_LARGE], centerX: 0});
  new ImageView({
    left: 0, width: 24, height: 24, centerY: 0,
    image: getImage.common(service)
  }).appendTo(container);
  new Link({
    font: fontToString({size: 18}),
    left: ["prev()", sizes.MARGIN], centerY: 0,
    url, text: title
  }).appendTo(container);
  if (tag) {
    new TextView({
      font: fontToString({size: 18}),
      left: ["prev()", sizes.MARGIN], centerY: 0,
      text: "(" + tag + ")"
    }).appendTo(container);
  }
  return container;
}

function day(day) {
  return moment.tz(day, "DD.MM.YYYY", appConfig.CONFERENCE_TIMEZONE).format("ll");
}
