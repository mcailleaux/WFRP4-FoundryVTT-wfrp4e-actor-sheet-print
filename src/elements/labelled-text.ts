import jsPDF, { TextOptionsLight } from 'jspdf';
import { Text } from './text';
import { i18nLocalize, LABEL_SIZE, TEXT_SIZE } from '../constants';
import { AbstractElement } from './abstract-element';

export class LabelledText extends Text {
  public label: string;
  public labelOptions?: TextOptionsLight;

  constructor(
    x: number,
    y: number,
    label: string,
    text: string,
    textOptions?: TextOptionsLight,
    labelOptions?: TextOptionsLight
  ) {
    super(x, y, text, textOptions);
    this.label = label;
    this.labelOptions = labelOptions;
    const textMaxWidth = this.textOptions?.maxWidth ?? 0;
    const labelMaxWidth = this.labelOptions?.maxWidth ?? 0;
    const maxWidth = Math.max(textMaxWidth, labelMaxWidth);
    this.updateMaxWidth(maxWidth);
  }

  public prepareRender(doc: jsPDF, maxWidth?: number): jsPDF {
    this.updateMaxWidth(maxWidth);
    return super.prepareRender(doc, maxWidth);
  }

  public render(doc: jsPDF, _maxWidth?: number): jsPDF {
    const yLabel = this.y + this.getHeightFromPx(doc, LABEL_SIZE);
    const yText = yLabel + this.getHeightFromPx(doc, TEXT_SIZE) + 1;
    doc
      .setFontSize(LABEL_SIZE)
      .text(i18nLocalize(this.label), this.x, yLabel, this.labelOptions)
      .setFontSize(TEXT_SIZE)
      .text(this.text, this.x, yText, this.textOptions);
    return doc;
  }

  protected updateMaxWidth(maxWidth?: number) {
    if (maxWidth != null && maxWidth > 0) {
      this.maxWidth = maxWidth;
      const textOpts: TextOptionsLight = this.textOptions ?? {};
      const labelOpts: TextOptionsLight = this.labelOptions ?? {};
      textOpts.maxWidth = maxWidth;
      labelOpts.maxWidth = maxWidth;
      this.textOptions = textOpts;
      this.labelOptions = labelOpts;
    }
  }

  public getHeight(doc): number {
    return this.getHeightFromPx(doc, TEXT_SIZE + LABEL_SIZE) + 1;
  }

  public getCheckNewPageHeight(doc?: jsPDF): number {
    return this.getHeight(doc);
  }

  public getElements(): AbstractElement[] {
    return [this];
  }
}
