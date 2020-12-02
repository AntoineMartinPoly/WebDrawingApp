import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { ColorSliderService } from 'src/app/services/toolbar/color-picker/color-slider/color-slider.service';
import { COLOR_SLIDER_DIMENSIONS } from 'src/constant/color-picker/constant';
import { ColorRGBA } from 'src/interface/colors';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {

  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  private mouseDown = false;
  @Output() colorRGBChange = new EventEmitter<ColorRGBA>();

  constructor(public colorSliderService: ColorSliderService, public shortcutService: ShortcutService) {}

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  unFocus(): void {
    this.canvas.nativeElement.blur();
  }

  ngAfterViewInit(): void {
    this.colorSliderService.setUpService(this.canvas);
    this.colorSliderService.drawBackground();
    this.colorSliderService.drawSlider();
  }

  onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.colorSliderService.updatePosition(event.offsetY);
    this.updateColor();
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      this.colorSliderService.updatePosition(event.offsetY);
      this.updateColor();
    }
  }

  onMouseLeave() {
    this.mouseDown = false;
  }

  updateColor() {
    this.colorSliderService.drawBackground();
    this.colorSliderService.drawSlider();
    const color = this.colorSliderService.getColorFromPosition(COLOR_SLIDER_DIMENSIONS.middle, this.colorSliderService.position);
    this.colorRGBChange.emit(color);
  }

}
