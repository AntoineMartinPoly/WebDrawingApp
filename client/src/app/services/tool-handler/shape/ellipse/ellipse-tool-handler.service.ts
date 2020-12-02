import { Injectable } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MagnetismService } from 'src/app/services/magnetism/magnetism.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { EllipseService } from 'src/app/services/tool-service/shape/ellipse/ellipse.service';
import { ELLIPSE } from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { Ellipse } from 'src/interface/shape/ellipse';
import { ToolHandler } from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class EllipseToolHandlerService extends ToolHandler {

  ellipse: Ellipse;
  isMouseDown: boolean;
  hasMouseMoved: boolean;
  drawingService: DrawingService;

  constructor(public ellipseService: EllipseService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService,
              public magnetism: MagnetismService) {
    super();
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown() {
    this.shortcutService.changeShortcutAccess(true, false);
    this.hasMouseMoved = false;
    this.isMouseDown = true;
  }

  handleMouseUp() {
    if (this.isMouseDown) {
      this.drawingElementManager.appendDrawingElement(this.ellipse);
      this.actionService.addAction(this);
    }
    this.hasMouseMoved = false;
    this.isMouseDown = false;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleMouseMove(event: MouseEvent, keyModifier: KeyModifier) {
    if (this.isMouseDown) {
      const coordinate: Point = this.magnetism.updateCoordinate(event);
      if (!this.hasMouseMoved) {
        this.hasMouseMoved = true;
        this.elementRef = this.ellipseService.generateEllipseElement();
        this.ellipse = this.ellipseService.createEllipse(this.elementRef, coordinate);
        this.isMouseDown = true;
      }
      this.ellipseService.updateValue(this.ellipse.param, coordinate, keyModifier);
      this.ellipseService.editEllipse(this.ellipse);
    }
  }

  handleMouseLeave() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.drawingService.removeSVGElementFromRef(this.elementRef);
    }
  }

  handleUndo() {
    this.ellipseService.removeElement(this.ellipse);
  }
  handleRedo() {
    this.ellipseService.reAddElement(this.ellipse);
  }

  storeAction(): EllipseToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.ellipse = this.ellipse;
    return copy;
  }

  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(ELLIPSE)) {
      const ellipse: Ellipse =
      this.ellipseService.createEllipseFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(ellipse);
    }
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
