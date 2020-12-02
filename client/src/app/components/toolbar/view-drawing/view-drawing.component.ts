import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ImageHandlerService } from 'src/app/services/drawing/image-handler/image-handler.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { OpenService } from 'src/app/services/tool-service/open/open.service';
import { SaveService } from 'src/app/services/tool-service/save/save.service';
import { ONE, ZERO } from 'src/constant/constant';
import {PROPRIETARY_IMG_TYPE} from 'src/constant/tool-service/save/constant';
import {
  INDEX_BEGIN,
  NO_DRAWING_SELECTED,
  SNACKBAR_ALERT_ACTION,
  SNACKBAR_ALERT_DURATION
} from 'src/constant/toolbar/view-drawing/constant';
import { IdTag } from 'src/interface/id-tag';

@Component({
  selector: 'app-view-drawing',
  templateUrl: './view-drawing.component.html',
  styleUrls: ['./view-drawing.component.scss'],
})
export class ViewDrawingComponent implements OnInit, OnDestroy {

  selectedTags: string[];
  drawingsTable: IdTag[];
  imgIndex: number;
  isReady: boolean;
  isNext: boolean;
  isLoading: boolean;
  selectedDrawing: number;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public dialogRef: MatDialogRef<ViewDrawingComponent>, public save: SaveService,
              public open: OpenService, public imageHandler: ImageHandlerService,
              private shortcutService: ShortcutService, private snackBar: MatSnackBar) {

    dialogRef.disableClose = true;
    this.selectedTags = [];
    this.drawingsTable = [];
    this.imgIndex = INDEX_BEGIN;
    this.selectedDrawing = NO_DRAWING_SELECTED;
    this.isLoading = false;
  }

  isTagDuplicate(theTag: string): boolean {
    for (const tag of this.selectedTags) {
      if (theTag === tag) {
        return true;
      }
    }
    return false;
  }

  addTag(tag: string): void {
    if (tag && !this.isTagDuplicate(tag)) {
      this.isReady = false;
      this.imgIndex = 0;
      this.selectedTags.push(tag);
      this.loadDrawing();
    }
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= ZERO) {
      this.selectedTags.splice(index, ONE);
      this.imgIndex = ZERO;
      this.isReady = false;
      this.loadDrawing();
    }
  }

  upIndex(isUp: boolean) {
    this.selectedDrawing = NO_DRAWING_SELECTED;
    isUp ? this.imgIndex += ONE : this.imgIndex -= ONE;
  }

  loadDrawing(): void {
    this.open.getDrawings(this.imgIndex, this.selectedTags).subscribe((tags: IdTag[]) => {
      this.isReady = false;
      this.drawingsTable = tags;
      this.open.stringifyTagList(this.drawingsTable);
      this.open.getDrawingImageUrl(this.drawingsTable);
      this.open.isNext(this.imgIndex, this.selectedTags).subscribe((isThereNext: boolean) => {
        this.isNext = isThereNext;
        this.isReady = true;
      });
    });
  }

  openSelectedImage() {
    this.isLoading = true;
    this.imageHandler.getDrawingData(this.drawingsTable[this.selectedDrawing].link as string).subscribe((res: HttpResponse<string>) => {
      this.imageHandler.openDrawing(res.body as string);
      this.dialogRef.close();
    });
  }

  openLocalProprietaryImage(event: any, fileReader: FileReader = new FileReader()) {
    this.isLoading = true;
    fileReader.addEventListener('load', () => {
      const encryptedResult = fileReader.result as string;

      try {
        this.imageHandler.openProprietaryDrawing(encryptedResult);
      } catch (error) {
        this.snackBar.open(`${error.name}: ${error.message}`, SNACKBAR_ALERT_ACTION, {
          duration: SNACKBAR_ALERT_DURATION,
        });
      }
      // tslint:disable-next-line: no-empty
      fileReader.removeEventListener('load', () => {});
      this.dialogRef.close();
    });
    fileReader.readAsText(event.target.files[ZERO], PROPRIETARY_IMG_TYPE);
  }

  ngOnInit() {
    this.loadDrawing();
  }

  ngOnDestroy() {
    this.shortcutService.changeShortcutAccess(true);
    this.shortcutService.changeShortcutAccess(false, false);
  }
}
