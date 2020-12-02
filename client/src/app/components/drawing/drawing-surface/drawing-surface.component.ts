import { AfterViewInit, Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ActionService } from 'src/app/services/actions/action.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ImageHandlerService } from 'src/app/services/drawing/image-handler/image-handler.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { PencilToolHandlerService } from 'src/app/services/tool-handler/trace/pencil/pencil-tool-handler.service';
import { SaveService } from 'src/app/services/tool-service/save/save.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { NO_VALUE } from 'src/constant/constant';
import { STAMP_OPTION_IMAGE } from 'src/constant/stamp/constant';
import { DISABLE, MAGNETISM_STATE, OPTION_GRID_SHOWN } from 'src/constant/storage/constant';
import { LEFT_KEY, RIGHT_KEY } from 'src/constant/toolbar/constant';
import { HIDDEN, TOGGLE_GRID } from 'src/constant/toolbar/grid/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { NewDrawing } from 'src/interface/new-drawing';

@Component({
  selector: 'app-drawing-surface',
  templateUrl: './drawing-surface.component.html',
  styleUrls: ['./drawing-surface.component.scss'],
})
export class DrawingSurfaceComponent implements AfterViewInit {

  dimensions: any;
  visibility: string;
  size: number;
  opacity: number;
  svg: SVGElement;
  grid: SVGElement;
  currentToolElement: any;
  mouseDown: boolean;
  isEmpty: boolean;

  draw: DrawingService; // singleton

  constructor(public renderer: Renderer2, private container: ElementRef,
              public storage: StorageService, public toolHandler: ToolHandler,
              public save: SaveService,
              public gridGenerator: GridService, public imageHandler: ImageHandlerService,
              public toolbarService: ToolbarService, public pencilService: PencilToolHandlerService,
              public actionService: ActionService, public shortcutService: ShortcutService) {
    this.mouseDown = false;
    this.isEmpty = true;
    this.draw = DrawingService.getInstance();
    DrawingService.init(this.renderer, this.container);
  }

  @HostListener('contextmenu', ['$event']) disableRightClick(event: Event) {
    event.preventDefault();
  }

  @HostListener('window:beforeunload', ['$event']) beforeUnload() {
    this.storage.set(MAGNETISM_STATE, DISABLE);
    this.storage.set(OPTION_GRID_SHOWN, HIDDEN);
  }

  ngAfterViewInit() {
    this.svg = this.draw.generateBackground();
    this.resizeDrawSurface();
    this.updateCurrentToolHandler();
    this.addAllListeners();
    this.gridGenerator.generateGrid();
    this.gridGenerator.updateSize();
    this.gridGenerator.toggleGrid(false);
    this.storage.delete(STAMP_OPTION_IMAGE);
    this.actionService.clearActions();
  }

  updateCurrentToolHandler() {
    ToolHandler.currentToolType = this.pencilService;
    this.toolHandler = ToolHandler.currentToolType;
    this.toolbarService.executeHandlerUpdate().subscribe(() => {
      this.toolHandler.handleCurrentToolChange();
      this.toolHandler = ToolHandler.currentToolType;
      this.toolHandler.actionService = this.actionService;
    });
    this.toolbarService.initiateHandlerUpdate();
  }

  generateKeyModifierObject(event: MouseEvent): KeyModifier {
    return {
      shift: event.shiftKey,
      leftKey: (event.button ===  LEFT_KEY),
      rightKey: (event.button ===  RIGHT_KEY),
      altKey: event.altKey,
    };
  }

  mouseDownListener(): void {
    this.renderer.listen(this.svg, 'mousedown', ($event: MouseEvent) => {
      const keyModifier: KeyModifier = this.generateKeyModifierObject($event);
      this.toolHandler.handleMouseDown($event, keyModifier);
    });
  }

  mouseMoveListener(): void {
    this.renderer.listen(this.svg, 'mousemove', ($event: MouseEvent) => {
      const keyModifier: KeyModifier = this.generateKeyModifierObject($event);
      this.toolHandler.handleMouseMove($event, keyModifier);
    });
  }

  mouseUpListener(): void {
    this.renderer.listen(this.svg, 'mouseup', ($event: MouseEvent) => {
      const keyModifier: KeyModifier = this.generateKeyModifierObject($event);
      this.toolHandler.handleMouseUp($event, keyModifier);
    });
  }

  mouseLeaveListener(): void {
    this.renderer.listen(this.svg, 'mouseleave', () => {
      this.toolHandler.handleMouseLeave();
    });
  }

  mouseDoubleClickListener(): void {
    this.renderer.listen(this.svg, 'dblclick', ($event: MouseEvent) => {
      const keyModifier: KeyModifier = this.generateKeyModifierObject($event);
      this.toolHandler.handleDoubleClick($event, keyModifier);
    });
  }

  mouseWheelListener(): void {
    this.renderer.listen(this.svg, 'wheel', ($event: WheelEvent) => {
      const keyModifier: KeyModifier = this.generateKeyModifierObject($event);
      keyModifier.wheelUp = $event.deltaY > 0;
      this.toolHandler.handleMouseWheel($event, keyModifier);
    });
  }

  keypressListener(): void {
    this.renderer.listen('document', 'keydown', ($event: KeyboardEvent) => {
      this.toolHandler.handleKeypress($event);
    });
  }

  newDrawingListener(): void {
    this.imageHandler.getResetDrawingNotification().subscribe(() => {
      this.actionService.clearActions();
    });
  }

  addAllListeners(): void {
    this.mouseDownListener();
    this.mouseMoveListener();
    this.mouseUpListener();
    this.mouseLeaveListener();
    this.mouseDoubleClickListener();
    this.mouseWheelListener();
    this.keypressListener();
    this.newDrawingListener();
  }

  removeAllObjectsFromSurface(): void {
    this.svg.innerHTML = NO_VALUE;
  }

  resizeDrawSurface() {
    this.isEmpty = true;
    this.toolbarService.getNewDrawingInfo().subscribe((info: NewDrawing) => {
      this.actionService.clearActions();
      this.removeAllObjectsFromSurface();
      // this.gridGenerator.generateGrid();
      // this.gridGenerator.updateSize();
      this.svg = this.draw.setSVG(info.height.toString(), info.width.toString(), info.color);
      this.renderer.appendChild(this.svg, this.gridGenerator.gridRef);
      this.renderer.appendChild(this.container.nativeElement, this.svg);
      this.storage.set(OPTION_GRID_SHOWN, HIDDEN);
      this.gridGenerator.toggleGrid(false);
      this.shortcutService.sendGridOption(TOGGLE_GRID);
    });
  }
}
