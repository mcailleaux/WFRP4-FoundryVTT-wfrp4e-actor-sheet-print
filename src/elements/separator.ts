import { AbstractElement } from './abstract-element';
import jsPDF from 'jspdf';
import { MARGINS } from '../constants';

export class Separator extends AbstractElement {
  constructor(x: number, y: number, maxWidth?: number | undefined) {
    super(x, y, maxWidth);
  }

  public getHeight(_doc?: jsPDF): number {
    return 0.5;
  }

  public getCheckNewPageHeight(doc?: jsPDF): number {
    return this.getHeight(doc);
  }

  public prepareRender(doc: jsPDF, _maxWidth?: number): jsPDF {
    return doc;
  }

  public render(doc: jsPDF, maxWidth?: number): jsPDF {
    const pageWidth = doc.internal.pageSize.width;
    const maxPageWidth = pageWidth - MARGINS.left - MARGINS.right;
    const finalWidth = Math.min(
      maxWidth ?? this.maxWidth ?? maxPageWidth,
      maxPageWidth
    );

    doc.setLineWidth(0.25);
    doc.line(this.x, this.y, this.x + finalWidth, this.y);

    return doc;
  }

  public getElements(): AbstractElement[] {
    return [this];
  }
}
