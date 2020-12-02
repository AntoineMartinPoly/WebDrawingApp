import { Injectable } from '@angular/core';
import { DELETE_KEYPRESS, LOWER_CASE_A, LOWER_CASE_C, LOWER_CASE_D, LOWER_CASE_V, LOWER_CASE_X } from 'src/constant/keypress/constant';
import { SelectionAction } from 'src/interface/action';
import { DrawingElement } from 'src/interface/drawing-element';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { ShortcutService } from '../../shortcut/shortcut.service';
import { ClipboardService } from '../../tool-service/selection/clipboard/clipboard.service';
import { SelectionService } from '../../tool-service/selection/selection.service';
import { ToolHandler } from '../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionToolHandlerService extends ToolHandler {

  private isMouseDown: boolean;
  private hasMouseMoved: boolean;
  private lastMovedCoord: Point;
  private transformValues: string[];
  private oldTransformValues: string[];
  private selectedDrawingElements: DrawingElement[];
  private modifiedDrawingElements: DrawingElement[];
  private selectionAction: SelectionAction;

  constructor(public selectionService: SelectionService, public clipboardService: ClipboardService,
              public shortcutService: ShortcutService) {
    super();
    this.selectedDrawingElements = [];
    this.modifiedDrawingElements = [];
    this.transformValues = [];
    this.oldTransformValues = [];
  }

  handleMouseDown(event: MouseEvent, keyModifier: KeyModifier) {
    this.shortcutService.changeShortcutAccess(true, false);
    if (!this.isMouseDown) {
      if ( keyModifier.leftKey && this.selectionService.isTargetSelectionCircles(event) ) {
        this.selectionAction = SelectionAction.resize;
        this.lastMovedCoord = this.selectionService.drawer.getCoordinate({ x: event.x, y: event.y });
        this.oldTransformValues = this.transformValues;
      } else if ( keyModifier.leftKey && this.selectionService.isTargetMovable(event) ) {
        this.selectionAction = SelectionAction.translate;
        this.lastMovedCoord = this.selectionService.drawer.getCoordinate({ x: event.x, y: event.y });
        this.oldTransformValues = this.transformValues;
      } else {
        this.selectionService.removeOldSelectionElement();
        this.selectionService.createSelection(this.selectionService.generateSelectionElement(), event);
      }
      this.isMouseDown = true;
    }
  }

  handleMouseUp(event: MouseEvent, keyModifier: KeyModifier) {
    if ( this.selectionAction === SelectionAction.translate || this.selectionAction === SelectionAction.resize ) {
      this.actionService.addAction(this);
    } else if (this.isMouseDown) {
      this.handleSelect(event, keyModifier);
    }
    this.selectionService.resetFirstAction();
    this.isMouseDown = false;
    this.hasMouseMoved = false;
    this.selectionAction = SelectionAction.selecting;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleMouseMove(event: MouseEvent, keyModifier: KeyModifier) {
    if (this.isMouseDown) {
      this.hasMouseMoved = true;
      switch (this.selectionAction) {
        case SelectionAction.translate: {
          this.transformValues = this.selectionService.translateSelection(event, this.selectedDrawingElements, this.lastMovedCoord);
          break;
        }
        case SelectionAction.resize: {
          this.transformValues = this.selectionService.resizeSelection(
            event, this.selectedDrawingElements, this.lastMovedCoord, keyModifier,
          );
          break;
        }
        default: {
          this.selectionService.updateValues(event, keyModifier);
          this.selectionService.editSelection();
          break;
        }
      }
    }
  }

  handleMouseLeave() {
    if ( this.isMouseDown ) {
      this.selectionService.removeOldSelectionElement();
    }
    this.isMouseDown = false;
    this.hasMouseMoved = false;
    this.selectionAction = SelectionAction.selecting;
  }

  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier) {
    this.selectionAction = SelectionAction.rotate;
    this.transformValues = this.selectionService.rotateSelection(this.selectedDrawingElements, keyModifier);
    this.actionService.addAction(this);
    this.oldTransformValues = this.transformValues;
    this.selectionService.resetFirstAction();
  }

  handleSelect(event: MouseEvent, keyModifier: KeyModifier): void {
    if (this.hasMouseMoved ) {
      this.selectedDrawingElements = keyModifier.leftKey ? this.selectionService.selectElementsInBoundary()
        : this.selectionService.reverseSelection(this.selectedDrawingElements, this.selectionService.selectElementsInBoundary());
    } else {
      this.selectedDrawingElements = keyModifier.leftKey ? this.selectionService.selectElement(event)
      : this.selectionService.reverseSelection(this.selectedDrawingElements, this.selectionService.selectElement(event));
    }
  }

  storeAction(): SelectionToolHandlerService {
    const copy = Object.create(this);
    copy.modifiedDrawingElements = this.modifiedDrawingElements;
    copy.selectedDrawingElements = this.selectedDrawingElements;
    copy.selectionAction = this.selectionAction;
    copy.oldTransformValues = this.oldTransformValues;
    copy.transformValues = this.transformValues;
    return copy;
  }

  handleUndo() {
    switch (this.selectionAction) {
      case SelectionAction.translate:
      case SelectionAction.rotate:
      case SelectionAction.resize: {
        this.selectionService.setTranslationsValues(this.selectedDrawingElements, this.oldTransformValues);
        break;
      }
      case SelectionAction.cut:
      case SelectionAction.delete: {
        this.clipboardService.reAddElements(this.modifiedDrawingElements);
        this.selectionService.removeOldSelectionElement();
        break;
      }
      default: {
        this.clipboardService.removeDrawingElementsFromDrawing(this.modifiedDrawingElements);
        this.selectionService.removeOldSelectionElement();
        break;
      }
    }
  }

  handleRedo() {
    switch (this.selectionAction) {
      case SelectionAction.translate:
      case SelectionAction.rotate:
      case SelectionAction.resize: {
        this.selectionService.setTranslationsValues(this.selectedDrawingElements, this.transformValues);
        break;
      }
      case SelectionAction.cut:
      case SelectionAction.delete: {
        this.clipboardService.removeDrawingElementsFromDrawing(this.modifiedDrawingElements);
        this.selectionService.removeOldSelectionElement();
        break;
      }
      default: {
        this.clipboardService.reAddElements(this.modifiedDrawingElements);
        this.selectionService.removeOldSelectionElement();
        break;
      }
    }
  }

  handleCopy() {
    this.clipboardService.copy(this.selectedDrawingElements);
  }

  handleCut() {
    const isCutSuccesful = this.clipboardService.cut(this.selectedDrawingElements);
    if ( isCutSuccesful ) {
      this.selectionService.removeOldSelectionElement();
      this.modifiedDrawingElements = this.selectedDrawingElements;
      this.selectionAction = SelectionAction.cut;
      this.actionService.addAction(this);
    }
  }

  handlePaste() {
    this.modifiedDrawingElements = this.clipboardService.paste();
    if ( this.modifiedDrawingElements.length ) {
      this.selectionService.removeOldSelectionElement();
      this.selectedDrawingElements = this.selectionService.createSelectionFromDrawingElements(this.modifiedDrawingElements);
      this.selectionAction = SelectionAction.paste;
      this.actionService.addAction(this);
      delete(this.modifiedDrawingElements);
    }
  }

  handleDuplicate() {
    this.modifiedDrawingElements = this.clipboardService.duplicate(this.selectedDrawingElements);
    if ( this.modifiedDrawingElements.length ) {
      this.selectionService.removeOldSelectionElement();
      this.selectionAction = SelectionAction.duplicate;
      this.actionService.addAction(this);
      delete(this.modifiedDrawingElements);
    }
  }

  handleSelectAll() {
    this.selectedDrawingElements = this.selectionService.selectAll();
    this.selectionService.resetFirstAction();
  }

  handleDelete() {
    if ( this.selectedDrawingElements && this.selectedDrawingElements.length ) {
      const newRef: DrawingElement[] = [];
      Object.assign(newRef, this.selectedDrawingElements);
      this.modifiedDrawingElements = newRef;
      this.selectionService.deleteSelection(newRef);
      this.selectionAction = SelectionAction.delete;
      this.actionService.addAction(this);
      this.selectionService.removeOldSelectionElement();
    }
  }

  handleCurrentToolChange(): void {
    this.selectionService.removeOldSelectionElement();
    this.selectedDrawingElements = [];
  }

  handleShortcuts(event: KeyboardEvent) {
    if ( event.ctrlKey && event.key === LOWER_CASE_A ) {
      this.handleSelectAll();
      event.preventDefault();
      event.stopPropagation();
    } else if ( event.ctrlKey && event.key === LOWER_CASE_C ) {
      this.handleCopy();
    } else if ( event.ctrlKey && event.key === LOWER_CASE_X ) {
      this.handleCut();
    } else if ( event.ctrlKey && event.key === LOWER_CASE_D ) {
      this.handleDuplicate();
      event.preventDefault();
      event.stopPropagation();
    } else if ( event.ctrlKey && event.key === LOWER_CASE_V ) {
      this.handlePaste();
    } else if ( event.key === DELETE_KEYPRESS ) {
      this.handleDelete();
    }
  }

  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier) { }
  // tslint:disable-next-line: no-empty
  handleDrawingLoad(): void {}
}
