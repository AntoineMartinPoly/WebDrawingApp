import { Injectable } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MagnetismService } from 'src/app/services/magnetism/magnetism.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { LineService } from 'src/app/services/tool-service/shape/line/line.service';
import { LINE } from 'src/constant/svg/constant';
import { BACKSPACE, ESCAPE } from 'src/constant/tool-service/constant';
import { POINT } from 'src/constant/toolbar/shape/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { Line } from 'src/interface/shape/line';
import { ToolHandler } from '../../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class LineToolHandlerService extends ToolHandler {

  line: Line;
  firstLine: boolean;
  isMouseDown: boolean;
  lastPointClicked: Point;
  drawingService: DrawingService;

  constructor(public lineService: LineService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService, public magnetism: MagnetismService) {
    super();
    this.isMouseDown = false;
    this.lastPointClicked = {x: 0, y: 0};
    this.firstLine = true;
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown(event: MouseEvent) {
    this.shortcutService.changeShortcutAccess(true, false);
    if (!this.isMouseDown) {
      const coordinate: Point = this.magnetism.updateCoordinate(event);
      if ( this.firstLine ) {
        this.elementRef = this.lineService.generateLineElement();
        this.line = this.lineService.createLine(this.elementRef, coordinate);
        this.lineService.updateEndPointValue(this.line, { x: coordinate.x, y: coordinate.y });
        this.lineService.addLineOption(this.line);
        this.lineService.editLineEndPoint(this.line);

        this.lastPointClicked.x = coordinate.x;
        this.lastPointClicked.y = coordinate.y;
        this.firstLine = false;

        if (this.line.option.junctionType === POINT) {
          this.lineService.generateSVGCircle(this.line.value.origin);
        }
      } else if ( !(this.lastPointClicked.x === coordinate.x) && !(this.lastPointClicked.y === coordinate.y) ) {

        this.lineService.addLine(this.line, {x: coordinate.x, y: coordinate.y });
        this.lastPointClicked.x = coordinate.x;
        this.lastPointClicked.y = coordinate.y;
      }
    }
    this.isMouseDown = true;
  }

  handleMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
  }

  handleMouseMove(event: MouseEvent, keyModifier: KeyModifier) {
    if (!this.isMouseDown && !this.firstLine) {
      const coordinate: Point = this.magnetism.updateCoordinate(event);
      this.lineService.updateEndPointValue(this.line, { x: coordinate.x, y: coordinate.y });
      this.lineService.editLineEndPoint(this.line);
    }
  }

  handleMouseLeave() {
    if (!this.isMouseDown && !this.firstLine) {
      this.isMouseDown = false;
      this.firstLine = true;
      this.lineService.removeElement(this.line);
      delete(this.lineService.groupLine);
      delete(this.line);
    }
  }

  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier): void {
    if (keyModifier.shift) {
      this.firstLine = true;
      this.lineService.connectLastLineToFirstLine(this.line);
    } else {
      this.firstLine = true;
      this.lineService.removeLastLine(this.line);
    }
    this.actionService.addAction(this);
    this.drawingElementManager.appendDrawingElement(this.line);
    delete(this.lineService.groupLine);
    delete(this.line);
    this.shortcutService.changeShortcutAccess(false, false);
  }

  handleShortcuts(event: KeyboardEvent): void {
    if (event.key === BACKSPACE && !this.firstLine) {
      this.lineService.removeLastLine(this.line);
    } else if (event.key === ESCAPE) {
      if ( this.line ) {
        this.lineService.removeElement(this.line);
        delete(this.line);
        delete(this.lineService.groupLine);
      }
      this.firstLine = true;
    }
  }

  handleUndo() {
    this.lineService.removeElement(this.line);
  }
  handleRedo() {
    this.lineService.reAddElement(this.line);
  }

  storeAction(): LineToolHandlerService {
    const copy = Object.create(this);
    copy.line = this.line;
    return copy;
  }
  handleDrawingLoad(): void {
    for (const element of this.drawingService.getElementsTable(LINE)) {
      const line: Line =
      this.lineService.createLineFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(line);
    }
  }

  // tslint:disable-next-line: no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier): void { }
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange(): void { }
}
