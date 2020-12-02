import { ElementRef, Injectable, } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DECIMAL, NO_VALUE, PRIMARY_COLOR, SECONDARY_COLOR, TWO } from 'src/constant/constant';
import { ELLIPSE_OPTION_CONTOUR, ELLIPSE_OPTION_TRACE } from 'src/constant/storage/constant';
import { DATA_TYPE, DEFAULT_VALUE, ELLIPSE, FILL, FILL_OPACITY, GROUP,
  HORIZONTAL_CENTER, HORIZONTAL_RADIUS, POINTERS_EVENT, STROKE, STROKE_OPACITY, STROKE_WIDTH,
  VERTICAL_CENTER, VERTICAL_RADIUS, VISIBLE_STROKE, ZERO } from 'src/constant/svg/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { CONTOUR, FULL, FULL_WITH_CONTOUR } from 'src/constant/toolbar/shape/constant';
import { HardShapeColors } from 'src/interface/colors';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { Ellipse, EllipseOptions, EllispeParams } from 'src/interface/shape/ellipse';

@Injectable({
  providedIn: 'root',
})
export class EllipseService {

  drawingService: DrawingService;

  constructor(public storage: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  generateEllipseElement(): ElementRef {
    const ellipseGroup = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.setSVGattribute(ellipseGroup, DATA_TYPE, ELLIPSE);
    const ellipse = this.drawingService.generateSVGElement(ELLIPSE);
    this.drawingService.addSVGToSVG(ellipse, ellipseGroup);
    this.drawingService.addSVGElementFromRef(ellipseGroup);
    return ellipseGroup;
  }

  getEllipseOptions(): EllipseOptions {
    return {
      traceType: this.storage.get(ELLIPSE_OPTION_CONTOUR),
      contourThickness: parseInt(this.storage.get(ELLIPSE_OPTION_TRACE), DECIMAL),
    };
  }

  setDefaultEllipseParams(point: Point): EllispeParams {
    const originPoint: Point = point;
    return {
      origin: originPoint,
      horizontalRadius: DEFAULT_VALUE,
      verticalRadius: DEFAULT_VALUE,
      horizontalCenter: DEFAULT_VALUE,
      verticalCenter: DEFAULT_VALUE,
    };
  }

  getEllipseColors(): HardShapeColors {
    return {
      fill: this.storage.get(PRIMARY_COLOR),
      contour: this.storage.get(SECONDARY_COLOR),
    };
  }

  createEllipseFromSVGElement(svgElement: ElementRef): Ellipse {
    return {
      ref: svgElement,
      param: {
        origin: {
          x: DEFAULT_VALUE,
          y: DEFAULT_VALUE,
        },
        horizontalRadius: parseInt(
          this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], HORIZONTAL_RADIUS), DECIMAL),
        verticalRadius: parseInt(
          this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], VERTICAL_RADIUS), DECIMAL),
        horizontalCenter: parseInt(
          this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], HORIZONTAL_CENTER), DECIMAL),
        verticalCenter: parseInt(
          this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], VERTICAL_CENTER), DECIMAL),
      },
      option: this.defineEllipseOption(svgElement),
      color: {
        fill: this.drawingService.getSVGElementAttributes(svgElement, FILL, false) ?
        this.drawingService.getSVGElementAttributes(svgElement, FILL) : NO_VALUE,
        contour: this.drawingService.getSVGElementAttributes(svgElement, STROKE, false) ?
        this.drawingService.getSVGElementAttributes(svgElement, STROKE) : NO_VALUE,
      },
      key: {
        shift: false,
      },
    };
  }

  defineEllipseOption(svgElement: ElementRef): EllipseOptions {
    if (this.drawingService.getSVGElementAttributes(svgElement, FILL_OPACITY, false)) {
      return {
        traceType: CONTOUR,
        contourThickness: parseInt(this.drawingService.getSVGElementAttributes(svgElement, STROKE_WIDTH), DECIMAL),
      };
    } else if (this.drawingService.getSVGElementAttributes(svgElement, STROKE_OPACITY, false)) {
      return {
        traceType: FULL,
        contourThickness: 0,
      };
    }

    return {
      traceType: FULL_WITH_CONTOUR,
      contourThickness: parseInt(this.drawingService.getSVGElementAttributes(svgElement, STROKE_WIDTH), DECIMAL),
    };
  }

  createEllipse(ellipseRef: ElementRef, point: Point): Ellipse {
    const ellipse = {
      ref: ellipseRef,
      param: this.setDefaultEllipseParams(point),
      option: this.getEllipseOptions(),
      color: this.getEllipseColors(),
      key: {
        shift: false,
      },
    };
    this.addEllipseOption(ellipse);

    return ellipse;
  }

  updateValue(param: EllispeParams, point: Point, modifier: KeyModifier) {
    param.verticalRadius = (point.y - param.origin.y) / TWO;
    if (modifier.shift) {
      param.horizontalRadius = Math.sign(param.verticalRadius) *
        Math.sign(point.x - param.origin.x) * param.verticalRadius;
    } else {
      param.horizontalRadius = (point.x - param.origin.x) / TWO;
    }
    param.horizontalCenter = param.origin.x + param.horizontalRadius;
    param.verticalCenter = param.origin.y + param.verticalRadius;
  }

  addEllipseOption(ellipse: Ellipse) {
    const { contourThickness, traceType } = ellipse.option;
    switch (traceType) {
      case CONTOUR: {
        this.drawingService.setSVGattribute(ellipse.ref, STROKE, ellipse.color.contour);
        this.drawingService.setSVGattribute(ellipse.ref, FILL_OPACITY, ZERO);
        this.drawingService.setSVGattribute(ellipse.ref, STROKE_WIDTH, contourThickness.toString());
        this.drawingService.setSVGattribute(ellipse.ref, POINTERS_EVENT, VISIBLE_STROKE);
        break;
      }
      case FULL: {
        this.drawingService.setSVGattribute(ellipse.ref, FILL, ellipse.color.fill);
        this.drawingService.setSVGattribute(ellipse.ref, STROKE_OPACITY, ZERO);
        break;
      }
      case FULL_WITH_CONTOUR: {
        this.drawingService.setSVGattribute(ellipse.ref, STROKE, ellipse.color.contour);
        this.drawingService.setSVGattribute(ellipse.ref, STROKE_WIDTH, contourThickness.toString());
        this.drawingService.setSVGattribute(ellipse.ref, FILL, ellipse.color.fill);
        break;
      }
      default: break;
    }
  }

  editEllipse(ellipse: Ellipse) {
    const groupChild = ellipse.ref.children[FIRST_CHILD];
    this.drawingService.setSVGattribute(groupChild, HORIZONTAL_CENTER, Math.abs(ellipse.param.horizontalCenter).toString());
    this.drawingService.setSVGattribute(groupChild, VERTICAL_CENTER, Math.abs(ellipse.param.verticalCenter).toString());
    this.drawingService.setSVGattribute(groupChild, HORIZONTAL_RADIUS, Math.abs(ellipse.param.horizontalRadius).toString());
    this.drawingService.setSVGattribute(groupChild, VERTICAL_RADIUS, Math.abs(ellipse.param.verticalRadius).toString());
  }

  removeElement(ellipse: Ellipse) {
    this.drawingService.removeSVGElementFromRef(ellipse.ref);
    this.drawingElementManager.removeDrawingElement(ellipse);
  }

  reAddElement(ellipse: Ellipse) {
    this.drawingService.addSVGElementFromRef(ellipse.ref);
    this.drawingElementManager.appendDrawingElement(ellipse);
  }
}
