import { ElementRef, Injectable } from '@angular/core';
import { ConverterService } from 'src/app/services/converter/converter.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { BLACK_CLEAR, BLACK_OPAQUE, BWSELECTOR_CANVAS_COORDIANTES,
  BWSELECTOR_GRADIENT_END, BWSELECTOR_GRADIENT_START, BWSELECTOR_SLIDER_DIMENSIONS,
  COMMA, DEFAULT_BWSELECTOR_POSITION, DEFAULT_COLOR, MAX_X_CANVAS_POSITION,
  MAX_Y_CANVAS_POSITION, MIN_X_CANVAS_POSITION, MIN_Y_CANVAS_POSITION, OPACITY_MAX, RGBA,
  WHITE_CLEAR, WHITE_OPAQUE } from 'src/constant/color-picker/constant';
import { ONE, PRIMARY_COLOR, THREE, TWO, ZERO } from 'src/constant/constant';
import { RIGHT_BRACKET, TWO_DIMENSION, WHITE } from 'src/constant/svg/constant';
import { ColorRGBA } from 'src/interface/colors';
import { Point } from 'src/interface/Point';

@Injectable({
  providedIn: 'root',
})
export class BwSelectorService {

  private context: CanvasRenderingContext2D;
  private position: Point;
  gradientColorRGBA: ColorRGBA;

  constructor(private storage: StorageService, private converter: ConverterService) {
  }

  setUpService(canvas: ElementRef): void {
    this.context = canvas.nativeElement.getContext(TWO_DIMENSION);
    this.position = DEFAULT_BWSELECTOR_POSITION;
    this.gradientColorRGBA = DEFAULT_COLOR;
    this.gradientColorRGBA = this.converter.HexStringToColorRGBA(this.storage.get(PRIMARY_COLOR));
  }

  drawBackground(): void {
    this.context.fillStyle = this.getRBGcolor();
    this.context.fillRect(
      BWSELECTOR_CANVAS_COORDIANTES.x,
      BWSELECTOR_CANVAS_COORDIANTES.y,
      BWSELECTOR_CANVAS_COORDIANTES.width,
      BWSELECTOR_CANVAS_COORDIANTES.height,
    );

    const whiteGradient = this.context.createLinearGradient(
      BWSELECTOR_CANVAS_COORDIANTES.x,
      BWSELECTOR_CANVAS_COORDIANTES.y,
      BWSELECTOR_CANVAS_COORDIANTES.width,
      BWSELECTOR_CANVAS_COORDIANTES.y,
    );
    whiteGradient.addColorStop(BWSELECTOR_GRADIENT_START, WHITE_OPAQUE);
    whiteGradient.addColorStop(BWSELECTOR_GRADIENT_END, WHITE_CLEAR);
    this.context.fillStyle = whiteGradient;
    this.context.fillRect(
      BWSELECTOR_CANVAS_COORDIANTES.x,
      BWSELECTOR_CANVAS_COORDIANTES.y,
      BWSELECTOR_CANVAS_COORDIANTES.width,
      BWSELECTOR_CANVAS_COORDIANTES.height,
    );

    const blackGradient = this.context.createLinearGradient(
      BWSELECTOR_CANVAS_COORDIANTES.x,
      BWSELECTOR_CANVAS_COORDIANTES.y,
      BWSELECTOR_CANVAS_COORDIANTES.x,
      BWSELECTOR_CANVAS_COORDIANTES.height,
    );
    blackGradient.addColorStop(BWSELECTOR_GRADIENT_START, BLACK_CLEAR);
    blackGradient.addColorStop(BWSELECTOR_GRADIENT_END, BLACK_OPAQUE);
    this.context.fillStyle = blackGradient;
    this.context.fillRect(
      BWSELECTOR_CANVAS_COORDIANTES.x,
      BWSELECTOR_CANVAS_COORDIANTES.y,
      BWSELECTOR_CANVAS_COORDIANTES.width,
      BWSELECTOR_CANVAS_COORDIANTES.height,
    );
  }

  drawSelector(): void {
    this.context.beginPath();
    this.context.strokeStyle = WHITE;
    this.context.lineWidth = BWSELECTOR_SLIDER_DIMENSIONS.lineWidth;
    this.context.arc(
      this.position.x,
      this.position.y,
      BWSELECTOR_SLIDER_DIMENSIONS.radius,
      BWSELECTOR_SLIDER_DIMENSIONS.startAngle,
      BWSELECTOR_SLIDER_DIMENSIONS.endAngle,
    );
    this.context.stroke();
    this.context.closePath();
  }

  getRBGcolor() {
    return RGBA +
      this.gradientColorRGBA.red + COMMA +
      this.gradientColorRGBA.green + COMMA +
      this.gradientColorRGBA.blue + COMMA +
      OPACITY_MAX + RIGHT_BRACKET;
  }

  updateColor(): ColorRGBA {
    const imageData = this.context.getImageData(this.position.x, this.position.y, ONE, ONE).data;
    const color: ColorRGBA = {
      red: imageData[ZERO],
      green: imageData[ONE],
      blue: imageData[TWO],
      opacity: imageData[THREE],
    } as ColorRGBA;
    return color;
  }

  updatePosition(x: number, y: number) {
    if (y > MIN_Y_CANVAS_POSITION && x > MAX_X_CANVAS_POSITION) {
      this.position.x = MAX_X_CANVAS_POSITION;
      this.position.y = MIN_Y_CANVAS_POSITION;
    } else if (y < MAX_Y_CANVAS_POSITION && x < MIN_X_CANVAS_POSITION) {
      this.position.x = MIN_X_CANVAS_POSITION;
      this.position.y = MAX_Y_CANVAS_POSITION;
    } else if (x > MAX_X_CANVAS_POSITION) {
      this.position.x = MAX_X_CANVAS_POSITION;
      this.position.y = y;
    } else if (y > MIN_Y_CANVAS_POSITION) {
      this.position.x = x;
      this.position.y = MIN_Y_CANVAS_POSITION;
    } else if (x < MIN_X_CANVAS_POSITION) {
      this.position.x = MIN_X_CANVAS_POSITION;
      this.position.y = y;
    } else if (y < MAX_Y_CANVAS_POSITION) {
      this.position.x = x;
      this.position.y = MAX_Y_CANVAS_POSITION;
    } else {
      this.position.y = y;
      this.position.x = x;
    }
  }
}
