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

  public prepareRender(doc: jsPDF, maxWidth?: number): jsPDF {
    this.updateMaxWidth(maxWidth);
    return doc;
  }

  public render(doc: jsPDF, _maxWidth?: number): jsPDF {
    let finalText: string[] = [i18nLocalize(this.text)];
    if (this.maxWidth != null) {
      finalText = doc.splitTextToSize(finalText[0], this.maxWidth ?? 0);
    }
    if (finalText.length > 1) {
      finalText[0] = finalText[0].replace(/(.){3}$/, '...');
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

  public getCheckNewPageHeight(doc?: jsPDF): number {
    return this.getHeight(doc);
  }

  public getElements(): AbstractElement[] {
    return [this];
  }
}
