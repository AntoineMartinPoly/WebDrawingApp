import { Injectable } from '@angular/core';
import { KeyModifier } from 'src/interface/key-modifier';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../drawing/drawing.service';
import { PipetteService } from '../../tool-service/pipette/pipette.service';
import { ToolHandler } from '../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PipetteToolHandlerService extends ToolHandler {

  drawingService: DrawingService;
  usedColor: string;

  constructor(public pipetteService: PipetteService, public drawingElementManager: DrawingElementManagerService) {
    super();
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown(event: MouseEvent, keyModifier: KeyModifier): void {
    if (!this.drawingService.isEventTargetBackgroundElement(event)) {
      const clickedDrawingElement = this.drawingElementManager.getClickedDrawingElementFromParent(event);
      if (clickedDrawingElement) {
        this.pipetteService.getColor(clickedDrawingElement.ref, keyModifier, event);
      }
    }
  }

  storeAction(): PipetteToolHandlerService {
    return this;
  }

  // tslint:disable-next-line: no-empty
  handleMouseUp(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleMouseMove(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleShortcuts(event: KeyboardEvent): void {}
  // tslint:disable-next-line: no-empty
  handleDrawingLoad(): void {}
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void {}
  // tslint:disable-next-line: no-empty
  handleUndo() {}
  // tslint:disable-next-line: no-empty
  handleRedo() {}
  // tslint:disable-next-line: no-empty
  handleMouseLeave(): void {}
}
