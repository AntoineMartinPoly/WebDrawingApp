import { ElementRef, Injectable } from '@angular/core';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DECIMAL, NO_VALUE, PRIMARY_COLOR, SECONDARY_COLOR } from 'src/constant/constant';
import { RECTANGLE_OPTION_CONTOUR, RECTANGLE_OPTION_TRACE } from 'src/constant/storage/constant';
import { DATA_TYPE, DEFAULT_VALUE, FILL, FILL_OPACITY, GROUP, HEIGHT, POINTERS_EVENT, RECT, RECTANGLE, STROKE,
  STROKE_OPACITY, STROKE_WIDTH, VISIBLE_STROKE, WIDTH, X, Y, ZERO } from 'src/constant/svg/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { CONTOUR, FULL, FULL_WITH_CONTOUR } from 'src/constant/toolbar/shape/constant';
import { HardShapeColors } from 'src/interface/colors';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { Rectangle, RectangleOptions, RectangleValues } from 'src/interface/shape/rectangle';

@Injectable({
  providedIn: 'root',
})
export class RectangleService {

  drawingService: DrawingService;

  constructor(public storage: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  generateRectangleElement(): ElementRef {
    const rectangleGroup = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.setSVGattribute(rectangleGroup, DATA_TYPE, RECTANGLE);
    const rectangle = this.drawingService.generateSVGElement(RECT);
    this.drawingService.addSVGToSVG(rectangle, rectangleGroup);
    this.drawingService.addSVGElementFromRef(rectangleGroup);

    return rectangleGroup;
  }

  createRectangleFromSVGElement(svgElement: ElementRef): Rectangle {
    return {
      ref: svgElement,
      value: {
        origin: {
          x: parseInt(this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], X), DECIMAL),
          y: parseInt(this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], Y), DECIMAL),
        },
        height: parseInt(this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], HEIGHT), DECIMAL),
        width: parseInt(this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], WIDTH), DECIMAL),
      },
      option: this.defineRectangleOption(svgElement),
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

  defineRectangleOption(svgElement: ElementRef): RectangleOptions {
    if (this.drawingService.getSVGElementAttributes(svgElement, FILL_OPACITY, false)) {
      return {
        traceType: CONTOUR,
        contourThickness: parseInt(this.drawingService.getSVGElementAttributes(svgElement, STROKE_WIDTH), DECIMAL),
      };
    } else if (this.drawingService.getSVGElementAttributes(svgElement, STROKE_OPACITY, false)) {
      return {
        traceType: FULL,
        contourThickness: DEFAULT_VALUE,
      };
    }

    return {
      traceType: FULL_WITH_CONTOUR,
      contourThickness: parseInt(this.drawingService.getSVGElementAttributes(svgElement, STROKE_WIDTH), DECIMAL),
    };
  }

  createRectangle(rectangleRef: ElementRef, point: Point): Rectangle {
    const rectangle: Rectangle = {
      ref: rectangleRef,
      value: {
        origin: point,
        height: 0,
        width: 0,
      },
      option: this.getRectangleOptions(),
      color: this.getRectangleColors(),
      key: {
        shift: false,
      },
    };
    this.addRectangleOption(rectangle);

    return rectangle;
  }

  getRectangleOptions(): RectangleOptions {
    return {
      traceType: this.storage.get(RECTANGLE_OPTION_TRACE),
      contourThickness: parseInt(this.storage.get(RECTANGLE_OPTION_CONTOUR), DECIMAL),
    };
  }

  getRectangleColors(): HardShapeColors {
    return {
      fill: this.storage.get(PRIMARY_COLOR),
      contour: this.storage.get(SECONDARY_COLOR),
    };
  }

  updateValues(rectangleCoordinates: RectangleValues, point: Point, modifier: KeyModifier) {
    rectangleCoordinates.height = point.y - rectangleCoordinates.origin.y;
    rectangleCoordinates.width = modifier.shift ?
      Math.sign(rectangleCoordinates.height) *
      Math.sign(point.x - rectangleCoordinates.origin.x) * rectangleCoordinates.height :
      point.x - rectangleCoordinates.origin.x;
  }

  addRectangleOption(rectangle: Rectangle) {
    switch (rectangle.option.traceType) {
      case CONTOUR: {
        this.drawingService.setSVGattribute(rectangle.ref, STROKE, rectangle.color.contour);
        this.drawingService.setSVGattribute(rectangle.ref, STROKE_WIDTH, rectangle.option.contourThickness.toString());
        this.drawingService.setSVGattribute(rectangle.ref, FILL_OPACITY, ZERO);
        this.drawingService.setSVGattribute(rectangle.ref, POINTERS_EVENT, VISIBLE_STROKE);
        break;
      }
      case FULL: {
        this.drawingService.setSVGattribute(rectangle.ref, FILL, rectangle.color.fill);
        this.drawingService.setSVGattribute(rectangle.ref, STROKE_OPACITY, ZERO);
        break;
      }
      case FULL_WITH_CONTOUR: {
        this.drawingService.setSVGattribute(rectangle.ref, STROKE, rectangle.color.contour);
        this.drawingService.setSVGattribute(rectangle.ref, STROKE_WIDTH, rectangle.option.contourThickness.toString());
        this.drawingService.setSVGattribute(rectangle.ref, FILL, rectangle.color.fill);
        break;
      }
      default: break;
    }
  }

  editRectangle(rectangle: Rectangle) {
    const xCoords =
    (rectangle.value.origin.x + (rectangle.value.width < DEFAULT_VALUE ? rectangle.value.width : DEFAULT_VALUE)).toString();
    const yCoords =
    (rectangle.value.origin.y + (rectangle.value.height < DEFAULT_VALUE ? rectangle.value.height : DEFAULT_VALUE)).toString();
    const height = (rectangle.value.height < DEFAULT_VALUE ? -rectangle.value.height : rectangle.value.height).toString();
    const width = (rectangle.value.width < DEFAULT_VALUE ? -rectangle.value.width : rectangle.value.width).toString();
    const groupChild = rectangle.ref.children[FIRST_CHILD];
    this.drawingService.setSVGattribute(groupChild, X, xCoords);
    this.drawingService.setSVGattribute(groupChild, Y, yCoords);
    this.drawingService.setSVGattribute(groupChild, HEIGHT, height);
    this.drawingService.setSVGattribute(groupChild, WIDTH, width);
  }

  removeElement(rectangle: Rectangle) {
    this.drawingService.removeSVGElementFromRef(rectangle.ref);
    this.drawingElementManager.removeDrawingElement(rectangle);
  }

  reAddElement(rectangle: Rectangle) {
    this.drawingService.addSVGElementFromRef(rectangle.ref);
    this.drawingElementManager.appendDrawingElement(rectangle);
  }
}
