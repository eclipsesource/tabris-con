import fontToString from "../helpers/fontToString";
import Link from "../components/Link";
import {Page, ScrollView, Composite, TextView} from "tabris";
import texts from "../resources/texts";

export default class IconNoticePage extends Page {
  constructor() {
    super();

    let scrollView = new ScrollView({
      left: 0, top: 0, right: 0, bottom: 0
    }).appendTo(this);

    let container = new Composite({
      left: 16, top: 16, right: 16
    }).appendTo(scrollView);

    let title = new TextView({
      id: "title",
      left: 0, top: 0, right: 0,
      font: fontToString({size: 22, weight: "bold"}),
      text: texts.NOTICE_PAGE_TITLE
    }).appendTo(container);

    new TextView({
      left: 0, top: "#title 16", right: 0,
      text: texts.NOTICE_PAGE_NOTICE
    }).appendTo(container);

    let tabrisConLink = new Link({
      id: "tabrisConLink",
      left: 0, top: "prev() 8", right: 0,
      alignment: "center",
      text: "https://github.com/eclipsesource/tabris-con",
      url: "https://github.com/eclipsesource/tabris-con"
    }).appendTo(container);

    new TextView({
      left: 0, top: "#tabrisConLink 8",
      text: texts.NOTICE_PAGE_LICENSING_DETAILS
    }).appendTo(container);

    new Link({
      left: "prev()", top: "#tabrisConLink 8",
      text: "Icons8",
      url: "https://icons8.com/"
    }).appendTo(container);
  }
}
