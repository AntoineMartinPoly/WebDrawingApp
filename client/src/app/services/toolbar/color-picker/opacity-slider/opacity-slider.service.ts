import { ElementRef, Injectable } from '@angular/core';
import { ConverterService } from 'src/app/services/converter/converter.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { BRACKET_ONE, BRACKET_ZERO, COLOR_GRADIENT_END,
  COLOR_GRADIENT_START, COMMA, DEFAULT_COLOR,
  MAX_OPACITY_POSITION, MAX_OPACITY_VALUE, MAX_Y_CANVAS_POSITION,
  MIN_Y_CANVAS_POSITION, OPACITY_SLIDER_DIMENSIONS, RGBA } from 'src/constant/color-picker/constant';
import { PRIMARY_COLOR, TWO, ZERO } from 'src/constant/constant';
import { TWO_DIMENSION, WHITE } from 'src/constant/svg/constant';
import { ColorRGBA } from 'src/interface/colors';

@Injectable({
  providedIn: 'root',
})
export class OpacitySliderService {

  private context: CanvasRenderingContext2D;
  private canvas: ElementRef;
  colorRGBA: ColorRGBA;
  position: number;
  private canvasCoordinates: {x: number, y: number, height: number, width: number};

  constructor(private converter: ConverterService, private storage: StorageService) {
    this.position = MAX_OPACITY_POSITION;
  }

  setUpService(canvas: ElementRef) {
    this.canvas = canvas;
    this.context = canvas.nativeElement.getContext(TWO_DIMENSION);
    this.colorRGBA = DEFAULT_COLOR;
    this.canvasCoordinates = {x: ZERO, y: ZERO, height: canvas.nativeElement.height, width: canvas.nativeElement.width};
    this.colorRGBA = this.converter.HexStringToColorRGBA(this.storage.get(PRIMARY_COLOR));
  }

  drawBackground(): void {
    this.context.clearRect(this.canvasCoordinates.x, this.canvasCoordinates.y, this.canvasCoordinates.width, this.canvasCoordinates.height);
    const colorGradient = this.context.createLinearGradient(
      this.canvasCoordinates.x,
      this.canvasCoordinates.y,
      this.canvasCoordinates.x,
      this.canvasCoordinates.height,
    );
    colorGradient.addColorStop(COLOR_GRADIENT_START, this.getRBGcolor(true));
    colorGradient.addColorStop(COLOR_GRADIENT_END, this.getRBGcolor(false));
    this.context.fillStyle = colorGradient;
    this.context.fillRect(
      this.canvasCoordinates.x,
      this.canvasCoordinates.y,
      this.canvasCoordinates.width,
      this.canvasCoordinates.height,
    );
  }

  drawSlider(): void {
    this.context.beginPath();
    this.context.strokeStyle = WHITE;
    this.context.lineWidth = OPACITY_SLIDER_DIMENSIONS.lineWidth;
    this.context.rect(
      OPACITY_SLIDER_DIMENSIONS.x,
      this.position - OPACITY_SLIDER_DIMENSIONS.height / TWO,
      this.canvas.nativeElement.width,
      OPACITY_SLIDER_DIMENSIONS.height,
    );
    this.context.stroke();
    this.context.closePath();
  }

  colorVerification() {
    if (!this.colorRGBA.red) {
      this.colorRGBA.red = 0;
    }
    if (!this.colorRGBA.green) {
      this.colorRGBA.green = 0;
    }
    if (!this.colorRGBA.blue) {
      this.colorRGBA.blue = 0;
    }
  }

  getRBGcolor(opaque: boolean) {
    this.colorVerification();
    if (opaque) {
      return RGBA + this.colorRGBA.red + COMMA + this.colorRGBA.green + COMMA + this.colorRGBA.blue + BRACKET_ONE;
    } else {
      return RGBA + this.colorRGBA.red + COMMA + this.colorRGBA.green + COMMA + this.colorRGBA.blue + BRACKET_ZERO;
    }
  }

  getOpacityFromPosition(y: number) {
    return Math.round(MAX_OPACITY_VALUE - ( y * MAX_OPACITY_VALUE / ( this.canvasCoordinates.height )));
  }

  updatePosition(yCoordinate: number) {
    yCoordinate > MIN_Y_CANVAS_POSITION ? this.position = MIN_Y_CANVAS_POSITION
                                        : this.position = yCoordinate;
  }

  resetSliderPosition() {
    this.position = MAX_Y_CANVAS_POSITION;
  }
}
