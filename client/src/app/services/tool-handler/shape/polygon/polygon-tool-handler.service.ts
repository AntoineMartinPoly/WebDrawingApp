import { Injectable } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MagnetismService } from 'src/app/services/magnetism/magnetism.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { PolygonService } from 'src/app/services/tool-service/shape/polygon/polygon.service';
import { POLYGON } from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Polygon } from 'src/interface/shape/polygon';
import { ToolHandler } from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PolygonToolHandlerService extends ToolHandler {

  isMouseDown: boolean;
  polygon: Polygon;
  hasMouseMoved: boolean;
  drawingService: DrawingService;

  constructor(public polygonService: PolygonService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService,
              private magnetism: MagnetismService) {
    super();
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown() {
    this.shortcutService.changeShortcutAccess(true, false);
    this.hasMouseMoved = false;
    this.isMouseDown = true;
  }

  handleMouseUp() {
    if (this.isMouseDown && this.hasMouseMoved) {
      this.drawingElementManager.appendDrawingElement(this.polygon);
      this.actionService.addAction(this);
    }
    this.hasMouseMoved = false;
    this.isMouseDown = false;
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isMouseDown) {
      const coordinate = this.magnetism.updateCoordinate(event);
      if (!this.hasMouseMoved) {
        this.hasMouseMoved = true;
        this.elementRef = this.polygonService.generatePolygonElement();
        this.polygon = this.polygonService.createPolygon(this.elementRef, coordinate);
      }
      this.polygonService.updateValue(this.polygon, coordinate);
      this.polygonService.editPolygon(this.polygon);
    }
  }

  handleMouseLeave() {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.drawingService.removeSVGElementFromRef(this.elementRef);
    }
  }

  handleUndo() {
    this.polygonService.removeElement(this.polygon);
  }
  handleRedo() {
    this.polygonService.reAddElement(this.polygon);
  }

  storeAction(): PolygonToolHandlerService {
    const copy = Object.create(this);
    copy.elementRef = this.elementRef;
    copy.polygon = this.polygon;
    return copy;
  }

  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(POLYGON)) {
      const polygon: Polygon =
      this.polygonService.createPolygonFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(polygon);
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
