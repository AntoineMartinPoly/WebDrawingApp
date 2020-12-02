import { ElementRef, Injectable } from '@angular/core';
import { KeyModifier } from 'src/interface/key-modifier';
import { ActionService } from '../actions/action.service';
import { KeypressService } from '../tool-service/keypress.service';

@Injectable({
  providedIn: 'root',
})
export abstract class ToolHandler {

  static currentToolType: ToolHandler;
  actionService: ActionService;

  elementRef: ElementRef;

  handleKeypress(event: KeyboardEvent) {
    if (KeypressService.isCtrlShiftZ(event)) {
      this.actionService.redoAction();
    } else if (KeypressService.isCtrlZ(event)) {
      this.actionService.undoAction();
    } else {
      this.handleShortcuts(event);
    }
  }

  abstract handleMouseDown(event: MouseEvent, keyModifier?: KeyModifier): void;
  abstract handleMouseUp(event?: MouseEvent, keyModifier?: KeyModifier): void;
  abstract handleMouseMove(event: MouseEvent, keyModifier?: KeyModifier): void;
  abstract handleMouseLeave(): void;
  abstract handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void;
  abstract handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void;
  abstract handleDrawingLoad(): void;
  abstract handleShortcuts(keyModifier: KeyboardEvent): void;
  abstract storeAction(): ToolHandler;
  abstract handleUndo(): void;
  abstract handleRedo(): void;
  abstract handleCurrentToolChange(): void;
}
