import { ElementRef, Injectable } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { PEN } from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Pen } from 'src/interface/trace/pen';
import { DrawingService } from '../../../drawing/drawing.service';
import { PenService } from '../../../tool-service/trace/pen/pen.service';
import { ToolHandler } from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PenToolHandlerService extends ToolHandler {

  pen: Pen;
  isMouseDown: boolean;
  pathSVGref: ElementRef;
  penGroup: ElementRef;
  drawingService: DrawingService;

  constructor(public penService: PenService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService) {
    super();
    this.isMouseDown = false;
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown(event: MouseEvent, keyModifier?: KeyModifier): void {
    this.shortcutService.changeShortcutAccess(true, false);
    if (!this.isMouseDown) {
      this.penGroup = this.penService.generateGpenTag();
      this.pathSVGref = this.penService.generatePenElement();
      this.pen = this.penService.createPen(this.penGroup, event);
      this.isMouseDown = true;
    }

  }

  handleMouseLeave(): void {
   if (this.isMouseDown) {
      this.isMouseDown = false;
      DrawingService.getInstance().removeSVGElementFromRef(this.penService.gPen);
    }
  }

  handleMouseMove(event: MouseEvent, keyModifier?: KeyModifier): void {
   if (this.isMouseDown) {
      this.penService.updatePath(this.pen, event);
    }
  }

  handleMouseUp(event?: MouseEvent, keyModifier?: KeyModifier): void {
    this.drawingElementManager.appendDrawingElement(this.pen);
    this.actionService.addAction(this);
    this.isMouseDown = false;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleUndo() {
    this.penService.removeElement(this.pen);
  }
  handleRedo() {
    this.penService.reAddElement(this.pen);
  }

  storeAction(): PenToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.pen = this.pen;
    copy.pathSVGref = this.pathSVGref;
    copy.penGroup = this.penGroup;
    return copy;
  }

  // tslint:disable-next-line:no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line:no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line:no-empty
  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(PEN)) {
      const pen: Pen =
      this.penService.createPenFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(pen);
    }
  }
  // tslint:disable-next-line:no-empty
  handleShortcuts(): void { }
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void { }
}
