import jsPDF, { jsPDFOptions } from 'jspdf';
import { AbstractElement } from './elements/abstract-element';

export class PdfBuilder {
  public doc: jsPDF;

  constructor(options: jsPDFOptions) {
    this.doc = new jsPDF(options);
    this.doc.advancedAPI();
    console.dir(this.doc.internal);
  }

  public build(elements: AbstractElement[]) {
    for (const element of elements) {
      element.render(this.doc);
    }
  }
}
