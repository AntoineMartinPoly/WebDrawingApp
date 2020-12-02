import { ElementRef, Injectable, } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { COMMA } from 'src/constant/color-picker/constant';
import { DECIMAL, NO_VALUE, ONE, PRIMARY_COLOR, SECONDARY_COLOR, SPACE, TWO } from 'src/constant/constant';
import { POLYGON_OPTION_CONTOUR, POLYGON_OPTION_SIDES, POLYGON_OPTION_TRACE } from 'src/constant/storage/constant';
import { DATA_TYPE, DEFAULT_VALUE, FILL, FILL_OPACITY, GROUP,
  POINTERS_EVENT, POINTS, POLYGON, STROKE, STROKE_OPACITY, STROKE_WIDTH, VISIBLE_STROKE, ZERO } from 'src/constant/svg/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { CONTOUR, FULL, FULL_WITH_CONTOUR, POLYGON_ANGLE_OFFSET } from 'src/constant/toolbar/shape/constant';
import { HardShapeColors } from 'src/interface/colors';
import { Point } from 'src/interface/Point';
import { Polygon } from 'src/interface/shape/polygon';
import { PolygonOptions } from 'src/interface/shape/ShapeOptions';

@Injectable({
  providedIn: 'root',
})
export class PolygonService {

  drawingService: DrawingService;

  constructor(public storage: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  generatePolygonElement() {
    const polygonGroup = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.setSVGattribute(polygonGroup, DATA_TYPE, POLYGON);
    const polygon = this.drawingService.generateSVGElement(POLYGON);
    this.drawingService.addSVGToSVG(polygon, polygonGroup);
    this.drawingService.addSVGElementFromRef(polygonGroup);

    return polygonGroup;
  }

  getPolygonOptions(): PolygonOptions {
    return {
      traceType: this.storage.get(POLYGON_OPTION_TRACE),
      contourThickness: parseInt(this.storage.get(POLYGON_OPTION_CONTOUR), DECIMAL),
      nbOfSides: parseInt(this.storage.get(POLYGON_OPTION_SIDES), DECIMAL),
    };
  }

  getPolygonColors(): HardShapeColors {
    return {
      fill: this.storage.get(PRIMARY_COLOR),
      contour: this.storage.get(SECONDARY_COLOR),
    };
  }

  createPolygonFromSVGElement(svgElement: ElementRef): Polygon {
    const polygon: Polygon = {
      ref: svgElement,
      origin: {
        x: DEFAULT_VALUE,
        y: DEFAULT_VALUE,
      },
      points: this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], POINTS),
      option: this.definePolygonOption(svgElement),
      color: {
        fill: this.drawingService.getSVGElementAttributes(svgElement, FILL, false) ?
        this.drawingService.getSVGElementAttributes(svgElement, FILL) : NO_VALUE,
        contour: this.drawingService.getSVGElementAttributes(svgElement, STROKE, false) ?
        this.drawingService.getSVGElementAttributes(svgElement, STROKE) : NO_VALUE,
      },
    };

    return polygon;
  }

  definePolygonOption(svgElement: ElementRef): PolygonOptions {
    if (this.drawingService.getSVGElementAttributes(svgElement, FILL_OPACITY, false)) {
      return {
        traceType: CONTOUR,
        contourThickness: parseInt(this.drawingService.getSVGElementAttributes(svgElement, STROKE_WIDTH), DECIMAL),
        nbOfSides: DEFAULT_VALUE,
      };
    } else if (this.drawingService.getSVGElementAttributes(svgElement, STROKE_OPACITY, false)) {
      return {
        traceType: FULL,
        contourThickness: DEFAULT_VALUE,
        nbOfSides: DEFAULT_VALUE,
      };
    }

    return {
      traceType: FULL_WITH_CONTOUR,
      contourThickness: parseInt(this.drawingService.getSVGElementAttributes(svgElement, STROKE_WIDTH), DECIMAL),
      nbOfSides: DEFAULT_VALUE,
    };
  }

  createPolygon(polygonRef: ElementRef, coordinate: Point): Polygon {
    const polygon: Polygon = {
      ref: polygonRef,
      origin: coordinate,
      points: NO_VALUE,
      option: this.getPolygonOptions(),
      color: this.getPolygonColors(),
    };
    this.setPolygonOption(polygon);

    return polygon;
  }

  updateValue(polygon: Polygon, coordinates: Point) {
    const point: Point = { x: DEFAULT_VALUE, y: DEFAULT_VALUE };
    const width = coordinates.x - polygon.origin.x;
    const height = coordinates.y - polygon.origin.y;
    const radius = Math.abs(width) > Math.abs(height) ? Math.abs(width) / TWO : Math.abs(height) / TWO;
    const polygonCenter = {x: polygon.origin.x + radius * Math.sign(width), y: polygon.origin.y + radius * Math.sign(height)};
    for (let i = ONE; i < polygon.option.nbOfSides + ONE; i++) {
      point.x = polygonCenter.x + radius * Math.sign(width) *
        Math.cos(((i) / polygon.option.nbOfSides - POLYGON_ANGLE_OFFSET) * TWO * Math.PI);
      point.y = polygonCenter.y + radius * Math.sign(height) *
        Math.sin(((i) / polygon.option.nbOfSides - POLYGON_ANGLE_OFFSET) * TWO * Math.PI);
      polygon.points += (point.x).toString() + COMMA +
        (point.y).toString() +  SPACE;
    }
  }

  setPolygonOption(polygon: Polygon) {
    const { contourThickness, traceType } = polygon.option;
    switch (traceType) {
      case CONTOUR: {
        this.drawingService.setSVGattribute(polygon.ref, STROKE, polygon.color.contour);
        this.drawingService.setSVGattribute(polygon.ref, FILL_OPACITY, ZERO);
        this.drawingService.setSVGattribute(polygon.ref, STROKE_WIDTH, contourThickness.toString());
        this.drawingService.setSVGattribute(polygon.ref, POINTERS_EVENT, VISIBLE_STROKE);
        break;
      }
      case FULL: {
        this.drawingService.setSVGattribute(polygon.ref, FILL, polygon.color.fill);
        this.drawingService.setSVGattribute(polygon.ref, STROKE_WIDTH, ZERO);
        break;
      }
      case FULL_WITH_CONTOUR: {
        this.drawingService.setSVGattribute(polygon.ref, STROKE, polygon.color.contour);
        this.drawingService.setSVGattribute(polygon.ref, STROKE_WIDTH, contourThickness.toString());
        this.drawingService.setSVGattribute(polygon.ref, FILL, polygon.color.fill);
        break;
      }
      default: break;
    }
  }

  editPolygon(polygon: Polygon) {
    this.drawingService.setSVGattribute(polygon.ref.children[FIRST_CHILD], POINTS, polygon.points);
    polygon.points = NO_VALUE;
  }

  removeElement(polygon: Polygon) {
    this.drawingService.removeSVGElementFromRef(polygon.ref);
    this.drawingElementManager.removeDrawingElement(polygon);
  }

  reAddElement(polygon: Polygon) {
    this.drawingService.addSVGElementFromRef(polygon.ref);
    this.drawingElementManager.appendDrawingElement(polygon);
  }

}
