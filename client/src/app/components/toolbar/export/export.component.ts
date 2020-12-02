import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';  // This is a JS library. No respect for any convention.
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { SaveService } from 'src/app/services/tool-service/save/save.service';
import { NAME_REGEX } from 'src/constant/toolbar/constant';
import { DEFAULT_TAG, EMPTY_NAME, ExportFormat, MAX_LENGTH, MIN_LENGTH,
  SRC_TYPE} from 'src/constant/toolbar/save/constant';
import {OPTION_GRID_SHOWN} from '../../../../constant/storage/constant';
import {VISIBLE} from '../../../../constant/toolbar/grid/constant';
import {GridService} from '../../../services/grid/grid.service';
import {StorageService} from '../../../services/storage/storage.service';
import { SaveComponent } from '../save/save.component';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit, OnDestroy {

  keys: any; // to check
  ExportFormat = ExportFormat;
  exportForm: FormGroup;
  exportFormat: ExportFormat;
  src: SafeUrl;
  exportControl: FormControl;
  isShown: boolean;

  @ViewChild('drawingPreview', {static: false}) previewCanvas: ElementRef;

  constructor(public dialogRef: MatDialogRef<SaveComponent>, private fb: FormBuilder, public save: SaveService,
              public renderer: Renderer2, private sanitization: DomSanitizer, private shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService, public grid: GridService, public storage: StorageService) {
    dialogRef.disableClose = true;
    this.keys = Object.keys;
    this.isShown = this.storage.get(OPTION_GRID_SHOWN) === VISIBLE;
  }

  initFormGroup(): void {
    this.exportForm = this.fb.group({
      name: [EMPTY_NAME, [
        Validators.required,
        Validators.minLength(MIN_LENGTH),
        Validators.maxLength(MAX_LENGTH),
        Validators.pattern(NAME_REGEX),
      ]],
      tag: [DEFAULT_TAG, [
        Validators.maxLength(MAX_LENGTH),
        Validators.pattern(NAME_REGEX),
      ]],
    });
    this.exportControl = new FormControl(EMPTY_NAME, Validators.required);
  }

  onExport(): void {
    const filename = `${this.exportForm.value.name}.${this.exportFormat}`;
    if (this.exportFormat !== ExportFormat.svg) {
      html2canvas(DrawingService.getInstance().svg).then((canvas: HTMLCanvasElement) => {
        saveAs(canvas.toDataURL(`image/${this.exportFormat}`), filename);
      });
    } else {
      saveAs(this.save.convertImageSrcToFile(this.save.createImageSrc()), filename);
    }
  }

  ngOnInit() {
    this.grid.toggleGrid(false);
    this.initFormGroup();
    this.src = this.sanitization.bypassSecurityTrustUrl(SRC_TYPE + this.save.createImageSrc());
  }

  ngOnDestroy(): void {
    this.grid.toggleGrid(this.isShown);
    this.shortcutService.changeShortcutAccess(false, false);
    this.shortcutService.changeShortcutAccess(true);
  }

}
