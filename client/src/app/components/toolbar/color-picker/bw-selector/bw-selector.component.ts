import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { BwSelectorService } from 'src/app/services/toolbar/color-picker/bw-selector/bw-selector.service';
import { ColorRGBA } from 'src/interface/colors';

@Component({
  selector: 'app-bw-selector',
  templateUrl: './bw-selector.component.html',
  styleUrls: ['./bw-selector.component.scss'],
})
export class BwSelectorComponent implements AfterViewInit {

  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  private mouseDown = false;
  @Output() hueChange = new EventEmitter<ColorRGBA>();

  constructor(public bwService: BwSelectorService, public shortcutService: ShortcutService) {
  }

  ngAfterViewInit(): void {
    this.bwService.setUpService(this.canvas);
    this.bwService.drawBackground();
    this.bwService.drawSelector();
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  unFocus(): void {
    this.canvas.nativeElement.blur();
  }

  onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.bwService.updatePosition(event.offsetX, event.offsetY);
    this.updateDrawingColor();
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      this.bwService.updatePosition(event.offsetX, event.offsetY);
      this.updateDrawingColor();
    }
  }

  onMouseLeave() {
    this.mouseDown = false;
  }

  updateGradientColor(colorRGBA: ColorRGBA, emit = true) {
    this.bwService.gradientColorRGBA = colorRGBA;
    this.bwService.drawBackground();
    this.bwService.drawSelector();
    if (emit) {this.hueChange.emit(colorRGBA); }
  }

  updateDrawingColor() {
    this.bwService.drawBackground();
    this.bwService.drawSelector();
    this.hueChange.emit(this.bwService.updateColor());
  }
}
