import DrawerListItem from "./DrawerListItem";
import colors from "../resources/colors";

export default class extends DrawerListItem {
  constructor(id) {
    let page = tabris.ui.find("#" + id).first();
    super(page.get("title"), page.get("image"));
    this.set("page", page);
    this.on("tap", () => page.open());
  }

  updateSelection() {
    this.find(".drawerIconImageView").set("image", this.get("page").find(".navigatable").get("image"));
    this.set("background", this.get("page").find(".navigatable").get("active") ?
      colors.DRAWER_LIST_ITEM_BACKGROUND[device.platform] : "transparent");
  }
}
