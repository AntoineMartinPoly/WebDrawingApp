import {ElementRef, Injectable} from '@angular/core';
import { BACKSPACE, ENTER, UNDESIRABLE_KEYS } from 'src/constant/keypress/constant';
import { TEXT } from 'src/constant/svg/constant';
import { NEW_LINE } from 'src/constant/toolbar/text/constant';
import { Point } from 'src/interface/Point';
import {KeyModifier} from '../../../../interface/key-modifier';
import {Text, TextState} from '../../../../interface/text/text';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../drawing/drawing.service';
import { ShortcutService } from '../../shortcut/shortcut.service';
import { KeypressService } from '../../tool-service/keypress.service';
import {TextService} from '../../tool-service/text/text.service';
import {ToolHandler} from '../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TextToolHandlerService extends ToolHandler {

  text: Text;
  newLine: number;
  lastTextBox: ElementRef;
  state: TextState;
  enableKeyPress: boolean;
  textOrigin: Point;

  constructor(public textService: TextService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService) {
    super();
    this.newLine = NEW_LINE;
    this.state = TextState.deSelected;
    this.enableKeyPress = true;
  }

  handleMouseDown(event: MouseEvent): void {
    this.newLine = NEW_LINE;
    this.shortcutService.changeShortcutAccess(false, false);
    if (this.state === TextState.deSelected || this.state === TextState.selected) {
      this.textOrigin = {x: event.x, y: event.y};
      this.state = TextState.selected;
    } else if (this.state === TextState.writing) {
      this.textService.removeTextBox(this.lastTextBox);
      this.actionService.addAction(this);
      this.drawingElementManager.appendDrawingElement(this.text);
      this.state = TextState.deSelected;
    }
  }

  handleKeypress(event: KeyboardEvent): void {
    if (this.state === TextState.selected) {
      this.handleKeypressStateSelected();
      this.state = TextState.writing;
      this.shortcutService.changeShortcutAccess(true, false);
    }
    if (this.enableKeyPress && this.state === TextState.writing) {
      this.handleKeypressStateWriting(event);
    }
    if (this.state === TextState.deSelected) {
      this.handleShortcuts(event);
    }
  }

  handleShortcuts(event: KeyboardEvent): void {
    if (KeypressService.isCtrlShiftZ(event)) {
      this.actionService.redoAction();
    } else if (KeypressService.isCtrlZ(event)) {
      this.actionService.undoAction();
    }
  }

  handleKeypressStateSelected() {
    this.elementRef = this.textService.generateTextElement();
    this.text = this.textService.createText(this.elementRef, this.textOrigin);
    this.textService.editText(this.text);
    this.textService.updateTextBox();
    this.lastTextBox = this.textService.textBox;
  }

  handleKeypressStateWriting(event: KeyboardEvent) {
    let isKeyUndesirable = false;
    UNDESIRABLE_KEYS.forEach((key) => {
      if (key === event.key) { isKeyUndesirable = true; }
    });
    if (event.key === ENTER) {
      this.textService.generateNewLineText(this.elementRef);
      this.newLine++;
    } else if (event.key === BACKSPACE) {
      this.textService.deleteText();
    } else if (!isKeyUndesirable) {
      this.textService.typeText(event.key);
    }
    this.textService.updateLine();
    this.textService.updateTextBox();
  }

  toggleKeypress() {
    this.enableKeyPress = !this.enableKeyPress;
  }

  handleUndo() {
    this.textService.removeElement(this.text);
  }

  handleRedo() {
    this.textService.reAddElement(this.text);
  }

  storeAction(): TextToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.text = this.text;
    return copy;
  }

  handleDrawingLoad(): void {
    for (const element of DrawingService.getInstance().getElementsTable(TEXT)) {
      const text: Text =
      this.textService.createTextFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(text);
    }
  }

  handleCurrentToolChange(): void {
    if (this.state === TextState.writing) {
      this.textService.removeTextBox(this.lastTextBox);
      this.actionService.addAction(this);
      this.drawingElementManager.appendDrawingElement(this.text);
      this.state = TextState.deSelected;
    }
  }

  // tslint:disable-next-line: no-empty
  handleMouseMove(event: MouseEvent, keyModifier: KeyModifier) { }
  // tslint:disable-next-line:no-empty
  handleMouseWheel(event: WheelEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleMouseUp() { }
  // tslint:disable-next-line: no-empty
  handleMouseLeave() { }

}
