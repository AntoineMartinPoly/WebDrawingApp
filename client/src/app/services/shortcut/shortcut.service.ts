import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DECIMAL, ONE, THREE } from 'src/constant/constant';
import { MAGNETISM_STATE, OPTION_GRID_SHOWN, SHAPE_SELECTED, TRACE_SELECTED } from 'src/constant/storage/constant';
import { FALSE, TRUE } from 'src/constant/svg/constant';
import { SHAPE_COMPONENT, TRACE_COMPONENT } from 'src/constant/toolbar/constant';
import { HIDDEN, TOGGLE_COLOR_PICKER, TOGGLE_GRID, TOGGLE_MAGNETISM, VISIBLE } from 'src/constant/toolbar/grid/constant';
import { SHAPE_TABLE } from 'src/constant/toolbar/shape/constant';
import { gridOptionShortcut, optionShortcut, Shortcut, toolShortcut, traceShortcut } from 'src/interface/shortcut';
import { GridService } from '../grid/grid.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ShortcutService {

  private handleShortcut: Subject<Shortcut>;
  private shortcutAccess: Subject<boolean>;
  private toolInUse: Subject<boolean>;
  private gridOptionUpadte: Subject<number>;

  constructor(public storage: StorageService, public gridService: GridService) {
    this.handleShortcut = new Subject<Shortcut>();
    this.shortcutAccess = new Subject<boolean>();
    this.toolInUse = new Subject<boolean>();
    this.gridOptionUpadte = new Subject<number>();
  }

  getGridOption(): Observable<number> {
    return this.gridOptionUpadte.asObservable();
  }

  sendGridOption(option: number): void {
    this.gridOptionUpadte.next(option);
  }

  createShortcutObject(event: KeyboardEvent): Shortcut {
    return {
      key: event.key,
      isCtrl: event.ctrlKey,
    };
  }

  giveToolShortcut(shortcut: Shortcut): number | undefined {
    if (Number(shortcut.key)) {
      return  parseInt(shortcut.key, DECIMAL) <= THREE ? ONE : undefined;
    } else if (Number(shortcut.key) === 0) {
      return undefined;
    }

    return toolShortcut[shortcut.key as keyof typeof toolShortcut];
  }

  handleToolShortcut(shortcut: Shortcut, index: number) {
    switch (index) {
      case TRACE_COMPONENT : {
        this.handleTraceShortcut(shortcut);
        break;
      }
      case SHAPE_COMPONENT : {
        this.handleShapeShortcut(shortcut);
        break;
      }
      default: break;
    }
  }

  handleTraceShortcut(shortcut: Shortcut, isFromToolbar: boolean = true): string | void {
    const traceTool: string = traceShortcut[shortcut.key as keyof typeof traceShortcut];
    if (traceTool && isFromToolbar) {
      this.storage.set(TRACE_SELECTED, traceTool);

      return;
    }

    return traceTool;
  }

  isGridShortcut(shortcut: Shortcut): boolean {
    return gridOptionShortcut[shortcut.key as keyof typeof gridOptionShortcut] === 0
    || gridOptionShortcut[shortcut.key as keyof typeof gridOptionShortcut] === 1
    || gridOptionShortcut[shortcut.key as keyof typeof gridOptionShortcut] === 2;
  }

  handleGridShortcut(shortcut: Shortcut): void {
    const option: number = gridOptionShortcut[shortcut.key as keyof typeof gridOptionShortcut];
    switch (option) {
      case TOGGLE_COLOR_PICKER : {
        this.sendGridOption(TOGGLE_COLOR_PICKER);
        break;
      }
      case TOGGLE_GRID : {
        const isGridOn: boolean = this.storage.get(OPTION_GRID_SHOWN) === HIDDEN;
        this.storage.set(OPTION_GRID_SHOWN,
          isGridOn ? VISIBLE : HIDDEN);
        this.gridService.toggleGrid(isGridOn);
        this.sendGridOption(TOGGLE_GRID);
        break;
      }
      case TOGGLE_MAGNETISM : {
        const isMagnetismOn = this.storage.get(MAGNETISM_STATE) === FALSE;
        this.storage.set(MAGNETISM_STATE,
        isMagnetismOn ? TRUE : FALSE);
        this.sendGridOption(TOGGLE_MAGNETISM);
        break;
      }
      default: break;
    }
  }

  getShapeRequested(shortcut: Shortcut): string {
    return Number(shortcut.key) ? SHAPE_TABLE[parseInt(shortcut.key, DECIMAL) - ONE] : SHAPE_TABLE[THREE];
  }

  handleShapeShortcut(shortcut: Shortcut, isFromToolbar: boolean = true): string | void {
    const shapeTool: string = this.getShapeRequested(shortcut);
    if (shapeTool && isFromToolbar) {
      this.storage.set(SHAPE_SELECTED, shapeTool);

      return;
    }

    return shapeTool;
  }

  giveOptionShortcut(shortcut: Shortcut): number {
    return optionShortcut[shortcut.key as keyof typeof optionShortcut];
  }

  sendShortcut(shortcut: Shortcut): void {
    this.handleShortcut.next(shortcut);
  }

  getShortcut(): Observable<Shortcut> {
    return this.handleShortcut.asObservable();
  }

  changeShortcutAccess(isEnable: boolean, isFromToolbar: boolean = true): void {
    isFromToolbar ? this.shortcutAccess.next(isEnable) :
    this.toolInUse.next(isEnable);
  }

  applyShortcutAccess(): Observable<boolean> {
    return this.shortcutAccess.asObservable();
  }

  getToolInUseState(): Observable<boolean> {
    return this.toolInUse.asObservable();
  }
}
