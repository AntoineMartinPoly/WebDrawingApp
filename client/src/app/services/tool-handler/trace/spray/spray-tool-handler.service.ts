import {ElementRef, Injectable} from '@angular/core';
import {SPRAY} from '../../../../../constant/svg/constant';
import {KeyModifier} from '../../../../../interface/key-modifier';
import {Spray} from '../../../../../interface/spray/spray';
import {DrawingElementManagerService} from '../../../drawing-element-manager/drawing-element-manager.service';
import {DrawingService} from '../../../drawing/drawing.service';
import {ShortcutService} from '../../../shortcut/shortcut.service';
import {SprayService} from '../../../tool-service/trace/spray/spray.service';
import {ToolHandler} from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class SprayToolHandlerService extends ToolHandler {
  private drawingService: DrawingService;
  private isMouseDown: boolean;
  private sprayGroup: ElementRef;
  private spray: Spray;

  constructor(private sprayService: SprayService, private shortcutService: ShortcutService,
              private drawingElementManager: DrawingElementManagerService) {
    super();
    this.isMouseDown = false;
    this.drawingService = DrawingService.getInstance();
  }

  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(SPRAY)) {
      this.drawingElementManager.appendDrawingElement(
        this.sprayService.createSprayFromSVGElement(element));
    }
  }

  handleMouseDown(event: MouseEvent, keyModifier?: KeyModifier): void {
    this.shortcutService.changeShortcutAccess(false, false);
    this.sprayService.saveState();
    if (!this.isMouseDown) {
      this.sprayService.currentPosition = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
      this.sprayGroup = this.sprayService.generateSprayGroup();
      this.sprayService.startSpraying();
      this.spray = this.sprayService.createSpray(this.sprayGroup);
      this.isMouseDown = true;
    }
  }

  handleMouseUp(event?: MouseEvent, keyModifier?: KeyModifier): void {
    this.shortcutService.changeShortcutAccess(true, true);
    if (this.isMouseDown) {
      this.drawingElementManager.appendDrawingElement(this.spray);
      this.actionService.addAction(this);
      this.sprayService.stopSpraying();
      this.isMouseDown = false;
    }
  }

  handleMouseMove(event: MouseEvent, keyModifier?: KeyModifier): void {
    this.sprayService.currentPosition = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
    if (this.isMouseDown) {
      this.sprayService.generateSprayElement();
    }
  }

  handleMouseLeave(): void {
    this.shortcutService.changeShortcutAccess(true, true);
    if (this.isMouseDown) {
      this.sprayService.stopSpraying();
      this.isMouseDown = false;
      this.drawingService.removeSVGElementFromRef(this.sprayService.sprayGroup);
    }
  }

  handleUndo() {
    this.sprayService.removeElement(this.spray);
  }
  handleRedo() {
    this.sprayService.reAddElement(this.spray);
  }

  storeAction(): ToolHandler {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.spray = this.spray;
    copy.sprayGroup = this.sprayGroup;
    return copy;
  }

  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleShortcuts(event: KeyboardEvent): void { }
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void { }
}
