import { Injectable } from '@angular/core';
import { BUCKET } from 'src/constant/svg/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { KeyModifier } from 'src/interface/key-modifier';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../drawing/drawing.service';
import { ShortcutService } from '../../shortcut/shortcut.service';
import { BucketService } from '../../tool-service/bucket/bucket.service';
import { ToolHandler } from '../tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class BucketToolHandlerService extends ToolHandler {
  bucket: DrawingElement;
  isFloodOver: boolean;
  private drawingService: DrawingService;

  constructor(public bucketService: BucketService,
              public drawingElementManager: DrawingElementManagerService,
              public shortcutService: ShortcutService) {
    super();
    this.isFloodOver = true;
    this.handleFloodState();
    this.drawingService = DrawingService.getInstance();
  }

  handleMouseDown(event: MouseEvent, keyModifier: KeyModifier) {
    if (this.isFloodOver) {
      this.bucket = this.bucketService.fill(event, keyModifier);
      this.elementRef = this.bucket.ref;
      this.actionService.addAction(this);
      this.drawingElementManager.appendDrawingElement(this.bucket);
    }
  }
  handleFloodState(): void {
    this.bucketService.getIsFloodOver().subscribe((isOver: boolean) => {
      this.shortcutService.changeShortcutAccess(!isOver, false);
      this.isFloodOver = isOver;
    });
  }
  storeAction() {
    const copy = Object.create(this);
    copy.bucket = this.bucket;
    copy.elementRef = this.elementRef;
    return copy;
  }
  handleUndo() {
    this.bucketService.removeElement(this.bucket);
  }
  handleRedo() {
    this.bucketService.reAddElement(this.bucket);
  }

  handleDrawingLoad() {
    for (const element of this.drawingService.getElementsTable(BUCKET)) {
      const bucket: DrawingElement =
      this.bucketService.createBucketFromSVGElement(element);
      this.drawingElementManager.appendDrawingElement(bucket);
    }
  }

  // tslint:disable-next-line: no-empty
  handleMouseUp(event?: MouseEvent, keyModifier?: KeyModifier) {}
  // tslint:disable-next-line: no-empty
  handleMouseMove(event: MouseEvent, keyModifier?: KeyModifier) {}
  // tslint:disable-next-line: no-empty
  handleMouseLeave() {}
  // tslint:disable-next-line: no-empty
  handleDoubleClick(event: MouseEvent, keyModifier: KeyModifier) {}
  // tslint:disable-next-line: no-empty
  handleMouseWheel(event: MouseEvent, keyModifier: KeyModifier) {}
  // tslint:disable-next-line: no-empty
  handleShortcuts(keyModifier: KeyboardEvent) {}
  // tslint:disable-next-line: no-empty
  handleCurrentToolChange() {}
}
