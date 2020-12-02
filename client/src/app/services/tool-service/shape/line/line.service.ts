import { ElementRef, Injectable } from '@angular/core';
import { ConverterService } from 'src/app/services/converter/converter.service';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ONE, PRIMARY_COLOR, SPACE, TWO } from 'src/constant/constant';
import {
  CONTINUOUS, DOTED_WITH_LINE, DOTED_WITH_POINTS, LINE_OPTION_DIAMETER,
  LINE_OPTION_JUNCTION, LINE_OPTION_STYLE, LINE_OPTION_THICKNESS,
  POINT,
  ROUNDED,
} from 'src/constant/shape/constant';
import { CIRCLE, CURVE_TAG, DATA_TYPE, DEFAULT_VALUE, FILL, FILL_OPACITY, GROUP, HORIZONTAL_CENTER, LINE,
  LINE_TAG, OPTION_1, OPTION_2, OPTION_3, ORIGIN_TAG, PATH, PATH_ATTRIBUTE, POINT_DIAMETER,
  ROUND, SQUARE, STROKE, STROKE_DASHARRAY, STROKE_LINECAP, STROKE_WIDTH, VERTICAL_CENTER, ZERO } from 'src/constant/svg/constant';
import { FIRST_CHILD } from 'src/constant/toolbar//constant';
import { FAKE_LINE_OPTIONS, PIXEL_DISTANCE_FROM_POINT } from 'src/constant/toolbar/shape/constant';
import { Point } from 'src/interface/Point';
import { Line, LineOptions } from 'src/interface/shape/line';

@Injectable({
  providedIn: 'root',
})
export class LineService {

  drawingService: DrawingService;
  groupLine: any;

