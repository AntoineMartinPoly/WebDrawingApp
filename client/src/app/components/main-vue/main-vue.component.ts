import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { BucketService } from 'src/app/services/tool-service/bucket/bucket.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';
import { ZERO } from 'src/constant/constant';
import { DRAWING_ELEMENT_INDEX } from 'src/constant/cursor/constant';
import { DRAWING } from 'src/constant/drawing/constant';
import { DRAWING_HEIGHT, DRAWING_WIDTH, SESSION_STORAGE } from 'src/constant/storage/constant';
import { NONE } from 'src/constant/svg/constant';
import { COLOR_TAB, FIRST_CHILD } from 'src/constant/toolbar/constant';
import { TutorialComponent } from './tutorial/tutorial.component';

@Component({
  selector: 'app-main-vue',
  templateUrl: './main-vue.component.html',
  styleUrls: ['./main-vue.component.scss'],
})
export class MainVueComponent implements OnInit {

  cursorStyle: string;
  disableDrag: boolean;

  constructor(public dialog: MatDialog, public tutorial: TutorialService,
              public storage: StorageService, public toolbarService: ToolbarService,
              private viewContainerRef: ViewContainerRef, public shortcutService: ShortcutService,
              public bucketService: BucketService) {
                this.disableDrag = true;
              }

  cursorUpdateListener(): void {
    this.toolbarService.getCursorUpdate().subscribe((cursor: string) => {
      this.viewContainerRef.element.nativeElement.children[FIRST_CHILD].children[DRAWING_ELEMENT_INDEX].className = cursor;
    });
    this.bucketService.getCursorUpdate().subscribe((cursor: string) => {
      this.viewContainerRef.element.nativeElement.children[FIRST_CHILD].children[DRAWING_ELEMENT_INDEX].className = cursor;
    });
  }

  colorTabListener(): void {
    this.toolbarService.getColorTabUpdate().subscribe((doOpenTab: boolean) => {
      this.viewContainerRef.element.nativeElement.children[FIRST_CHILD].children[COLOR_TAB].style.display =
      doOpenTab ? 'inline' : NONE;
    });
  }

  ngOnInit() {
    this.storage.init();
    if (!this.tutorial.isDeactivated()) {
      this.dialog.open(TutorialComponent);
    }
    const surface = document.getElementsByClassName(DRAWING).item(ZERO);
    if (surface != null) {
      this.storage.set(DRAWING_WIDTH, (surface.clientWidth).toString(), SESSION_STORAGE);
      this.storage.set(DRAWING_HEIGHT, (surface.clientHeight).toString(), SESSION_STORAGE);
    }
    this.cursorUpdateListener();
    this.colorTabListener();
    this.viewContainerRef.element.nativeElement.children[FIRST_CHILD].children[COLOR_TAB].style.display = NONE;
  }

}
