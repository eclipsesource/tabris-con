import getImage from "../helpers/getImage";
import fontToString from "../helpers/fontToString";
import colors from "../resources/colors";
import config from "../configs/config";
import Link from "../components/Link";
import { Composite, Tab, app, Page, TabProperties } from "tabris";
import texts from "../resources/texts";
import { getById, component } from "tabris-decorators";

const EXTERNAL_ATTRIBUTIONS = [{
  subject: texts.ABOUT_PAGE_ICONS_ATTRIBUTION_SUBJECT,
  author: {name: "Material Design Icons", url: "https://materialdesignicons.com/"},
  information: {
    label: texts.ABOUT_PAGE_ATTRIBUTION_LICENSE_LINK,
    url: "https://github.com/Templarian/MaterialDesign/blob/master/LICENSE"
  }
}];

@component export default class About extends Tab {

  @getById private externalAttributionsList: Composite;
  @getById private container: Composite;

  constructor(properties: TabProperties) {
    super();
    this.append(
      <scrollView
          left={0} top={0} right={0} bottom={0}>
        <composite
            id="container"
            left={0} top={0} right={0} >
          <imageView
              centerX={0} top="8%"
              image={getImage("conference_logo")} />
          <composite
              left={0} top="prev() 16" right={0} >
            <textView
                centerX={0} top={0}
                font={fontToString({weight: "bold", size: 16})}
                alignment="center"
                text={config.CONFERENCE_NAME + texts.ABOUT_PAGE_BROUGHT_TO_YOU_BY} />
            <Link
                centerX={0} top="prev()"
                font={fontToString({weight: "bold", size: 16})}
                text={config.VENDOR}
                url={config.VENDOR_WEBSITE} />
          </composite>
          <textView
              centerX={0} top="prev() 8"
              text={"v" + app.version} />
          <composite
              id="externalAttributionsList"
              left={16} bottom={8} right={16} />
          <composite
              left={16} bottom="#externalAttributionsList 16" right={16} >
            <textView
                left={0} top={0} right={0}
                alignment="center"
                textColor={colors.DARK_SECONDARY_TEXT_COLOR}
                text={texts.ABOUT_PAGE_OPEN_SOURCE} />
            <composite
                centerX={0} top="prev()" >
              <textView
                  left={0} top={0}
                  textColor={colors.DARK_SECONDARY_TEXT_COLOR}
                  text={texts.ABOUT_PAGE_VIEW_IT_ON} />
              <Link
                  left="prev()" top={0}
                  text="GitHub" url={config.PROJECT_URL} />
            </composite>
          </composite>
          <composite
              left={0} top="58%" right={0}>
            <composite
                centerX={0} top={0} height={0}>
              <imageView
                  left={0} top={0} width={48} height={48}
                  image={getImage("tabrisjs_logo")} />
              <textView
                  left="prev()" centerY={0}
                  textColor={colors.DARK_SECONDARY_TEXT_COLOR}
                  text={texts.ABOUT_PAGE_BUILT_WITH} />
              <Link
                  left="prev()" centerY={0}
                  url="http://www.tabrisjs.com" text="Tabris.js" />
            </composite>
          </composite>
        </composite>
      </scrollView>
    );
    this.set({
      id: "about",
      title: texts.ABOUT_PAGE_TITLE,
      image: getImage("about"),
      selectedImage: getImage("about_selected"),
      ...properties
    });
    this.createExternalAttributions();
    this.on("resize", () => this.container.height = this.calculateContainerHeight());
  }

  private createExternalAttributions() {
    EXTERNAL_ATTRIBUTIONS.forEach((attribution) => {
      this.createAttributionListSeparator().appendTo(this.externalAttributionsList);
      this.createAttributionRow(attribution).appendTo(this.externalAttributionsList);
      if (EXTERNAL_ATTRIBUTIONS.indexOf(attribution) !== EXTERNAL_ATTRIBUTIONS.length - 1) {
        this.createAttributionListSeparator().appendTo(this.externalAttributionsList);
      }
    });
  }

  private calculateContainerHeight() {
    let {height} = this.bounds;
    return height < 450 ? 450 : height;
  }

  private createAttributionRow(attribution: ExternalAttribution) {
    return (
      <composite
          left={0} top="prev()" right={0} height={24}>
        <textView
            left={0} centerY={0}
            textColor={colors.DARK_SECONDARY_TEXT_COLOR}
            font={fontToString({size: 12})}
            text={attribution.subject + texts.ABOUT_PAGE_ATTRIBUTION_BY} />
        <Link
            left="prev()" centerY={0} text={attribution.author.name} url={attribution.author.url}
            font={fontToString({size: 12})} />
        <Link
            right={0} centerY={0}
            text={attribution.information.label}
            page={attribution.information.page}
            url={attribution.information.url}
            font={fontToString({size: 12})} />
      </composite>
    );
  }

  private createAttributionListSeparator() {
    return (
      <composite
          left={0} top="prev()" right={0} height={1}
          background={colors.LINE_SEPARATOR_COLOR} />
    );
  }

}

interface ExternalAttribution {
  subject: string;
  author: {name: string, url: string};
  information: {label: string, page?: typeof Page, url?: string};
}