  constructor(public storage: StorageService, public converter: ConverterService,
              public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  generateLineElement(): ElementRef {
    if ( !this.groupLine ) {
      this.groupLine = this.drawingService.generateSVGElement(GROUP);
      this.drawingService.setSVGattribute(this.groupLine, DATA_TYPE, LINE);
      this.drawingService.addSVGElementFromRef(this.groupLine);
    }
    const line = this.drawingService.generateSVGElement(PATH);
    this.drawingService.addSVGToSVG(line, this.groupLine);
    return this.groupLine;
  }

  createLineFromSVGElement(svgElement: ElementRef): Line {
    return {
      ref: svgElement,
      value: {
        origin: {
          x: DEFAULT_VALUE,
          y: DEFAULT_VALUE,
        },
        endPoint: {
          x: DEFAULT_VALUE,
          y: DEFAULT_VALUE,
        },
      },
      option: FAKE_LINE_OPTIONS,
      color: this.drawingService.getSVGElementAttributes(svgElement, STROKE, false),
      path: '',
      key: {
        shift: false,
      },
    };
  }

  createLine(pathRef: any, coordinate: Point): Line {
    const line: Line = {
      value: {
        origin: coordinate,
        endPoint: { x: 0, y: 0 },
      },
      option: this.getLineOptions(),
      color: this.storage.get(PRIMARY_COLOR),
      key: {
        shift: false,
      },
      path: '',
      ref: pathRef,
    };
    this.addLineOption(line);
    return line;
  }

  getLineOptions(): LineOptions {
    return {
      lineStyle: this.storage.get(LINE_OPTION_STYLE),
      junctionType: this.storage.get(LINE_OPTION_JUNCTION),
      lineThickness: Number(this.storage.get(LINE_OPTION_THICKNESS)),
      pointDiameter: Number(this.storage.get(LINE_OPTION_DIAMETER)),
    };
  }

  addLineOption(line: Line) {
    line.path = ORIGIN_TAG + line.value.origin.x.toString() + SPACE + line.value.origin.y.toString();
    if ( line.option.junctionType === ROUNDED ) {
      line.path += CURVE_TAG + line.value.origin.x.toString() + SPACE + line.value.origin.y.toString() + SPACE
                             + line.value.endPoint.x.toString() + SPACE + line.value.endPoint.y.toString() + SPACE;
    } else {
      line.path += LINE_TAG + line.value.endPoint.x.toString() + SPACE + line.value.endPoint.y.toString() + SPACE;
    }
    const groupChild = line.ref.children[line.ref.children.length - ONE];
    this.drawingService.setSVGattribute(groupChild, PATH_ATTRIBUTE, line.path);
    this.drawingService.setSVGattribute(line.ref, STROKE, line.color);
    this.drawingService.setSVGattribute(line.ref, STROKE_WIDTH, (line.option.lineThickness).toString());
    this.drawingService.setSVGattribute(groupChild, FILL_OPACITY, ZERO);

    switch (line.option.lineStyle) {
      case CONTINUOUS: {
        this.drawingService.setSVGattribute(groupChild, STROKE_DASHARRAY, OPTION_1);
        line.option.junctionType === ROUNDED ?
          this.drawingService.setSVGattribute(groupChild, STROKE_LINECAP, ROUND) :
          this.drawingService.setSVGattribute(groupChild, STROKE_LINECAP, SQUARE);
        break;
      }
      case DOTED_WITH_LINE: {
        this.drawingService.setSVGattribute(groupChild, STROKE_DASHARRAY, OPTION_2);
        this.drawingService.setSVGattribute(groupChild, STROKE_LINECAP, SQUARE);
        break;
      }
      case DOTED_WITH_POINTS: {
        this.drawingService.setSVGattribute(groupChild, STROKE_DASHARRAY, OPTION_3);
        this.drawingService.setSVGattribute(groupChild, STROKE_LINECAP, ROUND);
        break;
      }
      default: break;
    }
  }

  updateEndPointValue(line: Line, coordinate: Point) {
    line.value.endPoint.x = coordinate.x;
    line.value.endPoint.y = coordinate.y;
  }

  editLineEndPoint(line: Line): void {
    line.path = line.path.slice(0, line.path.lastIndexOf(SPACE));
    line.path = line.path.slice(0, line.path.lastIndexOf(SPACE));
    line.path = line.path.slice(0, line.path.lastIndexOf(SPACE));
    line.path += SPACE + line.value.endPoint.x.toString() + SPACE + line.value.endPoint.y.toString() + SPACE;
    this.drawingService.setSVGattribute(line.ref.children[line.ref.children.length - ONE], PATH_ATTRIBUTE, line.path);
  }

  addLine(line: Line, coordinate: Point): void {
    // const point = DrawingService.getInstance().getRelativeCoordinates(pointClicked);
    if (line.option.junctionType === ROUNDED) {
      let endPath = line.path.slice(0, line.path.lastIndexOf(SPACE));
      const endY = Number(endPath.slice(endPath.lastIndexOf(SPACE), endPath.length));
      endPath = endPath.slice(0, endPath.lastIndexOf(SPACE));
      const endX = Number(endPath.slice(endPath.lastIndexOf(SPACE), endPath.length));
      endPath = endPath.slice(0, endPath.lastIndexOf(SPACE));
      line.path = endPath;
      const originY = Number(endPath.slice(endPath.lastIndexOf(SPACE), endPath.length));
      endPath = endPath.slice(0, endPath.lastIndexOf(SPACE));
      const originX = Number(endPath.slice(endPath.lastIndexOf(SPACE), endPath.length));
      const newPoint = this.converter.getNewPointFromStraightLine(
        [ {x: originX, y: originY} as Point, {x: endX, y: endY} as Point ], PIXEL_DISTANCE_FROM_POINT);
      line.path += SPACE + newPoint.x.toString() + SPACE + newPoint.y.toString() + SPACE;
      line.path += ORIGIN_TAG + newPoint.x.toString() + SPACE + newPoint.y.toString();
      line.path += CURVE_TAG + endX.toString() + SPACE + endY.toString() + SPACE;
      line.path += endX.toString() + SPACE + endY.toString() + SPACE;
    } else {
      line.path += ORIGIN_TAG + coordinate.x.toString() + SPACE + coordinate.y.toString();
      line.path += LINE_TAG + coordinate.x.toString() + SPACE + coordinate.y.toString() + SPACE;
    }
    this.drawingService.setSVGattribute(line.ref.children[line.ref.children.length - ONE], PATH_ATTRIBUTE, line.path);
    if (line.option.junctionType === POINT) { this.generateSVGCircle(coordinate); }
  }

  removeLastLine(line: Line): void {
    const newPath = line.path.slice(0, line.path.lastIndexOf(ORIGIN_TAG));
    if ( newPath.lastIndexOf(ORIGIN_TAG) && newPath.lastIndexOf(ORIGIN_TAG) !== -1 ) {
      line.path = newPath;
      this.drawingService.setSVGattribute(line.ref, PATH_ATTRIBUTE, line.path);
      if (line.option.junctionType === POINT) {
        const circle = this.drawingElementManager.removeFirstDrawingElement();
        if (circle) {
          this.drawingService.removeSVGElementFromRef(circle.ref);
          line = this.drawingElementManager.getLastDrawingElement() as Line;
        }
      }
    }
  }

  generateSVGCircle(point: Point): void {
    const circle = this.drawingService.generateSVGElement(CIRCLE);
    this.drawingService.setSVGattribute(circle, POINT_DIAMETER, (this.getLineOptions().pointDiameter / TWO).toString());
    this.drawingService.setSVGattribute(circle, FILL, this.storage.get(PRIMARY_COLOR));
    this.drawingService.setSVGattribute(circle, HORIZONTAL_CENTER, point.x.toString());
    this.drawingService.setSVGattribute(circle, VERTICAL_CENTER, point.y.toString());
    this.drawingService.insertSVGBeforeSVG(this.groupLine, circle, this.groupLine.children[FIRST_CHILD]);
    this.drawingElementManager.pushDrawingElementAtFirstPosition({ ref: circle });
  }

  connectLastLineToFirstLine(line: Line) {
    line.path = line.path.slice(0, line.path.lastIndexOf(SPACE));
    line.path = line.path.slice(0, line.path.lastIndexOf(SPACE));
    line.path = line.path.slice(0, line.path.lastIndexOf(SPACE));
    line.path += SPACE + line.value.origin.x.toString() + SPACE + line.value.origin.y.toString() + SPACE;
    this.drawingService.setSVGattribute(line.ref.children[line.ref.children.length - ONE], PATH_ATTRIBUTE, line.path);
  }

  removeElement(line: Line) {
    this.drawingService.removeSVGElementFromRef(line.ref);
    this.drawingElementManager.removeDrawingElement(line);
    if (line.jointRef) {
      this.drawingService.removeSVGElementFromRef(line.jointRef);
    }
  }

  reAddElement(line: Line) {
    this.drawingService.addSVGElementFromRef(line.ref);
    this.drawingElementManager.appendDrawingElement(line);
  }
}
