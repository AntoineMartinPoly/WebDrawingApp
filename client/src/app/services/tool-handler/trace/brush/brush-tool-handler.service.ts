import { Injectable} from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { BrushService } from 'src/app/services/tool-service/trace/brush/brush.service';
import { BRUSH } from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Brush } from 'src/interface/trace/brush';
import { ToolHandler } from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class BrushToolHandlerService extends ToolHandler {

  brush: Brush;
  isMouseDown: boolean;
  drawingService: DrawingService;

  constructor(public brushService: BrushService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService) {
    super();
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown(event: MouseEvent) {
    if (!this.isMouseDown) {
      this.shortcutService.changeShortcutAccess(true, false);
      this.elementRef = this.brushService.generateBrushElement();
      this.brush = this.brushService.createBrush(this.elementRef, event);
      this.brushService.updatePath(this.brush, event);
      this.brushService.editBrushPath(this.brush);
      this.isMouseDown = true;
    }
  }

  handleMouseUp() {
    this.drawingElementManager.appendDrawingElement(this.brush);
    this.actionService.addAction(this);
    this.isMouseDown = false;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isMouseDown) {
      this.brushService.updatePath(this.brush, event);
      this.brushService.editBrushPath(this.brush);
    }
  }

  handleMouseLeave() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.drawingService.removeSVGElementFromRef(this.elementRef);
    }
  }

  handleUndo() {
    this.brushService.removeElement(this.brush);
  }
  handleRedo() {
    this.brushService.reAddElement(this.brush);
  }

  storeAction(): BrushToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.brush = this.brush;
    return copy;
  }

  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void { }

  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(BRUSH)) {
      const brush: Brush =
      this.brushService.createBrushFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(brush);
    }
  }

  // tslint:disable-next-line: no-empty
  handleShortcuts(event: KeyboardEvent): void { }
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void { }
}
