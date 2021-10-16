import { AbstractElement } from './abstract-element';
import jsPDF, { TextOptionsLight } from 'jspdf';
import { i18nLocalize, TEXT_SIZE } from '../constants';

export class Text extends AbstractElement {
  public text: string;
  public textOptions?: TextOptionsLight;

  constructor(
    x: number,
    y: number,
    text: string,
    textOptions?: TextOptionsLight
  ) {
    super(x, y, textOptions?.maxWidth);
    this.text = text;
    this.textOptions = textOptions;
  }

  public render(doc: jsPDF, maxWidth?: number): jsPDF {
    this.updateMaxWidth(maxWidth);
    let finalText = [i18nLocalize(this.text)];
    if (this.maxWidth != null) {
      finalText = doc.splitTextToSize(finalText[0], maxWidth ?? 0);
    }
    const yText = this.y + this.getHeightFromPx(doc, TEXT_SIZE);
    doc
      .setFontSize(TEXT_SIZE)
      .text(finalText[0], this.x, yText, this.textOptions);
    return doc;
  }

  protected updateMaxWidth(maxWidth?: number) {
    if (maxWidth != null && maxWidth > 0) {
      this.maxWidth = maxWidth;
      const options: TextOptionsLight = this.textOptions ?? {};
      options.maxWidth = this.maxWidth;
      this.textOptions = options;
    }
  }

  public getHeight(doc): number {
    return this.getHeightFromPx(doc, TEXT_SIZE);
  }
}
