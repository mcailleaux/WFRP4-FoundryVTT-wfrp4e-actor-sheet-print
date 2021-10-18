import { AbstractElement } from './abstract-element';
import jsPDF from 'jspdf';
import { Box } from './box';

export class Blank extends Box {
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
  }

  public static heightBlank(h: number) {
    return new Blank(0, 0, 0, h);
  }

  public getCheckNewPageHeight(doc?: jsPDF): number {
    return this.getHeight(doc);
  }

  public prepareRender(doc: jsPDF, _maxWidth?: number): jsPDF {
    return doc;
  }

  public render(doc: jsPDF, _maxWidth?: number): jsPDF {
    return doc;
  }

  public getElements(): AbstractElement[] {
    return [this];
  }
}
