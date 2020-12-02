import { ElementRef, Injectable } from '@angular/core';
import { CANVAS_BACKGROUND_COLOR, HEX_LENGTH,
  HEX_REGEX, HEX_REGEX_FLAG, INITIAL_COLOR_ARRAY,
  INITIAL_PRIMARY_COLOR, INITIAL_SECONDARY_COLOR, NUMBER_OF_USED_COLORS, USED_COLORS } from 'src/constant/color-picker/constant';
import { FORTY_FIVE, ONE, PRIMARY_COLOR, SECONDARY_COLOR, ZERO } from 'src/constant/constant';
import { ERROR } from 'src/constant/storage/constant';
import { TWO_DIMENSION } from 'src/constant/svg/constant';
import { ColorRGBA } from 'src/interface/colors';
import { ConverterService } from '../../converter/converter.service';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ColorPickerService {

  isPrimaryCanvasSelected: boolean;
  primaryColor: ColorRGBA;
  secondaryColor: ColorRGBA;
  colorUsed: ColorRGBA[];
  hexColor: string;
  private canvasPrincipal: ElementRef;
  private canvasSecondaire: ElementRef;

  constructor(public storage: StorageService, public converter: ConverterService) {
    this.setUpVariables();
  }

  setUpVariables() {
    // Important to initiate color variables before the view is generated
    this.colorUsed = INITIAL_COLOR_ARRAY;
  }

  setUpService(canvasPrincipal: ElementRef, canvasSecondaire: ElementRef) {
    this.canvasPrincipal = canvasPrincipal;
    this.canvasSecondaire = canvasSecondaire;
    this.setUpPrimaryColor();
    this.setUpSecondaryColor();
    this.setUpUsedColors();
  }

  setUpPrimaryColor() {
    const colorPrimary = this.storage.get(PRIMARY_COLOR);
    if (colorPrimary !== ERROR) {
      this.fillCanvas(this.converter.HexStringToColorRGBA(colorPrimary), this.canvasPrincipal);
      this.primaryColor = this.converter.HexStringToColorRGBA(colorPrimary);
    } else {
      this.fillCanvas(this.converter.HexStringToColorRGBA(INITIAL_PRIMARY_COLOR), this.canvasPrincipal);
      this.primaryColor = this.converter.HexStringToColorRGBA(INITIAL_PRIMARY_COLOR);
      this.storage.set(PRIMARY_COLOR, INITIAL_PRIMARY_COLOR);
    }
  }

  setUpSecondaryColor() {
    const colorSecondary = this.storage.get(SECONDARY_COLOR);
    if (colorSecondary !== ERROR) {
      this.fillCanvas(this.converter.HexStringToColorRGBA(colorSecondary), this.canvasSecondaire);
      this.secondaryColor = this.converter.HexStringToColorRGBA(colorSecondary);
    } else {
      this.fillCanvas(this.converter.HexStringToColorRGBA(INITIAL_SECONDARY_COLOR), this.canvasSecondaire);
      this.secondaryColor = this.converter.HexStringToColorRGBA(INITIAL_SECONDARY_COLOR);
      this.storage.set(SECONDARY_COLOR, INITIAL_SECONDARY_COLOR);
    }
  }

  setUpUsedColors() {
    USED_COLORS.forEach((element) => {

      const colorString = this.storage.get(element);
      if (colorString !== ERROR) {
        const colorRGBA = this.converter.HexStringToColorRGBA(colorString);
        this.colorUsed.push(colorRGBA);
        this.colorUsed.shift();
      }
    });
  }

  checkHexColor(hex: string): boolean {
    const regExp = new RegExp(HEX_REGEX, HEX_REGEX_FLAG);
    const filteredHex = regExp.exec(this.hexColor);
    if (filteredHex !== null &&
      filteredHex[ZERO] === this.hexColor &&
      filteredHex[ZERO].length === HEX_LENGTH) {
      return true;
    }
    return false;
  }

  updateColorFromHexInput() {
    if (this.checkHexColor(this.hexColor)) {
      this.fillCanvas(this.converter.HexStringToColorRGBA(this.hexColor),
        (this.isPrimaryCanvasSelected ? this.canvasPrincipal : this.canvasSecondaire));
    }
  }

  updateCanvasColor() {
    this.fillCanvas((this.isPrimaryCanvasSelected ? this.primaryColor : this.secondaryColor),
      (this.isPrimaryCanvasSelected ? this.canvasPrincipal : this.canvasSecondaire));
    this.hexColor = this.converter.ColorRGBAToHexString((this.isPrimaryCanvasSelected ? this.primaryColor : this.secondaryColor));
  }

  fillCanvas(color: ColorRGBA, canvas: any): void {
    canvas.getContext(TWO_DIMENSION).fillStyle = CANVAS_BACKGROUND_COLOR;
    canvas.getContext(TWO_DIMENSION).fillRect(ZERO, ZERO, FORTY_FIVE, FORTY_FIVE);
    canvas.getContext(TWO_DIMENSION).fillStyle = this.converter.ColorRGBAToHexString(color);
    canvas.getContext(TWO_DIMENSION).globalAlpha = color.opacity;
    canvas.getContext(TWO_DIMENSION).fillRect(ZERO, ZERO, FORTY_FIVE, FORTY_FIVE);
  }

  saveColorsToStorage() {
    const colorP = this.converter.ColorRGBAToHexString(this.primaryColor);
    this.storage.set(PRIMARY_COLOR, colorP);

    const colorS = this.converter.ColorRGBAToHexString(this.secondaryColor);
    this.storage.set(SECONDARY_COLOR, colorS);

    for (let i = ZERO; i < NUMBER_OF_USED_COLORS + ONE; i++) {
      const color = this.converter.ColorRGBAToHexString(this.colorUsed[i]);
      this.storage.set(USED_COLORS[i], color);
    }
  }

}
