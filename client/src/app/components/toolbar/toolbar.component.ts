import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import {
  faBook, faEraser, faEyeDropper, faFileExport, faFillDrip, faFont, faImages, faObjectUngroup, faPaintBrush,
  faPlus, faSave, faShapes, faStamp, faTint, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { DrawingElementManagerService } from 'src/app/services/drawing-element-manager/drawing-element-manager.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { ZERO } from 'src/constant/constant';
import { CREATE, CREATE_DRAWING, DEFAULT_TOOL, EXPORT,
  EXPORT_DRAWING, GALLERY, OPTION_TABLE, SAVE, TOOL_TABLE, TUTORIAL, VIEW_DRAWING } from 'src/constant/toolbar/constant';
import { Shortcut } from 'src/interface/shortcut';
import { TutorialComponent } from '../main-vue/tutorial/tutorial.component';
import { CreateDrawingSceneComponent } from './create-drawing-scene/create-drawing-scene.component';
import { WarningDialogComponent } from './create-drawing-scene/warning-dialog/warning-dialog.component';
import { ExportComponent } from './export/export.component';
import { SaveComponent } from './save/save.component';
import { ViewDrawingComponent } from './view-drawing/view-drawing.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  toolButtonList: IconDefinition[];
  ActionButtonList: IconDefinition[];
  toolTable: string[];
  optionTable: string[];
  toolSelector: number;
  inSelection: boolean;
  shortcutEnable: boolean;
  isToolInUse: boolean;

  constructor(public dialog: MatDialog, public toolbarService: ToolbarService, public shortcutService: ShortcutService,
              public drawingElementManager: DrawingElementManagerService) {
                this.toolButtonList =
                [faPaintBrush, faShapes, faTint, faFont, faEyeDropper, faStamp, faObjectUngroup, faEraser, faFillDrip];
                this.ActionButtonList = [faPlus, faSave, faImages, faFileExport, faBook];
                this.toolTable = TOOL_TABLE;
                this.optionTable = OPTION_TABLE;
                this.toolSelector = DEFAULT_TOOL;
                this.inSelection = true;
                this.shortcutEnable = true;
                this.isToolInUse = false;
               }

  @HostListener('window:keypress', ['$event']) shortcut(event: KeyboardEvent) {
    if (this.shortcutEnable && !this.isToolInUse) {
      const shortcut = this.initShortcutHandle(event);
      if (shortcut.isCtrl) {
        this.handleCtrlShortcut(shortcut);
      } else if (this.shortcutService.isGridShortcut(shortcut)) {
        this.handleGridShortcut(shortcut);
      } else {
        this.handleShortcut(shortcut);
      }
     }
  }

  initShortcutHandle(event: KeyboardEvent): Shortcut {
    this.shortcutEnable = false;
    return this.shortcutService.createShortcutObject(event);
  }

  handleCtrlShortcut(shortcut: Shortcut): void {
    this.isToolInUse = true;
    this.shortcutEnable = true;
    this.toolbarService.sendColorTabUpdate(false);
    const dialogOption: number = this.shortcutService.giveOptionShortcut(shortcut);
    !(dialogOption === undefined) ?
    this.openComponentDialog(this.shortcutService.giveOptionShortcut(shortcut)) :
    this.isToolInUse = false;
  }

  handleGridShortcut(shortcut: Shortcut): void {
    this.shortcutService.handleGridShortcut(shortcut);
    this.shortcutEnable = true;
  }

  handleShortcut(shortcut: Shortcut) {
    const index: number | undefined = this.shortcutService.giveToolShortcut(shortcut);
    if (!(index === undefined)) {
          this.sidenav.close();
          this.toolSelector = index;
          this.inSelection = false;
          this.shortcutService.handleToolShortcut(shortcut, index);
          this.shortcutService.sendShortcut(shortcut);
        }
    this.shortcutEnable = true;
  }

  selectTool(index: number): void {
    this.toolSelector = index;
  }

  openComponentDialog(component: number): void {
    this.shortcutEnable = false;
    switch (component) {
      case CREATE: {
        this.drawingElementManager.drawingElementsOnDrawing.length === ZERO ?
        this.dialog.open(CreateDrawingSceneComponent).afterClosed().subscribe(() =>
        this.toolbarService.sendCreateDrawingIsDone(true)) :
        this.dialog.open(WarningDialogComponent, {
          data: CREATE_DRAWING,
        });
        break;
      }
      case SAVE: {
        this.dialog.open(SaveComponent);
        break;
      }
      case GALLERY: {
        this.drawingElementManager.drawingElementsOnDrawing.length === ZERO ?
        this.dialog.open(ViewDrawingComponent) :
        this.dialog.open(WarningDialogComponent, {
          data: VIEW_DRAWING,
        });
        break;
      }
      case EXPORT: {
        this.dialog.open(ExportComponent);
        break;
      }
      case TUTORIAL: {
        this.dialog.open(TutorialComponent);
        break;
      }
      default: break;
    }
  }

  shortcutSubscription() {
    this.shortcutService.applyShortcutAccess().subscribe((isEnable: boolean) => {
      this.shortcutEnable = isEnable;
    });
  }

  toolInUseSubscription() {
    this.shortcutService.getToolInUseState().subscribe((isInUse: boolean) => {
      this.isToolInUse = isInUse;
    });
  }

  ngOnInit() {
    this.toolbarService.getWindowToOpen().subscribe((window: string) => {
      switch (window) {
        case CREATE_DRAWING : {
          this.dialog.open(CreateDrawingSceneComponent).afterClosed().subscribe(() =>
          this.toolbarService.sendCreateDrawingIsDone(true));
          break;
        }
        case VIEW_DRAWING : {
          this.dialog.open(ViewDrawingComponent);
          break;
        }
        case EXPORT_DRAWING : {
          this.dialog.open(ExportComponent);
          break;
        }
        default: break;
      }
    });
    this.shortcutSubscription();
    this.toolInUseSubscription();
  }
}
