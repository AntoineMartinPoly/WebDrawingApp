import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import {KeypressService} from 'src/app/services/tool-service/keypress.service';
import { ColorPickerService } from 'src/app/services/toolbar/color-picker/color-picker.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { DRAWING_HEIGHT, DRAWING_WIDTH } from 'src/constant/storage/constant';
import { MAX_COLOR, MAX_COLOR_1, MAX_COLOR_255, MAX_OPACITY,
  MIN_VALUE, PALETTE, PATTERN_VALIDATION_CREATE } from 'src/constant/toolbar/create-drawing/constant';
import { ColorRGBA } from 'src/interface/colors';

@Component({
  selector: 'app-create-drawing-scene',
  templateUrl: './create-drawing-scene.component.html',
  styleUrls: ['./create-drawing-scene.component.scss'],
})
export class CreateDrawingSceneComponent implements OnInit, OnDestroy {

  form: FormGroup;
  submitted: boolean;
  selectedLink: string;

  constructor(public dialogRef: MatDialogRef<CreateDrawingSceneComponent>, private formBuilder: FormBuilder,
              public palette: ColorPickerService, public keypressService: KeypressService,
              private storage: StorageService, private shortcutService: ShortcutService,
              public toolbarService: ToolbarService, public drawingElementManager: DrawingElementManagerService,
              public grid: GridService) {
                dialogRef.disableClose = true;
                this.submitted = false;
                this.selectedLink = PALETTE;
              }

  ngOnInit() {
    this.grid.toggleGrid(false);
    this.form = this.formBuilder.group({
      height: [this.storage.get(DRAWING_HEIGHT, true), [Validators.required, Validators.min(MIN_VALUE)]],
      width: [this.storage.get(DRAWING_WIDTH, true), [Validators.required, Validators.min(MIN_VALUE)]],
      red: [MAX_COLOR_255, [Validators.required, Validators.min(MIN_VALUE), Validators.max(MAX_COLOR)]],
      green: [MAX_COLOR_255, [Validators.required, Validators.min(MIN_VALUE), Validators.max(MAX_COLOR)]],
      blue: [MAX_COLOR_255, [Validators.required, Validators.min(MIN_VALUE), Validators.max(MAX_COLOR)]],
      opacity: [MAX_COLOR_1, [Validators.required, Validators.min(MIN_VALUE), Validators.max(MAX_OPACITY),
        Validators.pattern(PATTERN_VALIDATION_CREATE)]],
    });
  }

  ngOnDestroy() {
    this.shortcutService.changeShortcutAccess(false, false);
    this.shortcutService.changeShortcutAccess(true);
  }

  onSubmit() {
    this.toolbarService.sendNewDrawingInfo({
      height: this.form.controls.height.value,
      width: this.form.controls.width.value,
      color: this.colorChoose(),
    });
    this.drawingElementManager.drawingElementsOnDrawing = [];
    this.submitted = true;
  }

  setRadio(option: string): void {
    this.selectedLink = option;
  }

  isSelected(name: string): boolean {
    return this.selectedLink ? (this.selectedLink === name) : false;
  }

  colorChoose(): string {
    const rgbaHex = this.palette.converter.ColorRGBAToHexString({
      red: this.form.controls.red.value,
      green: this.form.controls.green.value,
      blue: this.form.controls.blue.value,
      opacity: Math.trunc(this.form.controls.opacity.value * 255),
    } as ColorRGBA);
    const drawingToolName = PALETTE;
    const palette = (this.isSelected(drawingToolName)) ? this.palette.converter.ColorRGBAToHexString(this.palette.primaryColor) : rgbaHex;
    return palette;
  }
}
