import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IS_NOT_IN_ARRAY, ONE } from 'src/constant/constant';
import {
 UNDEFINED_SELECTION_RECTANGLE, UNDEFINED_SELECTION_VALUE
} from 'src/constant/shape/constant';
import { ResizeState } from 'src/constant/tool-service/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { Rectangle, RectangleValues } from 'src/interface/shape/rectangle';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { SelectionDrawerService } from './modifier/selection-drawer.service';
import { SelectionResizerService } from './modifier/selection-resizer.service';
import { SelectionRotatorService } from './modifier/selection-rotator.service';
import { SelectionTranslatorService } from './modifier/selection-translator.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {

  private selectedDrawingElements: DrawingElement[];
  selectRectangle: Rectangle;
  private aDrawingElementIsSelected: Subject<any>;
  private resizeState: ResizeState;

  constructor(private drawingElementManager: DrawingElementManagerService, public drawer: SelectionDrawerService,
              private translator: SelectionTranslatorService, private resizer: SelectionResizerService,
              private rotator: SelectionRotatorService) {
    this.selectedDrawingElements = [];
    this.aDrawingElementIsSelected = new Subject<boolean>();
    this.selectRectangle = UNDEFINED_SELECTION_RECTANGLE;
    this.resizeState = ResizeState.none;
  }

  isADrawingSelected(): Observable<boolean> {
    return this.aDrawingElementIsSelected.asObservable();
  }

  generateSelectionElement(): ElementRef {
    return this.drawer.generateSelection();
  }

  createSelection(elementRef: ElementRef, event: MouseEvent) {
    const originPoint: Point = this.drawer.getCoordinate({ x: event.x, y: event.y });
    this.selectRectangle = this.drawer.createSelection(elementRef, originPoint);
    this.addSelectionOption(this.selectRectangle);
  }

  addSelectionOption(selection: Rectangle) {
    this.drawer.addSelectionOption(selection);
  }

  updateValues(event: MouseEvent, keyModifier: KeyModifier) {
    this.drawer.updateValues(this.selectRectangle, event, keyModifier);
  }

  editSelection() {
    this.drawer.editSelection(this.selectRectangle);
  }

  removeOldSelectionElement() {
    this.selectedDrawingElements = [];
    if ( this.selectRectangle ) {
      this.drawer.removeCircles();
      this.drawer.removeRefFromDrawing(this.selectRectangle.ref);
      this.selectRectangle = UNDEFINED_SELECTION_RECTANGLE;
    }
    this.aDrawingElementIsSelected.next(false);
  }

  selectElementsInBoundary(): DrawingElement[] {
    const svgElementsOnDrawing = this.drawingElementManager.drawingElementsOnDrawing;
    const selectionBox = this.selectRectangle.ref.getBoundingClientRect();
    this.removeOldSelectionElement();
    svgElementsOnDrawing.forEach((element: DrawingElement) => {
      const elementBox = element.ref.getBoundingClientRect();
      if (this.isInBoundingBox(selectionBox, elementBox)) {
        this.selectedDrawingElements.push(element);
      }
    });
    if ( this.selectedDrawingElements.length ) {
      return this.createSelectionFromDrawingElements(this.selectedDrawingElements);
    }
    return [];
  }

  selectElement(event: MouseEvent): DrawingElement[] {
    const clickedObject = this.drawingElementManager.getClickedDrawingElementFromParent(event);
    this.removeOldSelectionElement();
    if (!clickedObject) {
      return [];
    }
    return this.createSelectionFromDrawingElements([clickedObject]);
  }

  createSelectionFromDrawingElements(drawingElements: DrawingElement[]): DrawingElement[] {
    const selectedBoxValues = this.createSelectionRectangleValues(drawingElements);
    this.createSelection(this.generateSelectionElement(), { x: 0, y: 0 } as MouseEvent);
    this.selectRectangle.value = selectedBoxValues;
    this.selectRectangle.value.origin = this.drawer.getCoordinate(this.selectRectangle.value.origin);
    this.drawer.updateAllSelectionCircles(this.selectRectangle);
    this.editSelection();
    this.selectedDrawingElements = drawingElements;
    if ( drawingElements.length ) {
      this.aDrawingElementIsSelected.next(true);
    }
    return drawingElements;
  }

  createSelectionRectangleValues(drawingElements: DrawingElement[]): RectangleValues {
    let isBoundingBoxDefined = false;
    let selectedBoxValues = UNDEFINED_SELECTION_VALUE;
    drawingElements.forEach((element: DrawingElement) => {
      const elementBox = element.ref.getBoundingClientRect();
      selectedBoxValues = this.updateBoundingBox(selectedBoxValues, elementBox, isBoundingBoxDefined);
      isBoundingBoxDefined = true;
    });
    return selectedBoxValues;
  }

  isInBoundingBox(selection: SVGRect, elementBox: SVGRect) {
    const isInsideX = (selection.x < elementBox.x || selection.x < elementBox.x + elementBox.width)
                   && (selection.x + selection.width > elementBox.x || selection.x + selection.width > elementBox.x + elementBox.width);
    const isInsideY = (selection.y < elementBox.y || selection.y < elementBox.y + elementBox.height)
                   && (selection.y + selection.height > elementBox.y || selection.y + selection.height > elementBox.y + elementBox.height);
    return (isInsideX && isInsideY);
  }

  updateBoundingBox(selectedBox: RectangleValues, elementBox: SVGRect, isBoundingBoxDefined: boolean) {
    if (!isBoundingBoxDefined) {
      selectedBox.origin.x = elementBox.x;
      selectedBox.origin.y = elementBox.y;
      selectedBox.width = elementBox.width;
      selectedBox.height = elementBox.height;
    }
    if (selectedBox.origin.x > elementBox.x) {
      selectedBox.width = selectedBox.width + selectedBox.origin.x - elementBox.x;
      selectedBox.origin.x = elementBox.x;
    }
    if (selectedBox.origin.y > elementBox.y) {
      selectedBox.height = selectedBox.height + selectedBox.origin.y - elementBox.y;
      selectedBox.origin.y = elementBox.y;
    }
    if (selectedBox.origin.x + selectedBox.width < elementBox.x + elementBox.width) {
      selectedBox.width = elementBox.x + elementBox.width - selectedBox.origin.x;
    }
    if (selectedBox.origin.y + selectedBox.height < elementBox.y + elementBox.height) {
      selectedBox.height = elementBox.y + elementBox.height - selectedBox.origin.y;
    }
    return selectedBox;
  }

  deleteSelection(drawingElements: DrawingElement[]): DrawingElement[] {
    for ( const drawingElement of drawingElements) {
      this.drawer.removeRefFromDrawing(drawingElement.ref);
      this.drawingElementManager.removeDrawingElement(drawingElement);
    }
    return this.selectedDrawingElements;
  }

  selectAll(): DrawingElement[] {
    this.removeOldSelectionElement();
    this.createSelectionFromDrawingElements(this.drawingElementManager.drawingElementsOnDrawing);
    return this.selectedDrawingElements;
  }

  reverseSelection(selection: DrawingElement[], selectionToReverse: DrawingElement[]): DrawingElement[] {
    for ( const drawingElementToReverse of selectionToReverse ) {
      const index = selection.indexOf(drawingElementToReverse);
      if ( index !== IS_NOT_IN_ARRAY ) {
        selection.splice(index, ONE);
      } else {
        selection.push(drawingElementToReverse);
      }
    }
    this.removeOldSelectionElement();
    if ( selection.length) {
      this.selectedDrawingElements = this.createSelectionFromDrawingElements(selection);
    }
    return this.selectedDrawingElements;
  }

  setTranslationsValues(drawingElements: DrawingElement[], translationsValue: string[]): void {
    let index = 0;
    for ( const drawingElement of drawingElements ) {
        this.translator.setTransformAttribute(drawingElement.ref, translationsValue[index] ? translationsValue[index] : '');
        index++;
    }
    this.removeOldSelectionElement();
    this.createSelectionFromDrawingElements(drawingElements);
  }

  isTargetSelectionCircles(event: MouseEvent): boolean {
    return this.drawer.isTargetSelectionCircles(event);
  }

  translateSelection(event: MouseEvent, drawingElements: DrawingElement[], initialClick: Point): string[] {
    const transforms = this.translator.translate(drawingElements, this.selectRectangle, event, initialClick);
    this.removeOldSelectionElement();
    this.createSelectionFromDrawingElements(drawingElements);
    return transforms;
  }

  resizeSelection(event: MouseEvent, drawingElements: DrawingElement[], initialClick: Point, keyModifier: KeyModifier): string[] {
    if ( this.resizeState === ResizeState.none ) {
      this.resizeState = this.drawer.getResizeState(event);
    }
    this.selectRectangle.key = keyModifier;
    const newTransform = this.resizer.resize(event, drawingElements, this.selectRectangle, initialClick, this.resizeState);
    this.drawer.updateAllSelectionCircles(this.selectRectangle);
    this.drawer.editSelection(this.selectRectangle);
    return newTransform;
  }

  rotateSelection(drawingElements: DrawingElement[], keyModifier: KeyModifier): string[] {
    this.selectRectangle.key = keyModifier;
    const newTransform = this.rotator.rotate(drawingElements, this.selectRectangle);
    this.removeOldSelectionElement();
    this.createSelectionFromDrawingElements(drawingElements);
    return newTransform;
  }

  resetFirstAction(): void {
    this.resizeState = ResizeState.none;
    this.resizer.resetFirstAction();
    this.rotator.resetFirstAction();
    this.translator.resetFirstAction();
  }

  isTargetMovable(event: MouseEvent): boolean {
    if ( this.selectRectangle.ref.children[FIRST_CHILD] === event.target) {
      return true;
    }
    for ( const drawingElement of this.selectedDrawingElements ) {
      if ( drawingElement.ref === event.target ) {
        return true;
      }
    }
    return false;
  }
}
