import {ElementRef, Injectable} from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { PencilService } from 'src/app/services/tool-service/trace/pencil/pencil.service';
import { PENCIL } from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Pencil } from 'src/interface/trace/pencil';
import { ToolHandler } from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PencilToolHandlerService extends ToolHandler {

  pencil: Pencil;
  isMouseDown: boolean;
  pathSVGref: ElementRef;
  drawingService: DrawingService;

  constructor(public pencilService: PencilService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService) {
    super();
    this.isMouseDown = false;
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown(event: MouseEvent) {
    this.shortcutService.changeShortcutAccess(true, false);
    if (!this.isMouseDown) {
      this.pathSVGref = this.pencilService.generatePencilElement();
      this.pencil = this.pencilService.createPencil(this.pathSVGref, event);
      this.pencilService.updatePath(this.pencil, event);
      this.pencilService.editSVGpath(this.pencil);
      this.isMouseDown = true;
    }
  }

  handleMouseUp() {
    this.drawingElementManager.appendDrawingElement(this.pencil);
    this.actionService.addAction(this);
    this.isMouseDown = false;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isMouseDown) {
      this.pencilService.updatePath(this.pencil, event);
      this.pencilService.editSVGpath(this.pencil);
    }
  }

  handleMouseLeave() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      DrawingService.getInstance().removeSVGElementFromRef(this.pathSVGref);

    }
  }

  handleUndo() {
    this.pencilService.removeElement(this.pencil);
  }
  handleRedo() {
    this.pencilService.reAddElement(this.pencil);
  }

  storeAction(): PencilToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.pencil = this.pencil;
    return copy;
  }

  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void { }

  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(PENCIL)) {
      const pencil: Pencil =
      this.pencilService.createPencilFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(pencil);
    }
  }

  // tslint:disable-next-line: no-empty
  handleShortcuts(event: KeyboardEvent): void { }
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void { }
}
