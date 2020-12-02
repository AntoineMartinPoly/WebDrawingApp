import {ElementRef, Injectable} from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DECIMAL, NO_VALUE, PRIMARY_COLOR } from 'src/constant/constant';
import { MAX_SPEED, SAMPLES_NUMBER, SPEED_SCALE_FACTOR, } from 'src/constant/keypress/constant';
import { PEN_OPTION_THICKNESS_MAX, PEN_OPTION_THICKNESS_MIN } from 'src/constant/storage/constant';
import { DATA_TYPE, DEFAULT_VALUE, FILL_OPACITY, GROUP, LINE_TAG,
  ORIGIN_TAG, PATH, PEN, POINTERS_EVENT,
  ROUND, SPACE, STROKE, STROKE_LINECAP, STROKE_LINEJOIN, STROKE_WIDTH, VISIBLE_STROKE
} from 'src/constant/svg/constant';
import { Point } from 'src/interface/Point';
import { Pen } from 'src/interface/trace/pen';
import { DrawingService } from '../../../drawing/drawing.service';
import { StorageService } from '../../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PenService {

  drawingService: DrawingService;
  gPen: ElementRef;
  lastMouseEvent: MouseEvent;
  mouseSpeed: number;
  previousMouseSpeed: number;

  constructor(public storage: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  generatePenElement(): ElementRef {
    const penPath = this.drawingService.generateSVGElement(PATH);
    this.drawingService.addSVGElementFromRef(penPath);
    this.drawingService.setSVGattribute(penPath, POINTERS_EVENT, VISIBLE_STROKE);
    this.drawingService.addSVGToSVG(penPath, this.gPen);
    return penPath;
  }

  createPenFromSVGElement(svgElement: ElementRef): Pen {
    return {
      ref: svgElement,
      start_point_paths: [{x: DEFAULT_VALUE, y: DEFAULT_VALUE}],
      path_refs: [],
      path: NO_VALUE,
      thicknessMax: DEFAULT_VALUE,
      thicknessMin: DEFAULT_VALUE,
      color: this.drawingService.getSVGElementAttributes(svgElement, STROKE),
    };
  }

  createPen(groupSVG: ElementRef, event: MouseEvent): Pen {
    const absoluteCoordinates: Point = {x: event.x, y: event.y};
    const originPoint: Point = this.drawingService.getRelativeCoordinates(absoluteCoordinates);

    const pen: Pen = {
      ref: groupSVG,
      start_point_paths: [{x: originPoint.x, y: originPoint.y}],
      path_refs: [],
      path: ORIGIN_TAG + originPoint.x.toString() + SPACE + originPoint.y.toString(),
      thicknessMax: parseInt(this.storage.get(PEN_OPTION_THICKNESS_MAX), DECIMAL),
      thicknessMin: parseInt(this.storage.get(PEN_OPTION_THICKNESS_MIN), DECIMAL),
      color: this.storage.get(PRIMARY_COLOR),
    };
    this.addPenOptions(pen);
    return pen;
  }

  addPenOptions(pen: Pen): void {
    this.drawingService.setSVGattribute(pen.ref, STROKE, pen.color);
    this.drawingService.setSVGattribute(pen.ref, DATA_TYPE, PEN);
  }

  updatePath(pen: Pen, event: MouseEvent): void {
    const absoluteCoordinates: Point = {x: event.x, y: event.y};
    const originPoint = pen.start_point_paths[pen.start_point_paths.length - 1];
    const offSet = this.drawingService.getRelativeCoordinates(absoluteCoordinates);
    this.getSpeedFromEvent(event);
    this.editPathsByInterpolation(pen, originPoint, offSet);
  }

  editPathsByInterpolation(pen: Pen, originPoint: Point, offSet: Point) {
    for (let i = 0; i <= SAMPLES_NUMBER; i++) {
      const startTempPoint = pen.start_point_paths[pen.start_point_paths.length - 1];
      const endTempPoint = {
        x: originPoint.x + ((i / SAMPLES_NUMBER) * (offSet.x - originPoint.x)),
        y: originPoint.y + ((i / SAMPLES_NUMBER) * (offSet.y - originPoint.y)),
      };
      const newPathRef = this.generatePenElement();
      pen.start_point_paths.push(endTempPoint);
      pen.path = ORIGIN_TAG + startTempPoint.x.toString() + SPACE + startTempPoint.y.toString() +
        LINE_TAG + endTempPoint.x.toString() + SPACE + endTempPoint.y.toString();
      const tempSpeed = this.previousMouseSpeed + (i / SAMPLES_NUMBER) * ( this.mouseSpeed - this.previousMouseSpeed);
      const tempThick = this.getThicknessFromSpeed(tempSpeed, pen);
      this.editSVGpath(newPathRef, pen, tempThick);
    }
  }

  editSVGpath(newPathRef: ElementRef, pen: Pen, thickness: number): void {
    this.drawingService.setSVGattribute(newPathRef, 'd', pen.path);
    this.drawingService.setSVGattribute(newPathRef, FILL_OPACITY, '0');
    this.drawingService.setSVGattribute(newPathRef, STROKE_LINECAP, ROUND);
    this.drawingService.setSVGattribute(newPathRef, STROKE_LINEJOIN, ROUND);
    this.drawingService.setSVGattribute(newPathRef, STROKE_WIDTH, thickness.toString());
  }

  getThicknessFromSpeed(tempSpeed: number, pen: Pen): number {
    const scaledSpeed = tempSpeed >= SPEED_SCALE_FACTOR ? MAX_SPEED : tempSpeed / SPEED_SCALE_FACTOR;
    const tempThickness = (MAX_SPEED - scaledSpeed) * (pen.thicknessMax - pen.thicknessMin) + pen.thicknessMin;
    return tempThickness;
  }

  generateGpenTag(): ElementRef {
    this.gPen = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.addSVGElementFromRef(this.gPen);
    this.drawingService.setSVGattribute(this.gPen, POINTERS_EVENT, VISIBLE_STROKE);
    return this.gPen;
  }

  getSpeedFromEvent(event: MouseEvent): void {
    if (!event || !event.timeStamp) {
      return;
    }
    this.previousMouseSpeed = this.mouseSpeed;
    let lastTimestamp = 0;
    if (this.lastMouseEvent) { lastTimestamp = this.lastMouseEvent.timeStamp; }
    this.mouseSpeed = ((Math.sqrt(Math.pow(event.movementX, 2) +
      Math.pow(event.movementY, 2))) / (event.timeStamp - lastTimestamp));
    this.lastMouseEvent = event;
  }

  removeElement(pen: Pen) {
    this.drawingService.removeSVGElementFromRef(pen.ref);
    this.drawingElementManager.removeDrawingElement(pen);
  }

  reAddElement(pen: Pen) {
    this.drawingService.addSVGElementFromRef(pen.ref);
    this.drawingElementManager.appendDrawingElement(pen);
  }
}
