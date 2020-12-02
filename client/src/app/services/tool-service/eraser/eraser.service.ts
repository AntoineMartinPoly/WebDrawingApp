import { Injectable } from '@angular/core';
import { DECIMAL, ZERO } from 'src/constant/constant';
import { ERASER_DIAMETER } from 'src/constant/storage/constant';
import { ERASER_COLOR_STROKE, ERASER_CURSOR_STROKE, ERASER_CURSOR_STROKE_WIDTH,
  ERASER_STROKE_WIDTH, FILL, FILL_OPACITY, HEIGHT, NONE, OPACITY_FULL,
  POINTERS_EVENT, RECT, STROKE, STROKE_OPACITY, STROKE_WIDTH, WHITE, WIDTH, X, Y, ZERO_OPACITY } from 'src/constant/svg/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../drawing/drawing.service';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class EraserService {

  drawingService: DrawingService;
  lastSVGElement: any = {};
  contourElement: any;
  cursorSVGElement: any;
  cursorExist: boolean;

  constructor(public storage: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  erase(drawingElement: DrawingElement): void {
    this.drawingService.removeSVGElementFromRef(drawingElement.ref);
    this.drawingElementManager.removeDrawingElement(drawingElement);
    this.removedContourElement();
  }

  surroundRed(drawingElementRef: any): void {
    if ( this.lastSVGElement !== drawingElementRef ) {
      this.contourElement = this.drawingService.generateSVGElement(drawingElementRef.localName);
      this.drawingService.insertBeforeSVGElement(this.contourElement, this.drawingService.getParentSVG(drawingElementRef));
      this.setAllAttributes(drawingElementRef, this.contourElement);
      this.setAllAttributes(this.drawingService.getParentSVG(drawingElementRef), this.contourElement);

      const contourStrokeWidth = this.getContourStrokeWidth(this.drawingService.getParentSVG(drawingElementRef));
      this.drawingService.setSVGattribute(this.contourElement, STROKE, ERASER_COLOR_STROKE);
      this.drawingService.setSVGattribute(this.contourElement, STROKE_WIDTH, contourStrokeWidth);
      this.drawingService.setSVGattribute(this.contourElement, STROKE_OPACITY, OPACITY_FULL);
      this.drawingService.setSVGattribute(this.contourElement, FILL_OPACITY, ZERO_OPACITY);

      this.lastSVGElement = drawingElementRef;
    }
  }

  getContourStrokeWidth(elementRef: any): string {
    let strokeWidth: number = ERASER_STROKE_WIDTH;
    for ( const attribute of elementRef.attributes) {
      if ( attribute.name === STROKE_WIDTH) {
        strokeWidth += parseInt(attribute.value, DECIMAL);
      }
    }
    return strokeWidth.toString();
  }

  removedContourElement(): void {
    if ( this.contourElement ) {
      this.drawingService.removeSVGElementFromRef(this.contourElement);
      this.contourElement = ZERO;
      this.lastSVGElement = {};
    }
  }

  setAllAttributes(getRefAtt: any, setRefAtt: any): void {
    for ( const attribute of getRefAtt.attributes) {
      this.drawingService.setSVGattribute(setRefAtt, attribute.name, attribute.value);
    }
  }

  generateCursor(event: MouseEvent): void {
    if ( !this.cursorExist ) {
      this.cursorSVGElement = this.drawingService.generateSVGElement(RECT);
      this.drawingService.addSVGElementFromRef(this.cursorSVGElement);
      this.drawingService.setSVGattribute(this.cursorSVGElement, STROKE, ERASER_CURSOR_STROKE);
      this.drawingService.setSVGattribute(this.cursorSVGElement, STROKE_WIDTH, ERASER_CURSOR_STROKE_WIDTH);
      this.drawingService.setSVGattribute(this.cursorSVGElement, FILL, WHITE);
      this.drawingService.setSVGattribute(this.cursorSVGElement, POINTERS_EVENT, NONE);
      this.setCursorDiameter(this.storage.get(ERASER_DIAMETER));
      this.cursorExist = true;
    }
    const relativeCoord = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
    this.drawingService.setSVGattribute(this.cursorSVGElement, X, relativeCoord.x.toString());
    this.drawingService.setSVGattribute(this.cursorSVGElement, Y, relativeCoord.y.toString());
  }

  setCursorDiameter(diameter: string): void {
    this.drawingService.setSVGattribute(this.cursorSVGElement, HEIGHT, diameter);
    this.drawingService.setSVGattribute(this.cursorSVGElement, WIDTH, diameter);
  }

  removeCursor(): void {
    this.drawingService.removeSVGElementFromRef(this.cursorSVGElement);
    this.cursorExist = false;
  }

  reAddDeletedElement(drawingElements: DrawingElement[]): void {
    for ( const drawingElement of drawingElements ) {
      this.drawingService.addSVGElementFromRef(drawingElement.ref);
      this.drawingElementManager.appendDrawingElement(drawingElement);
    }
  }

  removeElement(drawingElements: DrawingElement[]): void {
    for ( const drawingElement of drawingElements ) {
      this.drawingService.removeSVGElementFromRef(drawingElement.ref);
      this.drawingElementManager.removeDrawingElement(drawingElement);
    }
  }
}
