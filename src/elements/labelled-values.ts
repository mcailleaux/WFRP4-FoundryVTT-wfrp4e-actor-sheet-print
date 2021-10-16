import { Row } from './row';
import { Column } from './column';
import { LabelledValue } from './labelled-value';
import jsPDF from 'jspdf';
import { MARGINS } from '../constants';

export class LabelledValues extends Row {
  public labelledValues: { label: string; value: number }[];
  public nbrOfCol: number;

  constructor(
    x: number,
    y: number,
    labelledValues: { label: string; value: number }[],
    nbrOfCol?: number
  ) {
    super(x, y, []);
    this.labelledValues = labelledValues;
    this.nbrOfCol = nbrOfCol ?? 3;
    if (this.nbrOfCol > 3) {
      this.nbrOfCol = 3;
    }
    const valuePercent = 5 * this.nbrOfCol;
    const labelPercent = 100 - valuePercent;
    const widthPercent = [labelPercent, valuePercent];
    let currentIndex = 0;
    if (labelledValues.length >= this.nbrOfCol) {
      const nbrPerCol = Math.floor(labelledValues.length / this.nbrOfCol);
      const rest = labelledValues.length - nbrPerCol * this.nbrOfCol;
      const nbrPerCols = [
        rest > 0 ? nbrPerCol + 1 : nbrPerCol,
        rest > 1 ? nbrPerCol + 1 : nbrPerCol,
        rest > 2 ? nbrPerCol + 1 : nbrPerCol,
      ];
      for (let i = 0; i < this.nbrOfCol; i++) {
        this.elements[i] = new Column(0, 0, []);
      }
      for (let i = 0; i < labelledValues.length; i++) {
        if (i < nbrPerCols[0]) {
          currentIndex = 0;
        } else if (i < nbrPerCols[0] + nbrPerCols[1]) {
          currentIndex = 1;
        } else {
          currentIndex = 2;
        }
        (<Column>this.elements[currentIndex]).elements.push(
          new LabelledValue(
            labelledValues[i].label,
            labelledValues[i].value,
            widthPercent
          )
        );
      }
    } else {
      this.elements.push(
        new Column(
          0,
          0,
          labelledValues.map(
            (libelledValue) =>
              new LabelledValue(
                libelledValue.label,
                libelledValue.value,
                widthPercent
              )
          )
        )
      );
    }
  }

  public render(doc: jsPDF, maxWidth?: number): jsPDF {
    const pageWidth = doc.internal.pageSize.width;
    const rowWidth = pageWidth - this.x - MARGINS.right;
    for (const column of this.elements) {
      for (const labelledValue of (<Column>column).elements) {
        labelledValue.maxWidth = rowWidth / this.nbrOfCol;
      }
    }
    return super.render(doc, maxWidth);
  }
}
