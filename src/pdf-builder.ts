import jsPDF, { jsPDFOptions } from 'jspdf';
import { AbstractElement } from './elements/abstract-element';
import { MARGINS } from './constants';

export class PdfBuilder {
  public doc: jsPDF;

  constructor(options: jsPDFOptions) {
    this.doc = new jsPDF(options);
  }

  public build(elements: AbstractElement[]) {
    const finalElements: AbstractElement[] = [];
    for (const element of elements) {
      element.prepareRender(this.doc);
      finalElements.push(...element.getElements());
    }
    finalElements.sort((a, b) => {
      return a.y - b.y;
    });

    const pageHeight = this.doc.internal.pageSize.height;
    const yMax = pageHeight - MARGINS.bottom;
    const pages: AbstractElement[][] = [];

    for (const element of finalElements) {
      let indexPage = 0;
      let currentY = element.y;
      const height = element.getCheckNewPageHeight(this.doc);
      if (currentY + height > yMax) {
        while (currentY + height > yMax) {
          indexPage++;
          currentY = currentY - yMax + MARGINS.bottom;
          if (currentY + height <= yMax) {
            if (pages[indexPage] == null) {
              pages[indexPage] = [];
            }
            element.y = currentY;
            pages[indexPage].push(element);
          }
        }
      } else {
        if (pages[indexPage] == null) {
          pages[indexPage] = [];
        }
        pages[indexPage].push(element);
      }
    }

    let i = 0;
    for (const page of pages) {
      i++;
      for (const element of page) {
        element.render(this.doc);
      }
      if (i < pages.length) {
        this.doc.addPage();
      }
    }
  }
}
