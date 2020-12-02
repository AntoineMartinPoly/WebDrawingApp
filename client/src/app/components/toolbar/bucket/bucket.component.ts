import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { BucketToolHandlerService } from 'src/app/services/tool-handler/bucket/bucket-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_BUCKET } from 'src/constant/cursor/constant';
import { BUCKET_TOLERANCE } from 'src/constant/storage/constant';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss'],
})
export class BucketComponent implements OnInit {

  constructor(
    public toolbarService: ToolbarService,
    public shortcutService: ShortcutService,
    public storage: StorageService,
    public bucket: BucketToolHandlerService,
  ) {ToolHandler.currentToolType = this.bucket; }

  ngOnInit() {
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_BUCKET);
    this.storage.set(BUCKET_TOLERANCE, 0.1.toString());
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  updateTolerance(event: MatSliderChange) {
    if (event.value) {
      this.storage.set(
        BUCKET_TOLERANCE,
        event.value.toString(),
      );
    }
  }
}
