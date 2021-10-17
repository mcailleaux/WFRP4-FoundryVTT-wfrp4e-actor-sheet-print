import { AbstractElement } from './abstract-element';
import jsPDF from 'jspdf';

export class Column extends AbstractElement {
  public elements: AbstractElement[] = [];

  constructor(x: number, y: number, elements: AbstractElement[]) {
    super(x, y);
    this.elements = elements;
  }

  public prepareRender(doc: jsPDF, _maxWidth?: number): jsPDF {
    const elements = this.elements ?? [];

    let currentY = this.y;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.x = Math.max(element.x, this.x);
      element.y = currentY;
      element.prepareRender(doc);
      currentY += element.getHeight(doc) + 2;
    }
    return doc;
  }

  public render(doc: jsPDF, _maxWidth?: number): jsPDF {
    return doc;
  }

  public getHeight(doc): number {
    return this.elements
      .map((e) => e.getHeight(doc))
      .reduce((p, c, i) => {
        if (i === 0) {
          return c;
        }
        return p + c + 2;
      });
  }

  public getCheckNewPageHeight(doc?: jsPDF): number {
    return this.elements.length > 0
      ? this.elements[0].getCheckNewPageHeight(doc)
      : 0;
  }

  public getElements(): AbstractElement[] {
    const elements: AbstractElement[] = [];
    for (const element of this.elements) {
      elements.push(...element.getElements());
    }
    return elements;
  }
}
