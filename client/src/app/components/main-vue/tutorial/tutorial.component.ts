import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';
import { MAX_PAGE, MIN_PAGE } from 'src/constant/toolbar/constant';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnDestroy {

  deactivateTutorial: boolean;
  page: number;
  isPageProcess: boolean;

  constructor(public dialogRef: MatDialogRef<TutorialComponent>, public tutorial: TutorialService,
              private shortcutService: ShortcutService) {
    dialogRef.disableClose = true;
    this.deactivateTutorial = false;
    this.page = 0;
    this.isPageProcess = true;
  }

  changePage(increment: boolean = true): void {
    if (this.isPageProcess) {
      this.isPageProcess = false;
      increment ? this.page++ : this.page--;
      this.pageLimiter();
      this.isPageProcess = true;
    }
  }

  pageLimiter(): void {
    if (this.page > MAX_PAGE) {
      this.page = MAX_PAGE;
    } else if (this.page < MIN_PAGE) {
      this.page = MIN_PAGE;
    }
  }

  ngOnDestroy() {
    this.tutorial.saveIsTutorialActive(this.deactivateTutorial);
    this.shortcutService.changeShortcutAccess(true);
    this.shortcutService.changeShortcutAccess(false, false);
  }

}
