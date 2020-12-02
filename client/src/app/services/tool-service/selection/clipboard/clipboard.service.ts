import { Injectable } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { GROUP, TRANSFORM } from 'src/constant/svg/constant';
import { TRANSLATE } from 'src/constant/tool-service/constant';
import { DEFAULT_PASTE_OFFSET } from 'src/constant/toolbar/constant';
import { DrawingElement } from 'src/interface/drawing-element';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {

  private copiedDrawingElements: DrawingElement[];
  drawingService: DrawingService;
  private offsetX: number;
  private offsetY: number;

  constructor(public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
    this.offsetX = DEFAULT_PASTE_OFFSET;
    this.offsetY = DEFAULT_PASTE_OFFSET;
  }

  copy(drawingElements: DrawingElement[]): void {
    this.copiedDrawingElements = drawingElements;
    this.offsetX = DEFAULT_PASTE_OFFSET;
    this.offsetY = DEFAULT_PASTE_OFFSET;
  }

  cut(drawingElements: DrawingElement[]): boolean {
    if ( drawingElements && drawingElements.length ) {
      this.offsetX = DEFAULT_PASTE_OFFSET;
      this.offsetY = DEFAULT_PASTE_OFFSET;
      const newRef: DrawingElement[] = [];
      Object.assign(newRef, drawingElements);
      this.removeDrawingElementsFromDrawing(newRef);
      this.copiedDrawingElements = newRef;
      return true;
    }
    return false;
  }

  paste(): DrawingElement[] {
    if ( this.copiedDrawingElements && this.copiedDrawingElements.length ) {
      const newDrawingElements: DrawingElement[] = [];
      for ( const drawingElement of this.copiedDrawingElements ) {
        const newDrawingElement = this.cloneNewDrawingElement(drawingElement);
        newDrawingElements.push(newDrawingElement);
        if ( !this.isDrawingElementInDrawing(newDrawingElement) ) {
          this.resetOffsetAndPaste(newDrawingElements);
        }
      }
      this.drawingElementManager.appendDrawingElements(newDrawingElements);
      this.offsetX += DEFAULT_PASTE_OFFSET;
      this.offsetY += DEFAULT_PASTE_OFFSET;
      return newDrawingElements;
    }
    return [];
  }

  duplicate(drawingElements: DrawingElement[]): DrawingElement[] {
    if ( drawingElements && drawingElements.length ) {
      const newDrawingElements: DrawingElement[] = [];
      this.offsetX = DEFAULT_PASTE_OFFSET;
      this.offsetY = DEFAULT_PASTE_OFFSET;
      for ( const drawingElement of drawingElements ) {
        const newDrawingElement = this.cloneNewDrawingElement(drawingElement);
        newDrawingElements.push(newDrawingElement);
      }
      this.drawingElementManager.appendDrawingElements(newDrawingElements);
      return newDrawingElements;
    }
    return [];
  }

  removeDrawingElementsFromDrawing(drawingElements: DrawingElement[]): void {
    for ( const drawingElement of drawingElements) {
      this.drawingService.removeSVGElementFromRef(drawingElement.ref);
      this.drawingElementManager.removeDrawingElement(drawingElement);
    }
  }

  reAddElements(drawingElements: DrawingElement[]) {
    drawingElements.forEach((element) => {
      this.drawingService.addSVGElementFromRef(element.ref);
      this.drawingElementManager.appendDrawingElement(element);
    });
  }

  setAllAttributes(getRefAtt: any, setRefAtt: any): void {
    for ( const attribute of getRefAtt.attributes) {
      this.drawingService.setSVGattribute(setRefAtt, attribute.name, attribute.value);
    }
  }

  cloneNewDrawingElement(drawingElement: DrawingElement): DrawingElement {
    const newDrawingElement = this.copyDrawingElement(drawingElement);
    this.setAllAttributes(drawingElement.ref, newDrawingElement.ref);
    this.setTransformAttribute(newDrawingElement);
    return newDrawingElement;
  }

  copyDrawingElement(drawingElement: DrawingElement): DrawingElement {
    const newDrawingElement = Object.assign({}, drawingElement);
    newDrawingElement.ref = this.drawingService.generateSVGElement(GROUP);
    for ( const child of drawingElement.ref.children ) {
      const newDrawingElementChild = this.drawingService.generateSVGElement(child.localName);
      this.setAllAttributes(child, newDrawingElementChild);
      this.drawingService.addSVGToSVG(newDrawingElementChild, newDrawingElement.ref);
    }
    this.drawingService.addSVGElementFromRef(newDrawingElement.ref);
    return newDrawingElement;
  }

  resetOffsetAndPaste(drawingElementsToDelete: DrawingElement[]) {
    this.removeDrawingElementsFromDrawing(drawingElementsToDelete);
    if ( this.offsetX !== DEFAULT_PASTE_OFFSET && this.offsetY !== DEFAULT_PASTE_OFFSET ) {
      this.offsetX = DEFAULT_PASTE_OFFSET;
      this.offsetY = DEFAULT_PASTE_OFFSET;
      this.paste();
    }
  }

  setTransformAttribute(drawingElement: DrawingElement): void {
    const oldTransform = this.drawingService.getAttributeValueFromSVG(drawingElement.ref, TRANSFORM);
    const newTransform = `${TRANSLATE}(${this.offsetX},${this.offsetY}) ${oldTransform}`;
    this.drawingService.setSVGattribute(drawingElement.ref, TRANSFORM, newTransform);
  }

  isDrawingElementInDrawing(drawingElement: DrawingElement): boolean {
    const boundingBox = drawingElement.ref.getBoundingClientRect();
    return this.isInBoundingBox(this.drawingService.getSVGBoundingBox(), boundingBox);
  }

  isInBoundingBox(selection: SVGRect, elementBox: SVGRect): boolean {
    const isInsideX = selection.x < elementBox.x && selection.x + selection.width > elementBox.x + elementBox.width;
    const isInsideY = selection.y < elementBox.y && selection.y + selection.height > elementBox.y + elementBox.height;
    return (isInsideX && isInsideY);
  }
}
