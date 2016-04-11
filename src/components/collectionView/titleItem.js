import sizes from "../../resources/sizes";
import fontToString from "../../helpers/fontToString";
import colors from "../../resources/colors";
import SessionsPage from "../../pages/SessionsPage";
import SessionTitle from "../../components/SessionTitle";
import {TextView} from "tabris";
import texts from "../../resources/texts";

export function get({viewDataProvider, loginService}) {
  return {
    itemHeight: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
    initializeCell: cell => {
      let title = new SessionTitle().appendTo(cell);
      new TextView({
        id: "moreTextView",
        alignment: "right",
        width: 50, right: sizes.MARGIN_LARGE, centerY: 0,
        textColor: colors.ACCENTED_TEXT_COLOR,
        font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
        text: texts.TITLE_COLLECTION_VIEW_ITEM_MORE_BUTTON
      }).appendTo(title);
      cell.on("change:item", (cell, item) => title.set("text", item.title));
    },
    select: (widget, item) => {
      let page = new SessionsPage(viewDataProvider, loginService).open();
      viewDataProvider.getCategory(item.id)
        .then(category => page.set("data", {title: item.title, items: category}));
    }
  };
}
