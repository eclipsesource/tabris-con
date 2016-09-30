import DrawerListItem from "./DrawerListItem";
import colors from "../resources/colors";
import {select} from "../helpers/platform";

export default class extends DrawerListItem {
  constructor(id) {
    let page = tabris.ui.find("#" + id).first();
    super(page.get("title"), page.get("image"));
    this.set("page", page);
    this.on("tap", () => page.open());
  }

  updateSelection() {
    let navigatable = this.get("page").find(".navigatable");
    let active = navigatable.get("active");
    this.find(".icon").set({
      image: navigatable.get("image"),
      tintColor: select({
        windows: colors.WINDOWS_DRAWER_ICON_TINT,
        default: active ? colors.ANDROID_DRAWER_ICON_SELECTED_TINT : colors.ANDROID_DRAWER_ICON_TINT
      })
    });
    this.set("background", active ? colors.DRAWER_LIST_ITEM_BACKGROUND[device.platform] : "transparent");
  }
}
