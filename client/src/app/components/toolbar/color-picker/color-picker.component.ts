import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { ColorPickerService } from 'src/app/services/toolbar/color-picker/color-picker.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { KEYBOARD_ARROW_DOWN, KEYBOARD_ARROW_LEFT, KEYBOARD_ARROW_RIGHT,
  KEYBOARD_ARROW_UP, MAX_OPACITY_VALUE, MAX_X_CANVAS_POSITION, MAX_Y_CANVAS_POSITION, PRIMARY_CANVAS, SECONDARY_CANVAS
} from 'src/constant/color-picker/constant';
import { ColorRGBA } from 'src/interface/colors';
import { BwSelectorComponent } from './bw-selector/bw-selector.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { OpacitySliderComponent } from './opacity-slider/opacity-slider.component';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})

export class ColorPickerComponent implements AfterViewInit {

  @ViewChild(ColorSliderComponent, {static: false}) colorSlider: ColorSliderComponent;
  @ViewChild(OpacitySliderComponent, {static: false}) opacitySlider: OpacitySliderComponent;
  @ViewChild(BwSelectorComponent, {static: false}) bwSelector: BwSelectorComponent;
  @ViewChild('primary', {static: false}) canvasP: ElementRef;
  @ViewChild('secondary', {static: false}) canvasS: ElementRef;
  @Input() isImplementedFromToolBar: boolean;
  doubleArrows = faArrowsAltH;

  constructor(public colorService: ColorPickerService, public shortcutService: ShortcutService,
              public toolbar: ToolbarService) {
    this.toolbar.getCreateDrawingIsDone().subscribe((drawingIsDone) => {
      if ( drawingIsDone && this.isImplementedFromToolBar ) {
        this.ngAfterViewInit();
      }
    });
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngAfterViewInit() {
    this.colorService.isPrimaryCanvasSelected = true;
    this.colorService.setUpService(this.canvasP.nativeElement, this.canvasS.nativeElement);
    this.colorSlider.ngAfterViewInit();
    this.bwSelector.ngAfterViewInit();
    this.opacitySlider.ngAfterViewInit();
  }

  showColorOptions(canvas: string): void {
    if ( canvas === PRIMARY_CANVAS ) {
      this.colorService.isPrimaryCanvasSelected = true;
      this.setUpSliders(this.colorService.primaryColor);
    } else if ( canvas === SECONDARY_CANVAS ) {
      this.colorService.isPrimaryCanvasSelected = false;
      this.setUpSliders(this.colorService.secondaryColor);
    }
  }

  updateColorFromHex(keys: KeyboardEvent): void {
    if ( this.colorService.checkHexColor(this.colorService.hexColor) && !this.isKeyPressedArrow(keys) ) {
      this.colorService.updateColorFromHexInput();
      this.colorService.primaryColor = this.colorService.converter.HexStringToColorRGBA(this.colorService.hexColor);
      this.colorService.colorUsed.push(this.colorService.converter.HexStringToColorRGBA(this.colorService.hexColor));
      this.colorService.colorUsed.shift();
      this.colorService.saveColorsToStorage();
      this.updateBW(this.colorService.primaryColor);
    }
  }

  isKeyPressedArrow(keys: KeyboardEvent): boolean {
    if ( keys.key === KEYBOARD_ARROW_DOWN || keys.key === KEYBOARD_ARROW_UP ||
      keys.key === KEYBOARD_ARROW_RIGHT || keys.key === KEYBOARD_ARROW_LEFT ) {
        return true;
    }
    return false;
  }

  updateUsedColor(): void {
    if ( this.colorService.checkHexColor(this.colorService.hexColor) ) {
      this.colorService.updateColorFromHexInput();
      this.colorService.primaryColor = this.colorService.converter.HexStringToColorRGBA(this.colorService.hexColor);
      this.colorService.colorUsed.push(this.colorService.converter.HexStringToColorRGBA(this.colorService.hexColor));
      this.colorService.colorUsed.shift();
      this.colorService.saveColorsToStorage();
    }
  }

  usedColorUpdate(color: ColorRGBA) {
    // Typescript deep copy
    this.colorService.isPrimaryCanvasSelected ? this.colorService.primaryColor = color
                                              : this.colorService.secondaryColor = color;
    this.setUpSliders(color);
  }

  setUpSliders(color: ColorRGBA) {
    this.bwSelector.bwService.updatePosition(MAX_X_CANVAS_POSITION, MAX_Y_CANVAS_POSITION);
    this.opacitySlider.opacityService.updatePosition(
      MAX_X_CANVAS_POSITION - Math.floor(
        (color.opacity * MAX_X_CANVAS_POSITION) / MAX_OPACITY_VALUE));
    this.updateRGB(color);
  }

  switchColor() {
    const colorP = this.colorService.primaryColor;
    const colorS = this.colorService.secondaryColor;

    this.colorService.primaryColor = colorS;
    this.colorService.secondaryColor = colorP;

    this.colorService.fillCanvas(colorS, this.canvasP.nativeElement);
    this.colorService.fillCanvas(colorP, this.canvasS.nativeElement);
    this.setUpSliders(colorS);

    this.colorService.saveColorsToStorage();
  }

  updateRGB(color: ColorRGBA) {
    this.bwSelector.updateGradientColor(color);
    // this.usedColorUpdate(color);
  }

  updateBW(color: ColorRGBA) {
    this.colorService.isPrimaryCanvasSelected ?
                        this.colorService.primaryColor = color :
                        this.colorService.secondaryColor = color;
    this.opacitySlider.updateGradientColor(color);
    // this.usedColorUpdate(color);
  }

  updateOpacity(opacity: number) {
    this.colorService.isPrimaryCanvasSelected ?
                        this.colorService.primaryColor.opacity = opacity :
                        this.colorService.secondaryColor.opacity = opacity;
    this.colorService.updateCanvasColor();
    this.colorService.saveColorsToStorage();
  }
}
