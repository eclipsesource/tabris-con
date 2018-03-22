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
    cellHeight: 128,

    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      cell.touchFeedbackConsumer = new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        background: "white"
      }).appendTo(cell);
      cell.shade = new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        opacity: 0,
        visible: false,
        background: colors.ACTION_COLOR
      }).appendTo(cell);
      let textContainer = new Composite({
        left: 72, top: 0, right: 16, bottom: 0
      }).appendTo(cell);
      cell.feedbackIndicator = new ImageView({
        width: 24, height: 24, top: select({ ios: 12, default: 16 }), right: 16
      }).appendTo(cell);
      addProgressTo(cell.feedbackIndicator);
      cell.startTimeLabel = new TextView({
        id: "startTimeLabel",
        left: 0, top: 16,
        textColor: colors.DARK_SECONDARY_TEXT_COLOR,
        font: fontToString({weight: "bold", size: 18})
      }).appendTo(textContainer);
      cell.concurrentSessionsLabel = new TextView({
        left: "#startTimeLabel 8", top: 18, right: 0,
        textColor: colors.DARK_HINT_TEXT_COLOR,
        font: fontToString({style: "italic", size: 14})
      }).appendTo(textContainer);
      cell.titleLabel = new TextView({
        textColor: colors.ACCENTED_TEXT_COLOR,
        maxLines: 2,
        font: fontToString({weight: "bold", size: 14}),
        left: 0, centerY: 0, right: 0
      }).appendTo(textContainer);
      cell.summaryLabel = new TextView({
        left: 0, top: "prev() 8", right: 0,
        textColor: colors.DARK_SECONDARY_TEXT_COLOR,
        maxLines: 1,
        font: fontToString({size: 14})
      }).appendTo(textContainer);
      cell.image = new ImageView({
        left: 0, right: textContainer, centerY: 0
      }).appendTo(cell);
      cell.highlight = () => {
        cell.shade.visible = true;
        cell.shade.opacity = 1;
        return cell.shade.animate({opacity: 0}, {duration: 1000, easing: "ease-out"});
      };
      cell.abortHighlight = () => cell.shade.visible = false;
      cell.updateFeedbackIndicator = (state) => {
        if (state && state !== "loading") {
          cell.feedbackIndicator.image = getImage.forDevicePlatform("schedule_feedback_" + state);
        } else {
          cell.feedbackIndicator.image = null;
        }
        cell.feedbackIndicator.showProgress(state === "loading");
      };
      return cell;
    },

    updateCell: (cell, item) => {
      item.cell = cell;
      if (cell.item !== item) { cell.abortHighlight() }
      cell.updateFeedbackIndicator(item.feedbackIndicatorState);
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
      cell.item = item;
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
