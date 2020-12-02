import { AfterViewInit,  Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { OpacitySliderService } from 'src/app/services/toolbar/color-picker/opacity-slider/opacity-slider.service';
import { MAX_OPACITY_VALUE } from 'src/constant/color-picker/constant';
import { ColorRGBA } from 'src/interface/colors';

@Component({
  selector: 'app-opacity-slider',
  templateUrl: './opacity-slider.component.html',
  styleUrls: ['./opacity-slider.component.scss'],
})
export class OpacitySliderComponent implements AfterViewInit {

  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  private mouseDown = false;
  @Output() opacityChange = new EventEmitter<number>();

  constructor(public opacityService: OpacitySliderService, public shortcutService: ShortcutService) {}

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  unFocus(): void {
    this.canvas.nativeElement.blur();
  }

  ngAfterViewInit(): void {
    this.opacityService.setUpService(this.canvas);
    this.opacityService.drawBackground();
    this.opacityService.drawSlider();
  }

  onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.opacityService.updatePosition(event.offsetY);
    this.updateOpacity();
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      this.opacityService.updatePosition(event.offsetY);
      this.updateOpacity();
    }
  }

  onMouseLeave() {
    this.mouseDown = false;
  }

  updateOpacity() {
    this.opacityService.drawBackground();
    this.opacityService.drawSlider();
    const opacity = this.opacityService.getOpacityFromPosition(this.opacityService.position);
    this.opacityChange.emit(opacity);
  }

  updateGradientColor(colorRGBA: ColorRGBA) {
    this.opacityService.colorRGBA = colorRGBA;
    if ( colorRGBA.opacity === MAX_OPACITY_VALUE ) {
      this.opacityService.resetSliderPosition();
    }
    this.opacityService.drawBackground();
    this.opacityService.drawSlider();
    this.opacityChange.emit(colorRGBA.opacity);
  }

}
