import { Widget, ActivityIndicator } from "tabris";

type WidgetConstructor = new (...args: any[]) => Widget;

// tslint:disable-next-line:variable-name
export default function Progress<BC extends WidgetConstructor>(BaseClass: BC) {

  return class extends BaseClass {

    private progressIndicator: ActivityIndicator;

    public async showProgress(progress: boolean) {
      this.visible = !progress;
      if (progress) {
        if (!this.progressIndicator || this.progressIndicator.isDisposed()) {
          this.parent().append(
            this.progressIndicator = (
              <activityIndicator />
            )
          );
        }
        this.progressIndicator.layoutData = await this.getBounds(this);
      } else {
        if (this.progressIndicator) { this.progressIndicator.dispose(); }
        this.progressIndicator = null;
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
