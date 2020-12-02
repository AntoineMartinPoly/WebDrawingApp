import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LineCoordinatesService } from 'src/app/services/tool-service/trace/feather/coordinatesClaculator/line-coordinates.service';
import { NO_VALUE, PRIMARY_COLOR, SPACE, ZERO} from 'src/constant/constant';
import { FEATHER_OPTION_LINE_LENGTH, FEATHER_OPTION_ORIENTATION_ANGLE } from 'src/constant/storage/constant';
import { GROUP, LINE_TAG, ORIGIN_TAG, PATH, PATH_ATTRIBUTE, POINTERS_EVENT, STROKE, VISIBLE_STROKE } from 'src/constant/svg/constant';
import { Feather } from 'src/interface/trace/feather';
import { DrawingElementManagerService } from '../../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../../drawing/drawing.service';
import { StorageService } from '../../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class FeatherService {

  drawingService: DrawingService;
  groupFeather: ElementRef;
  rotationAngle: number;
  sizeOfLine: number;
  private angleSubject = new Subject<number>();
  lastMouseEvent: MouseEvent;
  lineCoordinates: LineCoordinatesService;

  constructor(public storage: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
    this.rotationAngle = ZERO;
  }

  generateFeatherElement(): ElementRef {
    const featherPath = this.drawingService.generateSVGElement(PATH);
    this.drawingService.addSVGElementFromRef(featherPath);
    this.drawingService.setSVGattribute(featherPath, POINTERS_EVENT, VISIBLE_STROKE);
    this.drawingService.addSVGToSVG(featherPath, this.groupFeather);
    return featherPath;
  }

  createFeatherFromSVGElement(svgElement: ElementRef): Feather {
    return {
      ref: svgElement,
      color: this.drawingService.getSVGElementAttributes(svgElement, STROKE),
      Path:  NO_VALUE,
    };
  }

  createFeather(pathSVGref: ElementRef, event: MouseEvent): Feather {
    const origin = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
    this.lineCoordinates = new LineCoordinatesService(this.rotationAngle, this.sizeOfLine);
    const feather: Feather = {
      ref: pathSVGref,
      Path: ORIGIN_TAG +  this.lineCoordinates.getX1(this.lastMouseEvent.x).toString() + SPACE
        + this.lineCoordinates.getY1(this.lastMouseEvent.y).toString()
        + LINE_TAG + this.lineCoordinates.getX2(this.lastMouseEvent.x).toString() + SPACE
        + this.lineCoordinates.getY2(this.lastMouseEvent.y).toString() + LINE_TAG
        + this.lineCoordinates.getX2(origin.x).toString() + SPACE
        + this.lineCoordinates.getY2(origin.y).toString() + LINE_TAG
        + this.lineCoordinates.getX1(origin.x).toString() + SPACE
        + this.lineCoordinates.getY1(origin.y).toString(),
      color: this.storage.get(PRIMARY_COLOR),
    };
    return feather;
  }

  generateFirstLine(event: MouseEvent) {
    const firstLine  = this.drawingService.generateSVGElement(PATH);
    this.drawingService.addSVGToSVG(firstLine, this.groupFeather);
    this.editFirstLine(event, firstLine);
  }

  editFirstLine(event: MouseEvent, elementRef: ElementRef) {
    const origin = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
    this.lineCoordinates = new LineCoordinatesService(this.rotationAngle, this.sizeOfLine);
    const path = ORIGIN_TAG + this.lineCoordinates.getX1(origin.x).toString() + SPACE
                 + this.lineCoordinates.getY1(origin.y).toString() + LINE_TAG
                 + this.lineCoordinates.getX2(origin.x).toString()
                 + SPACE +  this.lineCoordinates.getY2(origin.y).toString();
    this.drawingService.setSVGattribute(elementRef, PATH_ATTRIBUTE, path);
  }

  setFeatherOption(): void {
    this.rotationAngle =  +this.storage.get(FEATHER_OPTION_ORIENTATION_ANGLE);
    this.sizeOfLine = +this.storage.get(FEATHER_OPTION_LINE_LENGTH);
  }

  setLastEvent(event: MouseEvent): void {
    const origin = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
    this.lastMouseEvent = origin as MouseEvent;
  }

  setPath(feather: Feather): void {
    this.drawingService.setSVGattribute(feather.ref, PATH_ATTRIBUTE, feather.Path);
  }

  updateFeatherPath(event: MouseEvent): void {
    const newPath = this.drawingService.generateSVGElement(PATH);
    const feather = this.createFeather(newPath, event);
    this.setPath(feather);
    this.drawingService.addSVGToSVG(feather.ref, this.groupFeather);
  }

  sendRotationAngle(rotationAngle: number): void {
    this.angleSubject.next(rotationAngle);
  }

  getAngle(): Observable<number> {
    return  this.angleSubject.asObservable();
  }

  generateGroupTag(): ElementRef {
    this.groupFeather = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.addSVGElementFromRef(this.groupFeather);
    this.drawingService.setSVGattribute(this.groupFeather, POINTERS_EVENT, VISIBLE_STROKE);
    return this.groupFeather;
  }

  removeElement(feather: Feather) {
    this.drawingService.removeSVGElementFromRef(feather.ref);
    this.drawingElementManager.removeDrawingElement(feather);
  }

  reAddElement(feather: Feather) {
    this.drawingService.addSVGElementFromRef(feather.ref);
    this.drawingElementManager.appendDrawingElement(feather);
  }

}
