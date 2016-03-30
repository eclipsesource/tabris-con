import sizes from "../../resources/sizes";
import fontToString from "../../helpers/fontToString";
import colors from "../../resources/colors";
import getImage from "../../helpers/getImage";
import SessionsPage from "../../pages/SessionsPage";
import TimezonedDate from "../../TimezonedDate";
import Circle from "../../components/Circle";
import applyPlatformStyle from "../../helpers/applyPlatformStyle";
import * as SessionPageFactory from "../../pages/SessionPageFactory";
import addProgressTo from "../../helpers/addProgressTo";
import config from "../../configs/config";
import {Composite, ImageView, TextView} from "tabris";

export function get(viewDataProvider) {
  return {
    itemHeight: sizes.SCHEDULE_PAGE_ITEM_HEIGHT,
    initializeCell: cell => {
      let backgroundShade = new Composite({
        visible: false, background: colors.ACTION_COLOR,
        left: 0, top: 0, right: 0, bottom: 0
      }).appendTo(cell);

      let circle = new Circle({
        left: sizes.MARGIN, centerY: 0, radius: sizes.BLOCK_CIRCLE_RADIUS,
        color: colors.BACKGROUND_COLOR
      }).appendTo(cell);

      let textContainer = new Composite({
        left: sizes.LEFT_CONTENT_MARGIN, top: 0, right: sizes.MARGIN_LARGE
      }).appendTo(cell);

      let feedbackIndicator = new ImageView({
        class: "feedbackIndicator",
        width: 24, height: 24,
        right: sizes.MARGIN_LARGE,
        progress: false
      }).appendTo(cell);

      addProgressTo(feedbackIndicator);

      applyPlatformStyle(feedbackIndicator);

      let startTimeTextView = new TextView({
        textColor: colors.DARK_SECONDARY_TEXT_COLOR,
        font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
        left: 0, top: sizes.MARGIN_LARGE, right: 0
      }).appendTo(textContainer);

      let titleTextView = new TextView({
        textColor: colors.ACCENTED_TEXT_COLOR,
        maxLines: 2,
        font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
        left: 0, top: ["prev()", sizes.MARGIN_LARGE], right: 0
      }).appendTo(textContainer);

      let summaryTextView = new TextView({
        left: 0, top: ["prev()", sizes.MARGIN], right: 0,
        textColor: colors.DARK_SECONDARY_TEXT_COLOR,
        maxLines: 1,
        font: fontToString({size: sizes.FONT_MEDIUM})
      }).appendTo(textContainer);

      let imageView = new ImageView({
        left: 0, right: textContainer, centerY: 0
      }).appendTo(cell);

      cell.on("change:item", (widget, item) => {
        circle.set("visible", !!item.sessionId);
        startTimeTextView.set("text", item.startTime);
        titleTextView.set("text", item.title);
        summaryTextView.set("text", item.sessionType !== "free" ? item.summary : "");
        imageView.set("image", getImage.forDevicePlatform(item.image));
        if (item.feedbackIndicatorState && item.feedbackIndicatorState !== "loading") {
          feedbackIndicator.set("image",
            getImage.forDevicePlatform("schedule_feedback_" + item.feedbackIndicatorState));
        } else {
          feedbackIndicator.set("image", null);
        }
        feedbackIndicator.set("progress", item.feedbackIndicatorState === "loading");

        if (item.shouldPop) {
          setTimeout(() => {
            backgroundShade
              .once("animationend", shade => shade.set("visible", false))
              .set({visible: true, opacity: 1})
              .animate({opacity: 0}, {duration: 1000, easing: "ease-out"});
          }, 800);
          item.shouldPop = false;
        } else {
          backgroundShade.set("visible", false);
        }
      });
    },
    select: (widget, item) => {
      if (item.sessionId) {
        let sessionPage = SessionPageFactory.create(viewDataProvider).open();
        viewDataProvider.getSession(item.sessionId)
          .then(session => sessionPage.set("data", session));
        tabris.ui.find("#schedule").set("lastSelectedSessionId", item.sessionId);
      } else if (item.sessionType === "free") {
        let page = new SessionsPage(viewDataProvider).open();
        let date1 = new TimezonedDate(config.CONFERENCE_TIMEZONE, item.startTimestamp);
        let date2 = new TimezonedDate(config.CONFERENCE_TIMEZONE, item.endTimestamp);
        viewDataProvider.getSessionsInTimeframe(date1.toJSON(), date2.toJSON())
          .then(sessions => {
            let from = date1.format("LT");
            let to = date2.format("LT");
            page.set("data", {title: from + " - " + to, items: sessions});
          });
      }
    }
  };
}
