import sizes from "../../resources/sizes";
import fontToString from "../../helpers/fontToString";
import colors from "../../resources/colors";
import SessionsPage from "../../pages/SessionsPage";
import SessionTitle from "../../components/SessionTitle";
import {Composite, TextView} from "tabris";
import texts from "../../resources/texts";
import {pageNavigation} from "../../pages/navigation";

export function get({viewDataProvider, loginService, feedbackService}) {
  return {
    cellHeight: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
    createCell: () => {
      let cell = new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        highlightOnTouch: true
      });
      cell.title = new SessionTitle({
        left: 0, top: 0, right: "#moreTextView", height: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT
      }).appendTo(cell);
      new TextView({
        id: "moreTextView",
        alignment: "right",
        width: 50, right: sizes.MARGIN_LARGE, centerY: 0,
        textColor: colors.ACCENTED_TEXT_COLOR,
        font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
        text: texts.TITLE_COLLECTION_VIEW_ITEM_MORE_BUTTON
      }).appendTo(cell.title);
      return cell;
    },
    updateCell: (cell, item) => cell.title.text = item.title,
    select: (item) => {
      let page = new SessionsPage(viewDataProvider, loginService, feedbackService).appendTo(pageNavigation);
      viewDataProvider.getCategory(item.id)
        .then(category => page.data = {title: item.title, items: category});
    }
  };
}
