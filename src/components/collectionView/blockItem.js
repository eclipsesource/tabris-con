import sizes from "../../resources/sizes";
import fontToString from "../../helpers/fontToString";
import colors from "../../resources/colors";
import texts from "../../resources/texts";
import getImage from "../../helpers/getImage";
import SessionsPage from "../../pages/SessionsPage";
import TimezonedDate from "../../TimezonedDate";
import {select} from "../../helpers/platform";
import SessionPage from "../../pages/SessionPage";
import addProgressTo from "../../helpers/addProgressTo";
import config from "../../configs/config";
import {pageNavigation} from "../../pages/navigation";
import {Composite, ImageView, TextView} from "tabris";

export function get({viewDataProvider, loginService, feedbackService}) {
  return {
    cellHeight: sizes.SCHEDULE_PAGE_ITEM_HEIGHT,

    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      cell.touchFeedbackConsumer = new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        background: "white"
      }).appendTo(cell);
      cell.shade = new Composite({
        visible: false, background: colors.ACTION_COLOR,
        left: 0, top: 0, right: 0, bottom: 0
      }).appendTo(cell);
      let textContainer = new Composite({
        left: sizes.LEFT_CONTENT_MARGIN, top: 0, right: sizes.MARGIN_LARGE, bottom: 0
      }).appendTo(cell);
      cell.feedbackIndicator = new ImageView({
        width: 24, height: 24, top: select({
          ios: sizes.MARGIN + sizes.MARGIN_SMALL,
          default: sizes.MARGIN_LARGE
        }),
        right: sizes.MARGIN_LARGE
      }).appendTo(cell);
      addProgressTo(cell.feedbackIndicator);
      cell.startTimeLabel = new TextView({
        textColor: colors.DARK_SECONDARY_TEXT_COLOR,
        font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
        left: 0, top: sizes.MARGIN_LARGE
      }).appendTo(textContainer);
      cell.concurrentSessionsLabel = new TextView({
        textColor: colors.DARK_HINT_TEXT_COLOR,
        font: fontToString({style: "italic", size: sizes.FONT_MEDIUM}),
        left: [cell.startTimeLabel, sizes.MARGIN], top: sizes.MARGIN_LARGE + sizes.MARGIN_XSMALL, right: 0
      }).appendTo(textContainer);
      cell.titleLabel = new TextView({
        textColor: colors.ACCENTED_TEXT_COLOR,
        maxLines: 2,
        font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
        left: 0, centerY: 0, right: 0
      }).appendTo(textContainer);
      cell.summaryLabel = new TextView({
        left: 0, top: ["prev()", sizes.MARGIN], right: 0,
        textColor: colors.DARK_SECONDARY_TEXT_COLOR,
        maxLines: 1,
        font: fontToString({size: sizes.FONT_MEDIUM})
      }).appendTo(textContainer);
      cell.image = new ImageView({
        left: 0, right: textContainer, centerY: 0
      }).appendTo(cell);
      return cell;
    },

    updateCell: (cell, item) => {
      cell.touchFeedbackConsumer.visible = item.blockType === "block";
      cell.highlightOnTouch = item.blockType !== "block";
      cell.startTimeLabel.text = item.startTime;
      cell.concurrentSessionsLabel.text =
        item.concurrentSessions ? `(${item.concurrentSessions} ${texts.CONCURRENT_SESSIONS})` : "";
      cell.titleLabel.text = item.title;
      cell.summaryLabel.text = item.blockType !== "free" ? item.summary : "";
      cell.image.set({
        image: getImage.forDevicePlatform(item.image),
        tintColor: item.image === "schedule_icon_plus" ? colors.ACTION_COLOR : "initial"
      });
      if (item.feedbackIndicatorState && item.feedbackIndicatorState !== "loading") {
        cell.feedbackIndicator.image = getImage.forDevicePlatform("schedule_feedback_" + item.feedbackIndicatorState);
      } else {
        cell.feedbackIndicator.image = null;
      }
      cell.feedbackIndicator.showProgress(item.feedbackIndicatorState === "loading");
      if (item.shouldPop) {
        setTimeout(() => {
          cell.shade
            .set({visible: true, opacity: 1})
            .animate({opacity: 0}, {duration: 1000, easing: "ease-out"})
            .then(() => cell.shade.visible = false);
        }, 800);
        item.shouldPop = false;
      } else {
        cell.shade.visible = false;
      }
    },

    select: (item) => {
      if (item.sessionId) {
        let sessionPage = new SessionPage(viewDataProvider, loginService, feedbackService).appendTo(pageNavigation);
        viewDataProvider["get" + (item.keynote ? "Keynote" : "Session")](item.sessionId)
          .then(session => sessionPage.data = session);
      } else if (item.blockType === "free") {
        let page = new SessionsPage(viewDataProvider, loginService, feedbackService).appendTo(pageNavigation);
        let date1 = new TimezonedDate(config.CONFERENCE_TIMEZONE, item.startTimestamp);
        let date2 = new TimezonedDate(config.CONFERENCE_TIMEZONE, item.endTimestamp);
        viewDataProvider.getSessionsInTimeframe(date1.toJSON(), date2.toJSON())
          .then(sessions => {
            let from = date1.format("LT");
            let to = date2.format("LT");
            page.data = {title: from + " - " + to, items: sessions};
          });
      }
    }
  };
}
