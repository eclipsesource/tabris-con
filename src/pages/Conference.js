import getImage from "../helpers/getImage";
import Navigatable from "./Navigatable";
import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";
import appConfig from "../configs/config";
import Link from "../components/Link";
import {ImageView, TextView, Composite} from "tabris";
import texts from "../resources/texts";
import moment from "moment-timezone";

var config = appConfig.CONFERENCE_PAGE;

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
    new ImageView({
      centerX: 0, top: "8%",
      id: "logo",
      image: getImage.common("conference_logo")
    }).appendTo(this);
    new TextView({
      id: "date",
      alignment: "center",
      font: fontToString({weight: "bold", size: 18}),
      centerX: 0, top: ["prev()", sizes.MARGIN],
      text: [day(config.START_DAY), day(config.END_DAY)].join(" - ")
    }).appendTo(this);
    new TextView({
      id: "location",
      alignment: "center",
      font: fontToString({weight: "bold", size: 18}),
      centerX: 0, top: "prev()",
      text: config.LOCATION
    }).appendTo(this);
    let linksArea = new Composite({id: "linksArea", top: "prev()", bottom: 0, left: 0, right: 0}).appendTo(this);
    let linksContainer = new Composite({id: "linksContainer", centerX: 0, centerY: 0}).appendTo(linksArea);
    createSocialLinks(linksContainer, ["twitter", "googleplus", "xing"]);
  }
}

function createSocialLinks(linksContainer, socialServices) {
  socialServices.forEach(service => {
    let title = config[`${service.toUpperCase()}_TITLE`];
    let url = config[`${service.toUpperCase()}_URL`];
    if (title && url) {
      let tag = config[`${service.toUpperCase()}_TAG`];
      createSocialLink({service, title, url, tag}).appendTo(linksContainer);
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
