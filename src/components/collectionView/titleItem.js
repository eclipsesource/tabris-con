import fontToString from "../../helpers/fontToString";
import colors from "../../resources/colors";
import SessionsPage from "../../pages/SessionsPage";
import SessionTitle from "../../components/SessionTitle";
import {Composite, TextView} from "tabris";
import texts from "../../resources/texts";
import {pageNavigation} from "../../pages/navigation";
import { resolve } from "tabris-decorators";
import ViewDataProvider from "../../ViewDataProvider";

export function get() {
  return {
    cellHeight: 48,
    createCell: () => {
      let cell = new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        highlightOnTouch: true
      });
      cell.title = new SessionTitle({
        left: 0, top: 0, right: "next()", height: 48
      }).appendTo(cell);
      new TextView({
        alignment: "right",
        right: 16, centerY: 0,
        textColor: colors.ACCENTED_TEXT_COLOR,
        font: fontToString({weight: "bold", size: 14}),
        text: texts.TITLE_COLLECTION_VIEW_ITEM_MORE_BUTTON
      }).appendTo(cell);
      return cell;
    },
    updateCell: (cell, item) => cell.title.text = item.title,
    select: (item) => {
      let page = new SessionsPage().appendTo(pageNavigation);
      resolve(ViewDataProvider).getCategory(item.id)
        .then(category => page.data = {title: item.title, items: category});
    }
  };
}
