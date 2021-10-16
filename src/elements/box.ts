import { AbstractElement } from './abstract-element';
import jsPDF from 'jspdf';

export class Box extends AbstractElement {
  public w: number;
  public h: number;

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w);
    this.w = w;
    this.h = h;
  }

  public render(doc: jsPDF, _maxWidth?: number): jsPDF {
    doc.rect(this.x, this.y, this.w, this.h);
    return doc;
  }

  public getHeight(_doc): number {
    return this.h;
  }
}
