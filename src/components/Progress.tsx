import { Widget, ActivityIndicator } from "tabris";

type WidgetConstructor = new (...args: any[]) => Widget;

// tslint:disable-next-line:variable-name
export default function Progress<BC extends WidgetConstructor>(BaseClass: BC) {

  return class extends BaseClass {

    private progressIndicator: ActivityIndicator;

    public async showProgress(progress: boolean) {
      this.progressIndicator = this.progressIndicator || (
        <activityIndicator
            id="progressIndicator" layoutData={await this.getBounds(this)}/>
      );
      this.visible = !progress;
      if (progress) {
        this.parent().append(this.progressIndicator);
      } else {
        this.progressIndicator.detach();
      }
    }

    private getBounds(widget: Widget) {
      return new Promise((resolve) => {
        if (widget.bounds.width) {
          return resolve(widget.bounds);
        }
        widget.once({resize: () => resolve(widget.bounds)});
      });
    }

  };

}
