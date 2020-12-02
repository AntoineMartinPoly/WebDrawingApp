import { Component, OnDestroy, OnInit, } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { SHAPE_SELECTED } from 'src/constant/storage/constant';
import { SHAPE_TABLE, SHAPES } from 'src/constant/toolbar/shape/constant';
import { Shortcut } from 'src/interface/shortcut';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.scss'],
})
export class ShapeComponent implements OnInit, OnDestroy {

  shapeNames: string[];
  shapeTable: string[];
  shapeSelector: string;
  shorcutSubscription: Subscription;

  constructor(public storage: StorageService, public shortcutService: ShortcutService) {
    this.shapeNames = SHAPES;
    this.shapeTable = SHAPE_TABLE;
    this.shapeSelector = this.storage.get(SHAPE_SELECTED);
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  unFocus(event: MatSelectChange): void {
    event.source.toggle();
  }

  ngOnInit(): void {
    this.shapeSelector = this.storage.get(SHAPE_SELECTED);
    this.shorcutSubscription =  this.shortcutService.getShortcut().subscribe((shortcut: Shortcut) => {
      this.shapeSelector = this.shortcutService.handleShapeShortcut(shortcut, false) as string;
    });
  }

  ngOnDestroy(): void {
    this.shorcutSubscription.unsubscribe();
  }

}
