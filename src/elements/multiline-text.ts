import { AbstractElement } from './abstract-element';
import jsPDF, { TextOptionsLight } from 'jspdf';
import { i18nLocalize, TEXT_SIZE } from '../constants';
import { Text } from './text';

export class MultilineText extends Text {
  private nbrLine = 1;

  constructor(
    x: number,
    y: number,
    text: string,
    textOptions?: TextOptionsLight
  ) {
    super(x, y, text, textOptions);
  }

  public prepareRender(doc: jsPDF, maxWidth?: number): jsPDF {
    doc.setFontSize(TEXT_SIZE);
    this.updateMaxWidth(maxWidth);
    let finalText: string[] = [i18nLocalize(this.text)];
    if (this.maxWidth != null) {
      finalText = doc.splitTextToSize(finalText[0], this.maxWidth);
    }
    this.nbrLine = finalText.length;
    return doc;
  }

  public render(doc: jsPDF, _maxWidth?: number): jsPDF {
    const yText = this.y + this.getHeightFromPx(doc, TEXT_SIZE);
    doc.setFontSize(TEXT_SIZE).text(this.text, this.x, yText, this.textOptions);
    return doc;
  }

  public getHeight(doc): number {
    return this.getHeightFromPx(doc, TEXT_SIZE) * this.nbrLine;
  }

  public getElements(): AbstractElement[] {
    return [this];
  }
}
