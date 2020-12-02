import { ElementRef, Injectable } from '@angular/core';
import { FIFTEEN, ONE, PRIMARY_COLOR, THREE_HUNDRED_SIXTY, ZERO } from 'src/constant/constant';
import { DATA_TYPE, FEATHER, FILL, STROKE } from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Feather } from 'src/interface/trace/feather';
import { DrawingElementManagerService } from '../../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../../drawing/drawing.service';
import { ShortcutService } from '../../../shortcut/shortcut.service';
import { FeatherService } from '../../../tool-service/trace/feather/feather.service';
import { ToolHandler } from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class FeatherToolHandlerService extends ToolHandler {

  drawingService: DrawingService;
  path: any;
  feather: Feather;
  isMouseDown: boolean;
  deltaAngle: number;
  featherGroup: ElementRef;

  constructor(public featherService: FeatherService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService) {
    super();
    this.isMouseDown = false;
    this.drawingService = DrawingService.getInstance();
    this.deltaAngle = ZERO;
  }

  handleMouseDown(event: MouseEvent) {
    this.shortcutService.changeShortcutAccess(true, false);
    if (!this.isMouseDown) {
      this.featherGroup = this.featherService.generateGroupTag();
      this.drawingService.setSVGattribute(this.featherGroup, DATA_TYPE, FEATHER);
      this.drawingService.setSVGattribute(this.featherGroup, STROKE, this.featherService.storage.get(PRIMARY_COLOR));
      this.drawingService.setSVGattribute(this.featherGroup, FILL, this.featherService.storage.get(PRIMARY_COLOR));
      this.elementRef = this.featherService.generateFeatherElement();
      this.featherService.setFeatherOption();
      this.featherService.generateFirstLine(event);
      this.featherService.setLastEvent(event);
      this.feather = this.featherService.createFeather(this.featherGroup, event);
      this.drawingElementManager.appendDrawingElement(this.feather);
      this.isMouseDown = true;
    }
  }

  handleMouseLeave() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      DrawingService.getInstance().removeSVGElementFromRef(this.featherService.groupFeather);
    }

  }
  handleMouseUp() {
    this.actionService.addAction(this);
    this.drawingElementManager.appendDrawingElement(this.feather);
    this.isMouseDown = false;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleMouseMove(event: MouseEvent, keyModifier?: KeyModifier) {
    if (this.isMouseDown) {
      this.featherService.setFeatherOption();
      this.featherService.updateFeatherPath(event);
      this.featherService.setLastEvent(event);
      /*this.drawingElementManager.appendDrawingElement(this.feather);  (TODO: undo/redo)*/
      this.isMouseDown = true;
    }
  }

  handleUndo() {
    this.featherService.removeElement(this.feather);
  }
  handleRedo() {
    this.featherService.reAddElement(this.feather);
  }

  storeAction(): FeatherToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.feather = this.feather;
    copy.path = this.path;
    copy.featherGroup = this.featherGroup;
    return copy;
  }

  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(FEATHER)) {
      const feather: Feather =
        this.featherService.createFeatherFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(feather);
    }

  }

  handleMouseWheel(event: WheelEvent): void {
    const absDelta: number = event.altKey ? ONE : FIFTEEN;
    this.deltaAngle = (this.deltaAngle + ((event.deltaY < ZERO) ? -absDelta : absDelta)) % THREE_HUNDRED_SIXTY;
    this.featherService.sendRotationAngle(this.deltaAngle);
  }

  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleShortcuts(event: KeyboardEvent): void { }
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void { }
}
