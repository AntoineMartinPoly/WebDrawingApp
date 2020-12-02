import { ElementRef, Injectable } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DECIMAL, NO_VALUE, PRIMARY_COLOR } from 'src/constant/constant';
import { BRUSH_OPTION_PATTERN, BRUSH_OPTION_THICKNESS } from 'src/constant/storage/constant';
import { BRUSH, COLOR, DATA_TYPE, DEFAULT_VALUE, FILL_OPACITY, FILTER, GROUP,
  LINE_TAG, ORIGIN_TAG, PATH, PATH_ATTRIBUTE, RIGHT_BRACKET, ROUND, SPACE,
  STROKE, STROKE_LINECAP, STROKE_LINEJOIN, STROKE_WIDTH, STYLE, URL_FILTER, ZERO } from 'src/constant/svg/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { MINIMUM_BRUSH_THICKNESS } from 'src/constant/toolbar/trace/contant';
import { Point } from 'src/interface/Point';
import { Brush, PatternType } from 'src/interface/trace/brush';

@Injectable({
  providedIn: 'root',
})
export class BrushService {

  drawingService: DrawingService;

  constructor(public storage: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  generateBrushElement(): ElementRef {
    const brushGroup = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.setSVGattribute(brushGroup, DATA_TYPE, BRUSH);
    const brushLine = this.drawingService.generateSVGElement(PATH);
    this.drawingService.addSVGToSVG(brushLine, brushGroup);
    this.drawingService.addSVGElementFromRef(brushGroup);

    return brushGroup;
  }

  createBrushFromSVGElement(svgElement: ElementRef): Brush {
    return {
      ref: svgElement,
      path: this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], PATH_ATTRIBUTE),
      thickness: parseInt(this.drawingService.getSVGElementAttributes(svgElement, STROKE_WIDTH), DECIMAL),
      pattern: NO_VALUE as PatternType,
      color: this.drawingService.getSVGElementAttributes(svgElement, STROKE),
    };
  }

  createBrush(brushRef: ElementRef, event: MouseEvent): Brush {
    const originPoint: Point = this.drawingService.getRelativeCoordinates({ x: event.x, y: event.y });
    const brush: Brush = {
      ref: brushRef,
      path: ORIGIN_TAG + originPoint.x.toString() + SPACE + originPoint.y.toString(),
      thickness: parseInt(this.storage.get(BRUSH_OPTION_THICKNESS), DECIMAL),
      pattern: this.storage.get(BRUSH_OPTION_PATTERN) as PatternType,
      color: this.storage.get(PRIMARY_COLOR),
    };
    this.addBrushOption(brush);
    return brush;
  }

  updatePath(brush: Brush, event: MouseEvent): void {
    const offSet = this.drawingService.getRelativeCoordinates({ x: event.x, y: event.y });
    brush.path += LINE_TAG + offSet.x.toString() + SPACE + offSet.y.toString();
  }

  addBrushOption(brush: Brush): void {
    this.drawingService.setSVGattribute(brush.ref, STROKE_WIDTH, (brush.thickness + MINIMUM_BRUSH_THICKNESS).toString());
    this.drawingService.setSVGattribute(brush.ref, FILL_OPACITY, ZERO);
    this.drawingService.setSVGattribute(brush.ref, STYLE, COLOR + brush.color.toString());
    this.drawingService.setSVGattribute(brush.ref, STROKE, brush.color.toString());
  }

  editBrushPath(brush: Brush): void {
    const groupChild = brush.ref.children[FIRST_CHILD];
    this.drawingService.setSVGattribute(groupChild, PATH_ATTRIBUTE, brush.path);
    this.drawingService.setSVGattribute(groupChild, STROKE_LINECAP, ROUND);
    this.drawingService.setSVGattribute(groupChild, STROKE_LINEJOIN, ROUND);
    this.drawingService.setSVGattribute(groupChild, FILTER, URL_FILTER + brush.pattern + RIGHT_BRACKET);
  }

  removeElement(brush: Brush) {
    this.drawingService.removeSVGElementFromRef(brush.ref);
    this.drawingElementManager.removeDrawingElement(brush);
  }

  reAddElement(brush: Brush) {
    this.drawingService.addSVGElementFromRef(brush.ref);
    this.drawingElementManager.appendDrawingElement(brush);
  }
}
