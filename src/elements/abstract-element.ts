import jsPDF from 'jspdf';
import { MARGINS } from '../constants';

export abstract class AbstractElement {
  public x: number;
  public y: number;
  public maxWidth?: number;

  constructor(x: number, y: number, maxWidth?: number | undefined) {
    this.x = x >= MARGINS.left ? x : MARGINS.left;
    this.y = y >= MARGINS.top ? y : MARGINS.top;
    this.maxWidth = maxWidth;
  }

  public getHeightFromPx(doc: jsPDF, size: number) {
    return size / doc.internal.scaleFactor;
  }

  protected updateMaxWidth(maxWidth?: number) {
    this.maxWidth = maxWidth;
  }

  public abstract render(doc: jsPDF, maxWidth?: number): jsPDF;

  public abstract getHeight(doc?: jsPDF): number;
}
