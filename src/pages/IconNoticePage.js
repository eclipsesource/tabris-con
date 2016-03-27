import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import Link from "../components/Link";
import {Page, ScrollView, Composite, TextView} from "tabris";

export default class extends Page {
  constructor() {
    super({topLevel: false});

    let scrollView = new ScrollView({
      left: 0, top: 0, right: 0, bottom: 0
    }).appendTo(this);

    let container = new Composite({
      left: sizes.MARGIN_LARGE, top: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE
    }).appendTo(scrollView);

    let title = new TextView({
      left: 0, top: 0, right: 0,
      font: fontToString({size: sizes.FONT_XXLARGE, weight: "bold"}),
      text: "Usage of Icon8 iOS icons"
    }).appendTo(container);

    new TextView({
      left: 0, top: [title, sizes.MARGIN_LARGE], right: 0,
      // jscs:disable maximumLineLength
      text: "Icon8 icons may only be used for projects derived from the tabris-con open-source template:"
      // jscs:enable maximumLineLength
    }).appendTo(container);

    let tabrisConLink = new Link({
      alignment: "center",
      text: "https://github.com/eclipsesource/tabris-con",
      url: "https://github.com/eclipsesource/tabris-con",
      left: 0, top: ["prev()", sizes.MARGIN], right: 0
    }).appendTo(container);

    new TextView({
      left: 0, top: [tabrisConLink, sizes.MARGIN],
      text: "For licensing details, contact "
    }).appendTo(container);

    new Link({
      text: "Icons8",
      url: "https://icons8.com/",
      left: "prev()", top: [tabrisConLink, sizes.MARGIN]
    }).appendTo(container);
  }
}
