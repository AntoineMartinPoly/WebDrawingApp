import { Injectable } from '@angular/core';
import { MagnetismService } from 'src/app/services/magnetism/magnetism.service';
import { DEFAULT_POINT, TRANSLATE } from 'src/constant/tool-service/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { Point } from 'src/interface/Point';
import { Rectangle } from 'src/interface/shape/rectangle';
import { SelectionModifierService } from './selection-modifier.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionTranslatorService extends SelectionModifierService {

  initialPosition: Point;

  constructor(private magnetismService: MagnetismService) {
    super();
    this.initialPosition = DEFAULT_POINT;
  }

  translate(drawingElements: DrawingElement[], selectRect: Rectangle, event: MouseEvent, initialClick: Point): string[] {
    const newCoord: Point = this.magnetismService.updateCoordinate(event);
    const newTranslate: Point = {x: newCoord.x - initialClick.x, y: newCoord.y - initialClick.y};
    this.setUpInitialTransform(drawingElements, selectRect);
    const newTranslationsValues: string[] = [];
    for ( const drawingElement of drawingElements ) {
      newTranslationsValues.push(this.setDrawingElementTranslateValue(drawingElement, newTranslate));
    }
    this.setSelectRectangleNewDimension(selectRect, newCoord, initialClick);
    this.transformIterator = 0;
    return newTranslationsValues;
  }

  setUpInitialTransform(drawingElements: DrawingElement[], selectRect: Rectangle): void {
    if ( !this.initialTransformValues.length ) {
      for ( const drawingElement of drawingElements ) {
        this.initialTransformValues.push(this.getTransformationsFromDrawingElement(drawingElement));
      }
      this.initialPosition.x = selectRect.value.origin.x;
      this.initialPosition.y = selectRect.value.origin.y;
    }
  }

  setDrawingElementTranslateValue(drawingElement: DrawingElement, newTranslateValues: Point): string {
    let newTransform = `${TRANSLATE}(${newTranslateValues.x},${newTranslateValues.y}) `;
    newTransform += this.initialTransformValues[this.transformIterator];
    this.setTransformAttribute(drawingElement.ref, newTransform);
    this.transformIterator++;
    return newTransform;
  }

  setSelectRectangleNewDimension(selectRect: Rectangle, mousePosition: Point, initialClick: Point): void {
    selectRect.value.origin.x = this.initialPosition.x + mousePosition.x - initialClick.x;
    selectRect.value.origin.y = this.initialPosition.y + mousePosition.y - initialClick.y;
  }
}
