import { ElementRef, Injectable, } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TWO } from 'src/constant/color-picker/constant';
import { PRIMARY_COLOR, SECONDARY_COLOR } from 'src/constant/constant';
import { CURSOR_BUCKET, CURSOR_LOADING } from 'src/constant/cursor/constant';
import { BUCKET_TOLERANCE } from 'src/constant/storage/constant';
import {
  BUCKET, DATA_TYPE, GROUP, PATH, PATH_ATTRIBUTE,
  POINTERS_EVENT, STROKE, STROKE_WIDTH, TWO_DIMENSION, VISIBLE_STROKE,
} from 'src/constant/svg/constant';
import { BUCKET_STROKE_WIDTH, FIRST_INDEX, FIRST_SLICE_ONE, FIRST_SLICE_TWO, FOUR, FOURTH_INDEX,
  FOURTH_SLICE_ONE, FOURTH_SLICE_TWO, HEX, HEX_MAX, NULL_COLOR, ORIGIN,
  PIXEL_SIZE, SECOND_INDEX, SECOND_SLICE_ONE, SECOND_SLICE_TWO, THIRD_INDEX, THIRD_SLICE_ONE, THIRD_SLICE_TWO, VERTICAL_BUFFER,
} from 'src/constant/tool-service/bucket';
import { EMPTY_STRING } from 'src/constant/toolbar/view-drawing/constant';
import { Bucket, Column, Side } from 'src/interface/bucket/bucket';
import { DrawingElement } from 'src/interface/drawing-element';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { RectangleValues } from 'src/interface/shape/rectangle';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../drawing/drawing.service';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class BucketService {

  floodColor: Uint8ClampedArray;
  colorToFill: Uint8ClampedArray;
  pixelColumns: Column[] = [];
  currentPixelStack: Point[] = [];
  context: CanvasRenderingContext2D;
  canvasDimensions: RectangleValues;
  img: any;
  bucket: DrawingElement;
  isLeftClick: boolean;
  tolerance: number;
  clickedElement: DrawingElement;
  private updateCursor: Subject<string>;
  private floodState: Subject<boolean>;
  drawingService: DrawingService;

  constructor(public storageService: StorageService, public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
    this.updateCursor = new Subject<string>();
    this.floodState = new Subject<boolean>();
  }

  sendCursorUpdate(cursor: string): void { this.updateCursor.next(cursor); }
  sendIsFloodOver(isOver: boolean): void { this.floodState.next(isOver); }
  getCursorUpdate(): Observable<string> { return this.updateCursor.asObservable(); }
  getIsFloodOver(): Observable<boolean> { return this.floodState.asObservable(); }

  fill(event: MouseEvent, keyModifier: KeyModifier) {
    this.sendCursorUpdate(CURSOR_LOADING);
    this.sendIsFloodOver(false);

    let currentColor: string;
    this.isLeftClick = keyModifier.leftKey ? true : false; // required since leftkey can be undef
    currentColor = this.isLeftClick ?
      this.storageService.get(PRIMARY_COLOR) :
      this.storageService.get(SECONDARY_COLOR);
    this.floodColor = new Uint8ClampedArray([
      parseInt(currentColor.slice(FIRST_SLICE_ONE, FIRST_SLICE_TWO), HEX),
      parseInt(currentColor.slice(SECOND_SLICE_ONE, SECOND_SLICE_TWO), HEX),
      parseInt(currentColor.slice(THIRD_SLICE_ONE, THIRD_SLICE_TWO), HEX),
      parseInt(currentColor.slice(FOURTH_SLICE_ONE, FOURTH_SLICE_TWO), HEX),
    ]);
    this.tolerance = Number(this.storageService.get(BUCKET_TOLERANCE));
    this.pixelColumns = [];

    const canvas = this.drawingService.generateCanvas();
    this.canvasDimensions = {origin: ORIGIN, width: canvas.width, height: canvas.height};
    const imgElement = this.drawingService.generateImg();

    const clickedPoint: Point = {x: event.x, y: event.y};
    const relativePoint = this.drawingService.getRelativeCoordinates(clickedPoint);
    const clickedElement = this.drawingElementManager.getClickedDrawingElementFromParent(event);
    if (clickedElement) {this.clickedElement = clickedElement; }

    this.generateBucketElement();

    imgElement.onload = () => {
      this.context = canvas.getContext(TWO_DIMENSION);
      this.context.drawImage(imgElement, ORIGIN.x, ORIGIN.y);
      this.img = this.context.getImageData(
        this.canvasDimensions.origin.x,
        this.canvasDimensions.origin.y,
        this.canvasDimensions.width,
        this.canvasDimensions.height,
      );
      this.floodInit(relativePoint);
      this.drawingService.cleanAfterFill(canvas, imgElement);
      this.sendCursorUpdate(CURSOR_BUCKET);
      this.sendIsFloodOver(true);
    };
    return this.bucket;
  }

  getPixelColor(point: Point): Uint8ClampedArray {
    let color;
    if (point.x < 0 || point.y < 0 || point.x >= this.img.width || point.y >= this.img.height) {
      color = NULL_COLOR;
    } else {
      const offset = (point.y * this.img.width + point.x) * PIXEL_SIZE;
      color = this.img.data.slice(offset, offset + PIXEL_SIZE);
    }
    return new Uint8ClampedArray(color);
  }

  setPixel(pixel: Point) {
    const offset = (pixel.y * this.img.width + pixel.x) * PIXEL_SIZE;
    this.img.data[offset + FIRST_INDEX] = this.floodColor[FIRST_INDEX];
    this.img.data[offset + SECOND_INDEX] = this.floodColor[SECOND_INDEX];
    this.img.data[offset + THIRD_INDEX] = this.floodColor[THIRD_INDEX];
    this.img.data[offset + FOURTH_INDEX] = this.floodColor[FOURTH_INDEX];
  }

  colorsMatch(a: Uint8ClampedArray, b: Uint8ClampedArray, isTolerance: boolean = true): boolean {
    const dr = a[FIRST_INDEX] - b[FIRST_INDEX];
    const dg = a[SECOND_INDEX] - b[SECOND_INDEX];
    const db = a[THIRD_INDEX] - b[THIRD_INDEX];
    const da = a[FOURTH_INDEX] - b[FOURTH_INDEX];
    if (!isTolerance) {
      return dr + dg + db + da === 0;
    } else {
      return dr * dr + dg * dg + db * db + da * da < Math.pow(this.tolerance * HEX_MAX, TWO) * FOUR;
    }
  }

  floodInit(clickPoint: Point) {
    const clickedPixel: Point = {
      x: Math.floor(clickPoint.x),
      y: Math.floor(clickPoint.y),
    };
    this.colorToFill = this.getPixelColor(clickedPixel);

    if (this.colorsMatch(this.colorToFill , this.floodColor, false)) {
      return false;
    }
    this.currentPixelStack.push(clickedPixel);
    this.floodAlgorithm();
    this.colorize();
    return true;
  }

  // http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/images/paint-bucket-step-by-step.gif
  floodAlgorithm() {
    while (this.currentPixelStack.length !== 0) {
      const point = this.currentPixelStack.pop();
      if (point) {
        const topPixel = this.getTopPixel(point);
        const bottomPixel = this.topToBottomSearch(topPixel);
        this.pixelColumns.push({top: topPixel, bottom: bottomPixel});
      }
    }
  }

  getTopPixel(initialPixel: Point): Point {
    let isTopPixelFound = false;
    const currentPixel: Point = {x: initialPixel.x, y: initialPixel.y};

    while (!isTopPixelFound && currentPixel.y > ORIGIN.y) {
      const currentPixelColor = this.getPixelColor(currentPixel);
      if (!this.colorsMatch(currentPixelColor, this.colorToFill)) {
        isTopPixelFound = true;
        currentPixel.y++;
      } else {
        currentPixel.y--;
      }
    }
    return currentPixel;
  }

  topToBottomSearch(topPixel: Point): Point {
    let bottomPixelFound = false;
    const currentPixel: Point = {x: topPixel.x, y: topPixel.y};
    let wasLeftSameColor = false;
    let wasRightSameColor = false;

    while (!bottomPixelFound && currentPixel.y < this.canvasDimensions.height) {
      wasLeftSameColor  = this.compareHorizontalPixel(currentPixel, wasLeftSameColor,  Side.left);
      wasRightSameColor = this.compareHorizontalPixel(currentPixel, wasRightSameColor, Side.right);

      const currentPixelColor = this.getPixelColor(currentPixel);
      if (!this.colorsMatch(currentPixelColor, this.colorToFill)) {
        bottomPixelFound = true;
      } else {
        this.setPixel(currentPixel);
        currentPixel.y++;
      }
    }
    return currentPixel;
  }

  compareHorizontalPixel(pixel: Point, isNeighbourPixelAboveSameColor: boolean, side: Side): boolean {
    const neighbourPixel = {x: pixel.x, y: pixel.y};
    if (side === Side.left) {
      neighbourPixel.x--;
    } else  if (side === Side.right) {
      neighbourPixel.x++;
    }

    const neighbourPixelColor = this.getPixelColor(neighbourPixel);
    const isNeighbourPixelColorSimilar = this.colorsMatch(neighbourPixelColor, this.colorToFill);

    if (isNeighbourPixelAboveSameColor && !isNeighbourPixelColorSimilar) {
      return false;
    } else if (!isNeighbourPixelAboveSameColor && isNeighbourPixelColorSimilar) {
      this.currentPixelStack.push(neighbourPixel);
      return true;
    }
    return isNeighbourPixelAboveSameColor;
  }

  createBucketFromSVGElement(svgElement: ElementRef): DrawingElement {
    return {
      ref: svgElement,
    };
  }

  generateBucketElement() {
    const bucketRef = this.drawingService.generateSVGElement(GROUP);
    this.bucket = {ref: bucketRef, isBucket: true} as Bucket;
    this.drawingService.setSVGattribute(this.bucket.ref, DATA_TYPE, BUCKET);
  }

  isClickedElementBucket(): boolean {
    if (this.clickedElement) { return 'isBucket' in this.clickedElement; }
    return false;
  }

  colorize() {
    const bucketPath = this.drawingService.generateSVGElement(PATH);
    this.drawingService.addSVGToSVG(bucketPath, this.bucket.ref);
    this.drawingService.addSVGElementFromRef(this.bucket.ref);

    const verticalBuffer = this.isClickedElementBucket() ? 0 : VERTICAL_BUFFER;
    let pixelRows = EMPTY_STRING;
    this.pixelColumns.forEach((column) => {
      pixelRows = pixelRows +
        `M ${column.top.x} ${column.top.y - verticalBuffer}
        L ${column.bottom.x} ${column.bottom.y + verticalBuffer} Z `;
    });

    this.drawingService.setSVGattribute(bucketPath, POINTERS_EVENT, VISIBLE_STROKE);
    this.drawingService.setSVGattribute(bucketPath, PATH_ATTRIBUTE, pixelRows);
    this.drawingService.setSVGattribute(this.bucket.ref, STROKE_WIDTH, BUCKET_STROKE_WIDTH);
    const color = this.isLeftClick ?
      this.storageService.get(PRIMARY_COLOR) :
      this.storageService.get(SECONDARY_COLOR);
    this.drawingService.setSVGattribute(this.bucket.ref, STROKE, color);
  }

  removeElement(bucket: DrawingElement) {
    this.drawingService.removeSVGElementFromRef(bucket.ref);
    this.drawingElementManager.removeDrawingElement(bucket);
  }

  reAddElement(bucket: DrawingElement) {
    this.drawingService.addSVGElementFromRef(bucket.ref);
    this.drawingElementManager.appendDrawingElement(bucket);
  }
}
