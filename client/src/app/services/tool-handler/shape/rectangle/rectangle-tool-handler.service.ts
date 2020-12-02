import { Injectable } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MagnetismService } from 'src/app/services/magnetism/magnetism.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { RectangleService } from 'src/app/services/tool-service/shape/rectangle/rectangle.service';
import { RECTANGLE } from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Rectangle } from 'src/interface/shape/rectangle';
import { ToolHandler } from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class RectangleToolHandlerService extends ToolHandler {

  rectangle: Rectangle;
  isMouseDown: boolean;
  hasMouseMoved: boolean;
  drawingService: DrawingService;

  constructor(public rectangleService: RectangleService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService,
              public magnetism: MagnetismService) {
    super();
    this.isMouseDown = false;
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown() {
    this.shortcutService.changeShortcutAccess(true, false);
    this.hasMouseMoved = false;
    this.isMouseDown = true;
  }

  handleMouseUp() {
    if (this.isMouseDown && this.hasMouseMoved) {
      this.drawingElementManager.appendDrawingElement(this.rectangle);
      this.actionService.addAction(this);
    }
    this.isMouseDown = false;
    this.hasMouseMoved = false;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleMouseMove(event: MouseEvent, keyModifier: KeyModifier) {
    if (this.isMouseDown) {
      const coordinate = this.magnetism.updateCoordinate(event);
      if (!this.hasMouseMoved) {
        this.hasMouseMoved = true;
        this.elementRef = this.rectangleService.generateRectangleElement();
        this.rectangle = this.rectangleService.createRectangle(this.elementRef, coordinate);
      }
      this.rectangleService.updateValues(this.rectangle.value, coordinate, keyModifier);
      this.rectangleService.editRectangle(this.rectangle);
    }
  }

  handleMouseLeave() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      DrawingService.getInstance().removeSVGElementFromRef(this.elementRef);
    }
  }

  handleUndo() {
    this.rectangleService.removeElement(this.rectangle);
  }
  handleRedo() {
    this.rectangleService.reAddElement(this.rectangle);
  }

  storeAction(): RectangleToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.rectangle = this.rectangle;
    return copy;
  }

  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(RECTANGLE)) {
      const rectangle: Rectangle =
      this.rectangleService.createRectangleFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(rectangle);
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
