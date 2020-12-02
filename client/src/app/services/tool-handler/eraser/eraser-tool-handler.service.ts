import { Injectable } from '@angular/core';
import { DrawingElement } from 'src/interface/drawing-element';
import { KeyModifier } from 'src/interface/key-modifier';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { ShortcutService } from '../../shortcut/shortcut.service';
import { EraserService } from '../../tool-service/eraser/eraser.service';
import { ToolHandler } from '../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class EraserToolHandlerService extends ToolHandler {

  mouseDown: boolean;
  lastDrawingElementRef: any;
  drawingElementDeleted: DrawingElement[];

  constructor(public eraser: EraserService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService) {
    super();
    this.drawingElementDeleted = [];
    this.eraser.cursorExist = false;
    this.eraser.generateCursor({x: 0, y: 0} as any); // temp fix
  }

  handleMouseDown(event: MouseEvent, keyModifier: KeyModifier): void {
    this.shortcutService.changeShortcutAccess(true, false);
    if ( !this.mouseDown && keyModifier.leftKey ) {
      const drawingElement = this.drawingElementManager.getClickedDrawingElementFromParent(event);
      if ( drawingElement ) {
        this.drawingElementDeleted.push(drawingElement);
        this.eraser.erase(drawingElement);
      }
      this.mouseDown = true;
    }
  }

  handleMouseUp(): void {
    this.mouseDown = false;
    if (this.drawingElementDeleted.length !== 0) {
      this.actionService.addAction(this);
      this.drawingElementDeleted = [];
    }
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleMouseMove(event: MouseEvent, keyModifier: KeyModifier): void {
    this.eraser.generateCursor(event);
    if ( this.mouseDown && keyModifier.leftKey && event.target !== this.eraser.cursorSVGElement ) {
      const drawingElement = this.drawingElementManager.getClickedDrawingElementFromParent(event);
      if ( drawingElement ) {
        this.drawingElementDeleted.push(drawingElement);
        this.eraser.erase(drawingElement);
      }
    } else if ( !this.mouseDown ) {
      this.surroundSVGElementWithRed(event);
    }
  }

  handleMouseLeave(): void {
    this.eraser.removeCursor();
    this.mouseDown = false;
  }

  surroundSVGElementWithRed(event: MouseEvent) {
    const drawingGroup = this.drawingElementManager.getClickedDrawingElementFromParent(event);
    if ( drawingGroup ) {
      for ( const drawingElementRef of drawingGroup.ref.children ) {
        if ( this.lastDrawingElementRef !== drawingElementRef ) {
          this.lastDrawingElementRef = drawingElementRef;
          this.eraser.removedContourElement();
        }
        this.eraser.surroundRed(drawingElementRef);
      }
    } else if ( !drawingGroup && event.target !== this.eraser.cursorSVGElement ) {
      this.eraser.removedContourElement();
    }
  }

  storeAction(): EraserToolHandlerService {
    const copy = Object.create(this);
    copy.drawingElementDeleted = this.drawingElementDeleted;
    return copy;
  }

  handleUndo(): void {
    this.eraser.reAddDeletedElement(this.drawingElementDeleted);
  }

  handleRedo(): void {
    this.eraser.removeElement(this.drawingElementDeleted);
  }

  handleCurrentToolChange(): void {
    this.eraser.removeCursor();
  }

  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleShortcuts(keyModifier: KeyboardEvent): void {}
  // tslint:disable-next-line: no-empty
  handleDrawingLoad(): void {}
}
