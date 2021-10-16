import jsPDF from 'jspdf';

export class Util {
  public static getHeightFromPx(doc: jsPDF, size: number) {
    return size / doc.internal.scaleFactor;
  }
}
