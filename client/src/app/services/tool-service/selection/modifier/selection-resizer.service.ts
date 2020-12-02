import { Injectable } from '@angular/core';
import { MagnetismService } from 'src/app/services/magnetism/magnetism.service';
import { ONE, TWO, ZERO } from 'src/constant/constant';
import { MATRIX, ResizeState } from 'src/constant/tool-service/constant';
import { Dimension, DrawingElement } from 'src/interface/drawing-element';
import { Point } from 'src/interface/Point';
import { Rectangle } from 'src/interface/shape/rectangle';
import { SelectionModifierService } from './selection-modifier.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionResizerService extends SelectionModifierService {

  private initialRectDimension: Dimension;

  constructor(private magnetismService: MagnetismService) {
      super();
      this.initialRectDimension = {width: 0, height: 0};
  }

  resize(event: MouseEvent, drawingElements: DrawingElement[], selectRect: Rectangle, initialClick: Point, state: ResizeState): string[] {
      const relativeMousePosition = this.magnetismService.updateCoordinate(event);

      this.setUpInitialTransform(drawingElements, selectRect);

      const newMatrixValue = this.createNewTransformMatrix(selectRect, initialClick, state, relativeMousePosition);

      const newTransformValues: string[] = [];
      for ( const drawingElement of drawingElements ) {
          newTransformValues.push(this.setDrawingElementScaleValue(drawingElement, newMatrixValue));
      }
      this.transformIterator = ZERO;
      return newTransformValues;
  }

  setUpInitialTransform(drawingElements: DrawingElement[], selectRect: Rectangle): void {
      if ( !this.initialTransformValues.length ) {
          for ( const drawingElement of drawingElements ) {
              this.initialTransformValues.push(this.getTransformationsFromDrawingElement(drawingElement));
          }
          this.initialRectDimension.width = selectRect.value.width;
          this.initialRectDimension.height = selectRect.value.height;
      }
  }

  createNewTransformMatrix(selectRect: Rectangle, initialClick: Point, state: ResizeState, relativeMousePosition: Point): string {
      this.setSelectRectangleNewDimension(state, selectRect, relativeMousePosition);
      const newScaleValues = this.createNewScale(state, relativeMousePosition, selectRect, initialClick);
      const newTranslateValues = this.createNewTranslate(state, selectRect, newScaleValues);
      return `${MATRIX}(${newScaleValues.x},0,0,${newScaleValues.y},${newTranslateValues.x},${newTranslateValues.y}) `;
  }

  createNewScale(state: ResizeState, relativeMousePosition: Point, selectRect: Rectangle, firstPoint: Point): Point {
      let xScale = ONE;
      let yScale = ONE;
      switch (state) {
          case ResizeState.top : {
              yScale = (firstPoint.y - relativeMousePosition.y + this.initialRectDimension.height) / (this.initialRectDimension.height);
              break;
          }
          case ResizeState.topRight : {
              xScale = (relativeMousePosition.x - selectRect.value.origin.x) / (firstPoint.x - selectRect.value.origin.x);
              yScale = (firstPoint.y - relativeMousePosition.y + this.initialRectDimension.height) / (this.initialRectDimension.height);
              break;
          }
          case ResizeState.right : {
              xScale = (relativeMousePosition.x - selectRect.value.origin.x) / (firstPoint.x - selectRect.value.origin.x);
              break;
          }
          case ResizeState.bottomRight : {
              xScale = (relativeMousePosition.x - selectRect.value.origin.x) / (firstPoint.x - selectRect.value.origin.x);
              yScale = (relativeMousePosition.y - selectRect.value.origin.y) / (firstPoint.y - selectRect.value.origin.y);
              break;
          }
          case ResizeState.bottom : {
              yScale = (relativeMousePosition.y - selectRect.value.origin.y) / (firstPoint.y - selectRect.value.origin.y);
              break;
          }
          case ResizeState.bottomLeft : {
              xScale = (firstPoint.x - relativeMousePosition.x + this.initialRectDimension.width) / (this.initialRectDimension.width);
              yScale = (relativeMousePosition.y - selectRect.value.origin.y) / (firstPoint.y - selectRect.value.origin.y);
              break;
          }
          case ResizeState.left : {
              xScale = (firstPoint.x - relativeMousePosition.x + this.initialRectDimension.width) / (this.initialRectDimension.width);
              break;
          }
          case ResizeState.topLeft : {
              xScale = (firstPoint.x - relativeMousePosition.x + this.initialRectDimension.width) / (this.initialRectDimension.width);
              yScale = (firstPoint.y - relativeMousePosition.y + this.initialRectDimension.height) / (this.initialRectDimension.height);
              break;
          }
      }
      return selectRect.key.shift ? this.setSquaredSelection({x: xScale, y: yScale}) : {x: xScale, y: yScale};
  }

  createNewRectReferencePoint(state: ResizeState, selectRect: Rectangle): Point {
      switch (state) {
          case ResizeState.top :
          case ResizeState.topRight : {
              return {x: selectRect.value.origin.x, y: selectRect.value.origin.y + selectRect.value.height};
          }
          case ResizeState.bottomLeft :
          case ResizeState.left : {
              return {x: selectRect.value.origin.x + selectRect.value.width, y: selectRect.value.origin.y};
          }
          case ResizeState.topLeft : {
              return {x: selectRect.value.origin.x + selectRect.value.width, y: selectRect.value.origin.y + selectRect.value.height};
          }
          default : {
              return {x: selectRect.value.origin.x, y: selectRect.value.origin.y};
          }
      }
  }

  createNewTranslate(state: ResizeState, selectRect: Rectangle, newScaleValue: Point): Point {
      const newRectPosition = this.createNewRectReferencePoint(state, selectRect);
      let translateValues: Point;
      if ( selectRect.key.altKey ) {
          translateValues = {x: (-newRectPosition.x - this.initialRectDimension.width / TWO) * (newScaleValue.x - ONE),
                              y: (-newRectPosition.y - this.initialRectDimension.height / TWO) * (newScaleValue.y - ONE)};
      } else {
          translateValues = {x: -newRectPosition.x * (newScaleValue.x - ONE), y: -newRectPosition.y * (newScaleValue.y - ONE)};
      }
      return translateValues;
  }

  setSelectRectangleNewDimension(state: ResizeState, selectRect: Rectangle, mousePosition: Point): void {
      switch (state) {
          case ResizeState.top : {
              selectRect.value.height = selectRect.value.height + selectRect.value.origin.y - mousePosition.y;
              selectRect.value.origin.y = mousePosition.y;
              break;
          }
          case ResizeState.topRight : {
              selectRect.value.width = mousePosition.x - selectRect.value.origin.x;
              selectRect.value.height = selectRect.value.height + selectRect.value.origin.y - mousePosition.y;
              selectRect.value.origin.y = mousePosition.y;
              break;
          }
          case ResizeState.right : {
              selectRect.value.width = mousePosition.x - selectRect.value.origin.x;
              break;
          }
          case ResizeState.bottomRight : {
              selectRect.value.width = mousePosition.x - selectRect.value.origin.x;
              selectRect.value.height = mousePosition.y - selectRect.value.origin.y;
              break;
          }
          case ResizeState.bottom : {
              selectRect.value.height = mousePosition.y - selectRect.value.origin.y;
              break;
          }
          case ResizeState.bottomLeft : {
              selectRect.value.width = selectRect.value.width + selectRect.value.origin.x - mousePosition.x;
              selectRect.value.origin.x = mousePosition.x;
              selectRect.value.height = mousePosition.y - selectRect.value.origin.y;
              break;
          }
          case ResizeState.left : {
              selectRect.value.width = selectRect.value.width + selectRect.value.origin.x - mousePosition.x;
              selectRect.value.origin.x = mousePosition.x;
              break;
          }
          case ResizeState.topLeft : {
              selectRect.value.height = selectRect.value.height + selectRect.value.origin.y - mousePosition.y;
              selectRect.value.origin.y = mousePosition.y;
              selectRect.value.width = selectRect.value.width + selectRect.value.origin.x - mousePosition.x;
              selectRect.value.origin.x = mousePosition.x;
              break;
          }
      }
  }

  setSquaredSelection(scale: Point): Point {
      scale.x = Math.max(scale.x, scale.y);
      scale.y = Math.max(scale.x, scale.y);
      return scale;
  }

  setDrawingElementScaleValue(drawingElement: DrawingElement, newTransformMatrix: string): string {
      let newTransform = newTransformMatrix;
      newTransform += this.initialTransformValues[this.transformIterator];
      this.setTransformAttribute(drawingElement.ref, newTransform);
      this.transformIterator++;
      return newTransform;
  }

  resetAdditionnalAttribute(): void {
      this.initialRectDimension = {width: ZERO, height: ZERO};
  }
}
