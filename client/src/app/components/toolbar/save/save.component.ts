import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {saveAs} from 'file-saver';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { SaveService } from 'src/app/services/tool-service/save/save.service';
import { NAME_REGEX } from 'src/constant/toolbar/constant';
import {
  DEFAULT_TAG,
  EMPTY_NAME,
  MAX_LENGTH,
  MIN_LENGTH,
  PROPRIETARY_FORMAT,
  SRC_TYPE
} from 'src/constant/toolbar/save/constant';
import {OPTION_GRID_SHOWN} from '../../../../constant/storage/constant';
import {VISIBLE} from '../../../../constant/toolbar/grid/constant';
import {GridService} from '../../../services/grid/grid.service';
import {StorageService} from '../../../services/storage/storage.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent implements OnInit, OnDestroy {

  keys: any; // to check
  saveForm: FormGroup;
  src: SafeUrl;
  tagTable: string[];
  isGridShown = false;
  @ViewChild('drawingPreview', {static: false}) previewCanvas: ElementRef;

  constructor(public dialogRef: MatDialogRef<SaveComponent>, private fb: FormBuilder, public save: SaveService,
              public renderer: Renderer2, private sanitization: DomSanitizer, private shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService, public grid: GridService, public storage: StorageService) {
    dialogRef.disableClose = true;
    this.keys = Object.keys;
    this.tagTable = [];
    this.isGridShown = this.storage.get(OPTION_GRID_SHOWN) === VISIBLE;
  }

  initFormGroup(): void {
    this.saveForm = this.fb.group({
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
  }

  ngOnInit() {
    this.grid.toggleGrid(false);
    this.initFormGroup();
    this.src = this.sanitization.bypassSecurityTrustUrl(SRC_TYPE + this.save.createImageSrc());
  }

  addTag() {
    if (!this.save.isTagDuplicated(this.tagTable, this.saveForm.value.tag)) {
      this.tagTable.push(this.saveForm.value.tag);
    }
  }

  remove(index: number) {
    this.tagTable.splice(index, 1);
  }

  onSubmit(): void {
    const drawing = this.save.generateDrawingObject(
      this.saveForm.value.name,
      this.drawingElementManager.drawingElementsOnDrawing,
      this.tagTable,
    );
    this.save.saveDrawing(drawing).subscribe((id: string) => {
      this.save.sendImage(id, this.save.createImageSrc());
      this.save.saveIdTagRelation(id, drawing.name, this.tagTable).subscribe();
    });
  }

  onLocalSave(): void {
    const filename = `${this.saveForm.value.name}.${PROPRIETARY_FORMAT}`;
    saveAs(this.save.convertImageSrcToFile(this.save.createProprietaryImageSrc()), filename);

  }

  ngOnDestroy(): void {
    this.shortcutService.changeShortcutAccess(true);
    this.shortcutService.changeShortcutAccess(false, false);
    this.grid.toggleGrid(this.isGridShown);
  }
}
