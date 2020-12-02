import { Injectable } from '@angular/core';
import { FIFTEEN, ONE, THREE_HUNDRED_SIXTY, ZERO } from 'src/constant/constant';
import { STAMP } from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Stamp } from 'src/interface/stamp/stamp';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../drawing/drawing.service';
import { ShortcutService } from '../../shortcut/shortcut.service';
import { StampService } from '../../tool-service/stamp/stamp.service';
import { ToolHandler } from '../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class StampToolHandlerService extends ToolHandler {

  stamp: Stamp;
  isMouseDown: boolean;
  deltaAngle: number;
  drawingService: DrawingService;

  constructor(public stampService: StampService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService) {
    super();
    this.isMouseDown = false;
    this.deltaAngle = ZERO;
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown(event: MouseEvent) {
    this.shortcutService.changeShortcutAccess(true, false);
    const isStampImageSelected = this.stampService.getStampUrl();
    if (!this.isMouseDown && isStampImageSelected) {
      this.elementRef = this.stampService.generateStampElement();
      this.stamp = this.stampService.createStamp(this.elementRef, event);
      this.stampService.editStamp(this.stamp);
      this.isMouseDown = true;
      this.actionService.addAction(this);
    }
  }

  handleMouseUp() {
    if ( this.isMouseDown ) {
      this.drawingElementManager.appendDrawingElement(this.stamp);
    }
    this.isMouseDown = false;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  // tslint:disable-next-line: no-empty
  handleMouseMove() { }

  handleMouseLeave() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      DrawingService.getInstance().removeSVGElementFromRef(this.elementRef);
    }
  }

  handleMouseWheel(event: WheelEvent): void {
    if (this.stamp) {
      const absDelta: number = event.altKey ? ONE : FIFTEEN;
      this.deltaAngle = (this.deltaAngle + ((event.deltaY < ZERO) ? -absDelta : absDelta)) % THREE_HUNDRED_SIXTY;
      this.stampService.modifierRotateStamp(this.deltaAngle, this.stamp);
    }
  }

  handleUndo() {
    this.stampService.removeElement(this.stamp);
  }
  handleRedo() {
    this.stampService.reAddElement(this.stamp);
  }

  storeAction(): StampToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.stamp = this.stamp;
    return copy;
  }

  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(STAMP)) {
      const stamp: Stamp =
      this.stampService.createStampFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(stamp);
    }
  }

  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleShortcuts(event: KeyboardEvent): void { }
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void { }
}
