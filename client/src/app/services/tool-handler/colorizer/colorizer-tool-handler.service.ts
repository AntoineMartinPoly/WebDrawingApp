import { Injectable } from '@angular/core';
import { DrawingElement } from 'src/interface/drawing-element';
import { KeyModifier } from 'src/interface/key-modifier';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { ColorizerService } from '../../tool-service/colorizer/colorizer.service';
import { PipetteService } from '../../tool-service/pipette/pipette.service';
import { ToolHandler } from '../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ColorizerToolHandlerService extends ToolHandler {

  colorizedObject: DrawingElement;
  usedColor: string;
  previousColor: string;
  keyModifier: KeyModifier;

  constructor(public colorizerService: ColorizerService, public pipetteService: PipetteService,
              public drawingElementManager: DrawingElementManagerService) {
    super();
  }

  handleMouseDown(event: MouseEvent, keyModifier: KeyModifier): void {
    const clickedDrawingElement = this.drawingElementManager.getClickedDrawingElementFromParent(event);
    if (clickedDrawingElement) {
      this.keyModifier = keyModifier;
      this.colorizedObject = clickedDrawingElement.ref;
      this.previousColor = this.pipetteService.getColor(clickedDrawingElement.ref, keyModifier, event, false);
      this.usedColor = this.colorizerService.colorize(clickedDrawingElement.ref, keyModifier);
      if (this.usedColor !== this.previousColor) {
        this.actionService.addAction(this);
      }
    }
  }

  handleUndo() {
    this.colorizerService.colorize(this.colorizedObject, this.keyModifier, this.previousColor);
  }
  handleRedo() {
    this.colorizerService.colorize(this.colorizedObject, this.keyModifier, this.usedColor);
  }

  storeAction(): ColorizerToolHandlerService {
    const copy = Object.create(this);
    copy.colorizedObject = this.colorizedObject;
    copy.usedColor = this.usedColor;
    copy.previousColor = this.previousColor;
    copy.keyModifier = this.keyModifier;
    return copy;
  }

  // tslint:disable-next-line: no-empty
  handleMouseUp(event: MouseEvent, keyModifier: KeyModifier): void {}
  // tslint:disable-next-line: no-empty
  handleMouseMove(event: MouseEvent, keyModifier: KeyModifier): void {}
  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void {}
  // tslint:disable-next-line: no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void {}
  // tslint:disable-next-line: no-empty
  handleShortcuts(event: KeyboardEvent): void {}
  // tslint:disable-next-line: no-empty
  handleMouseLeave(): void { }
  // tslint:disable-next-line: no-empty
  handleDrawingLoad(): void {}
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void {}
}
