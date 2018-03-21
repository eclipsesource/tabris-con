import { Widget, WidgetCollection } from "tabris";

export function If({isTruthy}: {isTruthy: object | string | number | boolean}, children: Widget[]) {
  if (!isTruthy) {
    children.forEach(child => child.dispose());
    return new WidgetCollection();
  }
  return new WidgetCollection(children);
}
