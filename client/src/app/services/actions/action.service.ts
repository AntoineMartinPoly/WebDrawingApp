import { Injectable } from '@angular/core';
import { ONE, ZERO } from 'src/constant/constant';
import { ToolHandler } from '../tool-handler/tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ActionService {

  private actionList: ToolHandler[];
  iteratorIndex: number;

  constructor() {
    this.clearActions();
  }

  addAction(action: ToolHandler) {
    const isActionUndone = this.iteratorIndex !== this.actionList.length;
    if (isActionUndone) {
      this.actionList.length = this.iteratorIndex;
    }
    this.actionList.push(action.storeAction());
    this.iteratorIndex = this.actionList.length;
  }

  clearActions() {
    this.actionList = [];
    this.iteratorIndex = ZERO;
  }

  undoAction(): boolean {
    const isIteratorAtBeginning = this.iteratorIndex === ZERO;
    if (isIteratorAtBeginning) {
      return false;
    }
    this.iteratorIndex = this.iteratorIndex - ONE;
    this.actionList[this.iteratorIndex].handleUndo();
    return true;
  }

  redoAction(): boolean {
    const isIteratorAtEnd = this.iteratorIndex === this.actionList.length;
    if (isIteratorAtEnd) {
      return false;
    }
    this.actionList[this.iteratorIndex].handleRedo();
    this.iteratorIndex = this.iteratorIndex + ONE;
    return true;
  }

  isRedoAvailable(): boolean {
    return this.iteratorIndex !== this.actionList.length;
  }

  isUndoAvailable(): boolean {
    return this.iteratorIndex !== ZERO;
  }
}
