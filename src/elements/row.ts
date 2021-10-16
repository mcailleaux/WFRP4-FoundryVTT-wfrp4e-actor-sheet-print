import { AbstractElement } from './abstract-element';
import jsPDF from 'jspdf';
import { MARGINS } from '../constants';

export class Row extends AbstractElement {
  public elements: AbstractElement[] = [];
  public widthPercents?: number[];
  public maxWidths?: number[];

  constructor(
    x: number,
    y: number,
    elements: AbstractElement[],
    maxWidth?: number | undefined,
    widthPercents?: number[],
    maxWidths?: number[]
  ) {
    super(x, y, maxWidth);
    this.elements = elements ?? [];
    this.widthPercents = widthPercents ?? [];
    this.maxWidths = maxWidths ?? [];
  }

  public render(doc: jsPDF, maxWidth?: number): jsPDF {
    const elements = this.elements ?? [];
    let maxWidths = this.maxWidths ?? [];
    let widthPercents = this.widthPercents ?? [];

    if (widthPercents.length !== elements.length) {
      widthPercents = [];
      for (let i = 0; i < elements.length; i++) {
        if (widthPercents[i] == null) {
          widthPercents[i] = 100 / elements.length;
        }
      }
    }
    if (maxWidths.length !== elements.length) {
      maxWidths = [];
    }

    const pageWidth = doc.internal.pageSize.width;
    const rowWidth =
      maxWidth ?? this.maxWidth ?? pageWidth - this.x - MARGINS.right;

    let currentX = this.x;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const percent = widthPercents[i];
      const percentWidth = (rowWidth * percent) / 100;
      const maxChildWidth = maxWidths[i] ?? percentWidth;
      element.x = currentX;
      element.y = this.y;
      element.render(doc, maxChildWidth);
      currentX += percentWidth;
    }
    return doc;
  }

  public getHeight(doc?: jsPDF): number {
    let maxHeight = 0;
    for (const element of this.elements) {
      maxHeight = Math.max(maxHeight, element.getHeight(doc));
    }
    return maxHeight;
  }
}
