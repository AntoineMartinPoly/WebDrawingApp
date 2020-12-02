import { ElementRef, Injectable } from '@angular/core';
import { COLOR_SLIDER_DIMENSIONS, COMMA,
  MAX_COLOR_POSITION, MIN_Y_CANVAS_POSITION, RAINBOW_GRADIENT_ARRAY, RGBA, WHITE_OPAQUE } from 'src/constant/color-picker/constant';
import { ONE, THREE, TWO, ZERO } from 'src/constant/constant';
import { RIGHT_BRACKET, TWO_DIMENSION, WHITE } from 'src/constant/svg/constant';
import { ColorRGBA } from 'src/interface/colors';

@Injectable({
  providedIn: 'root',
})
export class ColorSliderService {

  position: number;
  private canvas: ElementRef;
  private context: CanvasRenderingContext2D;
  private canvasCoordinates: { x: number, y: number, height: number, width: number };

  constructor() {
    this.position = MAX_COLOR_POSITION;
  }

  setUpService(canvas: ElementRef): void {
    this.canvas = canvas;
    this.context = canvas.nativeElement.getContext(TWO_DIMENSION);
    this.canvasCoordinates = { x: ZERO, y: ZERO, height: canvas.nativeElement.height, width: canvas.nativeElement.width };
  }

  drawBackground(): void {
    const gradient = this.context.createLinearGradient(
      this.canvasCoordinates.x,
      this.canvasCoordinates.y,

      this.canvasCoordinates.x,
      this.canvasCoordinates.height,
    );

    RAINBOW_GRADIENT_ARRAY.forEach((element) => {
      if (!element.color) {
        element.color = WHITE_OPAQUE;
      }
      gradient.addColorStop(element.position, element.color);
    });

    this.context.fillStyle = gradient;

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
    this.context.lineWidth = COLOR_SLIDER_DIMENSIONS.lineWidth;
    this.context.rect(
      COLOR_SLIDER_DIMENSIONS.x,
      this.position - COLOR_SLIDER_DIMENSIONS.height / TWO,
      this.canvas.nativeElement.width,
      COLOR_SLIDER_DIMENSIONS.height,
    );
    this.context.stroke();
    this.context.closePath();
  }

  getColorFromPosition(x: number, y: number): ColorRGBA {
    const imageData = this.context.getImageData(x, y, ONE, ONE).data;
    const color: ColorRGBA = {
      red: imageData[ZERO],
      green: imageData[ONE],
      blue: imageData[TWO],
      opacity: imageData[THREE],
    } as ColorRGBA;
    return color;
  }

  colorRGBAToString(color: ColorRGBA): string {
    return RGBA + color.red + COMMA + color.green + COMMA + color.blue + COMMA + color.opacity + RIGHT_BRACKET;
  }

  updatePosition(yCoordinate: number) {
    yCoordinate > MIN_Y_CANVAS_POSITION ? this.position = MIN_Y_CANVAS_POSITION
      : this.position = yCoordinate;
  }
}
