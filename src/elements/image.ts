import { Box } from './box';
import jsPDF from 'jspdf';
import { AbstractElement } from './abstract-element';

export class Image extends Box {
  public imageData: string;

  constructor(x: number, y: number, w: number, h: number, imageData: string) {
    super(x, y, w, h);
    this.imageData = imageData;
  }

  public render(doc: jsPDF, _maxWidth?: number): jsPDF {
    doc.addImage({
      imageData: this.imageData,
      x: this.x,
      y: this.y,
      width: this.w,
      height: this.h,
    });
    return doc;
  }

  public getElements(): AbstractElement[] {
    return [this];
  }
}
