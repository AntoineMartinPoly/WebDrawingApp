import { Injectable } from '@angular/core';
import { TWO, ZERO } from 'src/constant/constant';
import { ROTATE } from 'src/constant/svg/constant';
import { DEFAULT_POINT, DEFAULT_ROTATION_DEGREE, REDUCED_ROTATION_DEGREE } from 'src/constant/tool-service/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { Rectangle } from 'src/interface/shape/rectangle';
import { SelectionModifierService } from './selection-modifier.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionRotatorService extends SelectionModifierService {

  private rotateDegree: number;
  private rotatePoint: Point;
  private drawingElementsRotatePoints: Point[];

  constructor() {
      super();
      this.rotateDegree = ZERO;
      this.rotatePoint = DEFAULT_POINT;
  }

  rotate(drawingElements: DrawingElement[], selectRect: Rectangle): string[] {
      const newTransformValue: string[] = [];
      this.setUpInitialTransform(drawingElements, selectRect);
      const rotateDegree = this.getRotateDegre(selectRect.key);
      for ( const drawingElement of drawingElements ) {
          newTransformValue.push(this.setDrawingElementRotateValue(drawingElement, rotateDegree, selectRect.key));
      }
      this.transformIterator = ZERO;
      return newTransformValue;
  }

  setUpInitialTransform(drawingElements: DrawingElement[], selectRect: Rectangle): void {
      if ( !this.initialTransformValues.length || ( selectRect.key.shift && !this.drawingElementsRotatePoints.length ) ) {
          for ( const drawingElement of drawingElements ) {
              this.initialTransformValues.push(this.getTransformationsFromDrawingElement(drawingElement));
              if ( selectRect.key.shift ) {
                  this.drawingElementsRotatePoints.push(this.getDrawingElementRotationPoint(drawingElement));
              }
          }
          this.rotatePoint = this.getNewRotationPoint(selectRect);
      }
    }

  getNewRotationPoint(selectRect: Rectangle): Point {
      const xCoord = selectRect.value.origin.x + selectRect.value.width / TWO;
      const yCoord = selectRect.value.origin.y + selectRect.value.height / TWO;
      return {x: xCoord, y: yCoord};
  }

  getDrawingElementRotationPoint(drawingElement: DrawingElement): Point {
      const bbox = drawingElement.ref.getBoundingClientRect();
      const relativeBbox = this.drawingService.getRelativeCoordinates({x: bbox.x, y: bbox.y});
      const xCoord = relativeBbox.x + bbox.width / TWO;
      const yCoord = relativeBbox.y + bbox.height / TWO;
      return {x: xCoord, y: yCoord};
  }

  getRotateDegre(keyModifier: KeyModifier): number {
      if ( keyModifier.wheelUp ) {
          return keyModifier.altKey ? this.rotateDegree += REDUCED_ROTATION_DEGREE : this.rotateDegree += DEFAULT_ROTATION_DEGREE;
      } else {
          return keyModifier.altKey ? this.rotateDegree -= REDUCED_ROTATION_DEGREE : this.rotateDegree -= DEFAULT_ROTATION_DEGREE;
      }
  }

  setDrawingElementRotateValue(drawingElement: DrawingElement, degree: number, keyModifier: KeyModifier): string {
      let newTransform = `${ROTATE}(${degree},` +
                          `${keyModifier.shift ? this.drawingElementsRotatePoints[this.transformIterator].x : this.rotatePoint.x},` +
                          `${keyModifier.shift ? this.drawingElementsRotatePoints[this.transformIterator].y : this.rotatePoint.y}) `;
      newTransform += this.initialTransformValues[this.transformIterator];
      this.setTransformAttribute(drawingElement.ref, newTransform);
      this.transformIterator++;
      return newTransform;
  }

  resetAdditionnalAttribute(): void {
      this.rotateDegree = ZERO;
      this.rotatePoint = DEFAULT_POINT;
      this.drawingElementsRotatePoints = [];
  }
}
