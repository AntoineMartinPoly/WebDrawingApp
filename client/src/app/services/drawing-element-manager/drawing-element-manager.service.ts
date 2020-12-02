import { Injectable } from '@angular/core';
import { ONE } from 'src/constant/constant';
import { DrawingElement } from 'src/interface/drawing-element';

@Injectable({
  providedIn: 'root',
})
export class DrawingElementManagerService {

  drawingElementsOnDrawing: DrawingElement[];

  constructor() {
    this.drawingElementsOnDrawing = [];
  }

  getClickedDrawingElement(event: MouseEvent): DrawingElement | undefined {
    for (const drawingElement of this.drawingElementsOnDrawing) {
      if (drawingElement.ref === event.target) {
        return drawingElement;
      }
    }
    return undefined;
  }

  getClickedDrawingElementFromParent(event: MouseEvent): DrawingElement | undefined {
    for (const drawingElement of this.drawingElementsOnDrawing) {
      if ( this.isChildClickedEvent(event, drawingElement) ) {
        return drawingElement;
      }
    }
    return undefined;
  }

  isChildClickedEvent(event: MouseEvent, drawingElementRef: DrawingElement): boolean {
    for ( const child of drawingElementRef.ref.children ) {
      if (child === event.target) {
        return true;
      }
    }
    return false;
  }

  getLastDrawingElement(): DrawingElement {
    return this.drawingElementsOnDrawing[this.drawingElementsOnDrawing.length - ONE];
  }

  appendDrawingElement(drawingElement: DrawingElement): void {
    this.drawingElementsOnDrawing.push(drawingElement);
  }

  appendDrawingElements(drawingElements: DrawingElement[]): void {
    for (const drawingElement of drawingElements) {
      this.drawingElementsOnDrawing.push(drawingElement);
    }
  }

  pushDrawingElementAtFirstPosition(drawingElement: DrawingElement): void {
    this.drawingElementsOnDrawing.unshift(drawingElement);
  }

  removeDrawingElement(drawingElement: DrawingElement): void {
    this.drawingElementsOnDrawing.splice(this.drawingElementsOnDrawing.indexOf(drawingElement), ONE);
  }

  removeFirstDrawingElement(): DrawingElement | undefined {
    return this.drawingElementsOnDrawing.shift();
  }
}
