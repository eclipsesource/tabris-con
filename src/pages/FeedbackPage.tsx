import fontToString from "../helpers/fontToString";
import FeedbackSelector from "../components/FeedbackSelector";
import { Page, TextInput, PageProperties } from "tabris";
import texts from "../resources/texts";
import { property, getById, component, resolve } from "tabris-decorators";
import ProgressButton from "../components/ProgressButton";
import { logError } from "../errors";
import CodFeedbackService from "../helpers/CodFeedbackService";

interface FeedbackPageProperties {
  session: any;
}

@component export default class FeedbackPage extends Page {

  public jsxProperties: JSX.PageProperties & FeedbackPageProperties;
  public tsProperties: PageProperties & FeedbackPageProperties;

  @property private session: any;
  @getById private evaluateButton: ProgressButton;
  @getById private commentInput: TextInput;
  @getById private feedbackThumbs: FeedbackSelector;

  constructor(properties: PageProperties & FeedbackPageProperties) {
    super();
    this.append(
      <composite
          centerX={0} centerY={0} width={280}>
        <textView
            alignment="center"
            text={texts.FEEDBACK_PAGE_MESSAGE}
            font={fontToString({size: 22})}
            left={0} top={0} right={0} />
        <FeedbackSelector
            id="feedbackThumbs"
            top="prev() 16" centerX={0} />
        <textInput
            id="commentInput"
            left={0} right={0} top="prev() 16"
            message={texts.FEEDBACK_PAGE_COMMENT} />
        <ProgressButton
            id="evaluateButton"
            right={0} top="prev() 8"
            title={texts.FEEDBACK_PAGE_SUBMIT_BUTTON}
            onSelect={() => this.evaluate()} />
      </composite>
    );
    this.set({title: texts.FEEDBACK_PAGE_TITLE, ...properties});
  }

  private async evaluate() {
    this.evaluateButton.showProgress(true);
    try {
      await resolve(CodFeedbackService).createEvaluation(
        this.session,
        this.commentInput.text,
        this.feedbackThumbs.feedback
      );
      this.dispose();
    } catch(e) {
      logError(e);
      this.evaluateButton.showProgress(false);
    }
  }
}
