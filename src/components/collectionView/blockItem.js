import sizes from "../../resources/sizes";
import fontToString from "../../helpers/fontToString";
import colors from "../../resources/colors";
import texts from "../../resources/texts";
import getImage from "../../helpers/getImage";
import SessionsPage from "../../pages/SessionsPage";
import TimezonedDate from "../../TimezonedDate";
import applyPlatformStyle from "../../helpers/applyPlatformStyle";
import SessionPage from "../../pages/SessionPage";
import addProgressTo from "../../helpers/addProgressTo";
import config from "../../configs/config";
import {Composite, ImageView, TextView} from "tabris";

export function get({viewDataProvider, loginService, feedbackService}) {
  return {
    itemHeight: sizes.SCHEDULE_PAGE_ITEM_HEIGHT,
    initializeCell: cell => {
      let touchFeedbackConsumer = new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        background: "white"
      }).appendTo(cell);
      let backgroundShade = new Composite({
        visible: false, background: colors.ACTION_COLOR,
        left: 0, top: 0, right: 0, bottom: 0
      }).appendTo(cell);

      let textContainer = new Composite({
        left: sizes.LEFT_CONTENT_MARGIN, top: 0, right: sizes.MARGIN_LARGE, bottom: 0
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
        left: 0, top: sizes.MARGIN_LARGE
      }).appendTo(textContainer);

      let concurrentSessionsTextView = new TextView({
        textColor: colors.DARK_HINT_TEXT_COLOR,
        font: fontToString({style: "italic", size: sizes.FONT_MEDIUM}),
        left: [startTimeTextView, sizes.MARGIN], top: sizes.MARGIN_LARGE + sizes.MARGIN_XSMALL, right: 0
      }).appendTo(textContainer);

      let titleTextView = new TextView({
        textColor: colors.ACCENTED_TEXT_COLOR,
        maxLines: 2,
        font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
        left: 0, centerY: 0, right: 0
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
        touchFeedbackConsumer.set("visible", item.blockType === "block");
        startTimeTextView.set("text", item.startTime);
        concurrentSessionsTextView.set("text",
          item.concurrentSessions ? `(${item.concurrentSessions} ${texts.CONCURRENT_SESSIONS})` : ""
        );
        titleTextView.set("text", item.title);
        summaryTextView.set("text", item.blockType !== "free" ? item.summary : "");
        imageView.set({
          image: getImage.forDevicePlatform(item.image),
          tintColor: item.image === "schedule_icon_plus" ? colors.ACTION_COLOR : "initial"
        });
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
        let sessionPage = new SessionPage(viewDataProvider, loginService, feedbackService).open();
        viewDataProvider["get" + (item.keynote ? "Keynote" : "Session")](item.sessionId)
          .then(session => sessionPage.set("data", session));
        tabris.ui.find("#schedule").set("lastSelectedSessionId", item.sessionId);
      } else if (item.blockType === "free") {
        let page = new SessionsPage(viewDataProvider, loginService, feedbackService).open();
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
