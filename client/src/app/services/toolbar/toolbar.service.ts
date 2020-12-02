import { Injectable } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { NewDrawing } from 'src/interface/new-drawing';
import { BucketToolHandlerService } from '../tool-handler/bucket/bucket-tool-handler.service';
import { ColorizerToolHandlerService } from '../tool-handler/colorizer/colorizer-tool-handler.service';
import { PipetteToolHandlerService } from '../tool-handler/pipette/pipette-tool-handler.service';
import { SelectionToolHandlerService } from '../tool-handler/selection/selection-tool-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {

  private openWindow: Subject<string>;
  private updateToolHandler: Subject<void>;
  private newDrawing: Subject<NewDrawing>;
  private updateCursor: Subject<string>;
  private toggleColor: Subject<boolean>;
  private createDrawingIsDone: Subject<boolean>;

  constructor(public colorizer: ColorizerToolHandlerService, public pipette: PipetteToolHandlerService,
              public selection: SelectionToolHandlerService, public bucket: BucketToolHandlerService) {
    this.openWindow = new Subject<string>();
    this.updateToolHandler = new Subject<void>();
    this.newDrawing = new Subject<NewDrawing>();
    this.updateCursor = new Subject<string>();
    this.toggleColor = new Subject<boolean>();
    this.createDrawingIsDone = new Subject<boolean>();
  }

  getColorTabUpdate(): Observable<boolean> {
    return this.toggleColor.asObservable();
  }

  sendColorTabUpdate(doOpenTab: boolean): void {
    this.toggleColor.next(doOpenTab);
  }

  sendCursorUpdate(cursor: string): void {
    this.updateCursor.next(cursor);
  }

  getCursorUpdate(): Observable<string> {
    return this.updateCursor.asObservable();
  }

  sendNewDrawingInfo(info: NewDrawing): void {
    this.newDrawing.next(info);
  }

  getNewDrawingInfo(): Observable<NewDrawing> {
    return this.newDrawing.asObservable();
  }

  sendWindow(window: string): void {
    this.openWindow.next(window);
  }

  getWindowToOpen(): Observable<string> {
    return this.openWindow.asObservable();
  }

  initiateHandlerUpdate(): void {
    this.updateToolHandler.next();
  }

  executeHandlerUpdate(): Observable<void> {
    return this.updateToolHandler.asObservable();
  }

  unFocus(event: MatSelectChange): void {
    event.source.toggle();
  }

  sendCreateDrawingIsDone(drawingIsDone: boolean): void {
    this.createDrawingIsDone.next(drawingIsDone);
  }

  getCreateDrawingIsDone(): Observable<boolean> {
    return this.createDrawingIsDone.asObservable();
  }
}
