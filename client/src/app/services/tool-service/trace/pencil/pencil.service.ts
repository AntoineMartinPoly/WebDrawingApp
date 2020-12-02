import { ElementRef, Injectable, } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DECIMAL, PRIMARY_COLOR } from 'src/constant/constant';
import { PENCIL_OPTION_THICKNESS } from 'src/constant/storage/constant';
import { DATA_TYPE, DEFAULT_VALUE, FILL_OPACITY, GROUP, LINE_TAG, ORIGIN_TAG, PATH,
  PATH_ATTRIBUTE, PENCIL, POINTERS_EVENT, ROUND, SPACE, STROKE, STROKE_LINECAP,
  STROKE_LINEJOIN, STROKE_WIDTH, VISIBLE_STROKE, ZERO } from 'src/constant/svg/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { Point } from 'src/interface/Point';
import { Pencil } from 'src/interface/trace/pencil';

@Injectable({
  providedIn: 'root',
})
export class PencilService {

  drawingService: DrawingService;

  constructor(public storage: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  generatePencilElement(): ElementRef {
    const pencilGroup = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.setSVGattribute(pencilGroup, DATA_TYPE, PENCIL);
    const pencilPath = this.drawingService.generateSVGElement(PATH);
    this.drawingService.addSVGToSVG(pencilPath, pencilGroup);
    this.drawingService.addSVGElementFromRef(pencilGroup);
    this.drawingService.setSVGattribute(pencilPath, POINTERS_EVENT, VISIBLE_STROKE);
    return pencilGroup;
  }

  createPencilFromSVGElement(svgElement: ElementRef): Pencil {
    return {
      ref: svgElement,
      path: this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], PATH_ATTRIBUTE, false),
      thickness: parseInt(this.drawingService.getSVGElementAttributes(svgElement, STROKE_WIDTH), DECIMAL),
      color: this.drawingService.getSVGElementAttributes(svgElement, STROKE),
    };
  }

  createPencil(pathSVGref: ElementRef, event: MouseEvent): Pencil {
    const originPoint: Point = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
    const pencil: Pencil = {
      ref: pathSVGref,
      path: ORIGIN_TAG + originPoint.x.toString() + SPACE + originPoint.y.toString(),
      thickness: parseInt(this.storage.get(PENCIL_OPTION_THICKNESS), DECIMAL),
      color: this.storage.get(PRIMARY_COLOR),
    };
    this.addPencilOptions(pencil);
    return pencil;
  }

  addPencilOptions(pencil: Pencil): void {
    this.drawingService.setSVGattribute(pencil.ref, STROKE_WIDTH, pencil.thickness.toString());
    this.drawingService.setSVGattribute(pencil.ref, FILL_OPACITY, ZERO);
    this.drawingService.setSVGattribute(pencil.ref, STROKE, pencil.color);
  }

  updatePath(pencil: Pencil, event: MouseEvent): void {
    const offSet: Point = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
    pencil.path += LINE_TAG + offSet.x.toString() + SPACE + offSet.y.toString();
  }

  editSVGpath(pencil: Pencil): void {
    const groupChild = pencil.ref.children[FIRST_CHILD];
    this.drawingService.setSVGattribute(groupChild, PATH_ATTRIBUTE, pencil.path);
    this.drawingService.setSVGattribute(groupChild, STROKE_LINECAP, ROUND);
    this.drawingService.setSVGattribute(groupChild, STROKE_LINEJOIN, ROUND);
  }

  removeElement(pencil: Pencil) {
    this.drawingService.removeSVGElementFromRef(pencil.ref);
    this.drawingElementManager.removeDrawingElement(pencil);
  }

  reAddElement(pencil: Pencil) {
    this.drawingService.addSVGElementFromRef(pencil.ref);
    this.drawingElementManager.appendDrawingElement(pencil);
  }
}
