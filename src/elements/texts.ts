import { Row } from './row';
import { Column } from './column';
import jsPDF from 'jspdf';
import { MARGINS } from '../constants';
import { Text } from './text';

export class Texts extends Row {
  public texts: string[];
  public nbrOfCol: number;

  constructor(x: number, y: number, texts: string[], nbrOfCol?: number) {
    super(x, y, []);
    this.texts = texts;
    this.nbrOfCol = nbrOfCol ?? 4;
    if (this.nbrOfCol > 4) {
      this.nbrOfCol = 4;
    }
    let currentIndex = 0;
    if (texts.length >= this.nbrOfCol) {
      const nbrPerCol = Math.floor(texts.length / this.nbrOfCol);
      const rest = texts.length - nbrPerCol * this.nbrOfCol;
      const nbrPerCols = [
        rest > 0 ? nbrPerCol + 1 : nbrPerCol,
        rest > 1 ? nbrPerCol + 1 : nbrPerCol,
        rest > 2 ? nbrPerCol + 1 : nbrPerCol,
        rest > 3 ? nbrPerCol + 1 : nbrPerCol,
      ];
      for (let i = 0; i < this.nbrOfCol; i++) {
        this.elements[i] = new Column(0, 0, []);
      }
      for (let i = 0; i < texts.length; i++) {
        if (i < nbrPerCols[0]) {
          currentIndex = 0;
        } else if (i < nbrPerCols[0] + nbrPerCols[1]) {
          currentIndex = 1;
        } else if (i < nbrPerCols[0] + nbrPerCols[1] + nbrPerCols[2]) {
          currentIndex = 2;
        } else {
          currentIndex = 3;
        }
        (<Column>this.elements[currentIndex]).elements.push(
          new Row(0, 0, [new Text(0, 0, texts[i])])
        );
      }
    } else {
      this.elements.push(
        new Column(
          0,
          0,
          texts.map((text) => new Row(0, 0, [new Text(0, 0, text)]))
        )
      );
    }
  }

  public prepareRender(doc: jsPDF, maxWidth?: number): jsPDF {
    const pageWidth = doc.internal.pageSize.width;
    const rowWidth = pageWidth - this.x - MARGINS.right;
    for (const column of this.elements) {
      for (const labelledValue of (<Column>column).elements) {
        labelledValue.maxWidth = rowWidth / this.nbrOfCol;
      }
    }
    return super.prepareRender(doc, maxWidth);
  }

  public render(doc: jsPDF, _maxWidth?: number): jsPDF {
    return doc;
  }
}
