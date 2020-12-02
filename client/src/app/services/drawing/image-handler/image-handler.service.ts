import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AES, enc} from 'crypto-ts';
import { Observable, Subject } from 'rxjs';
import {OPEN_ERROR_MESSAGE, RESPONSE, TEXT} from 'src/constant/drawing/constant';
import {LOCAL_SAVE_SECRET} from '../../../../constant/do/not/open/or/feel/GOD_1/s/fury/this-is-your-final-warning';
import {SVG_FILE_BEGIN} from '../../../../constant/toolbar/view-drawing/constant';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { BucketToolHandlerService } from '../../tool-handler/bucket/bucket-tool-handler.service';
import { EllipseToolHandlerService } from '../../tool-handler/shape/ellipse/ellipse-tool-handler.service';
import { LineToolHandlerService } from '../../tool-handler/shape/line/line-tool-handler.service';
import { PolygonToolHandlerService } from '../../tool-handler/shape/polygon/polygon-tool-handler.service';
import { RectangleToolHandlerService } from '../../tool-handler/shape/rectangle/rectangle-tool-handler.service';
import { StampToolHandlerService } from '../../tool-handler/stamp/stamp-tool-handler.service';
import { TextToolHandlerService } from '../../tool-handler/text/text-tool-handler.service';
import { ToolHandler } from '../../tool-handler/tool-handler.service';
import { BrushToolHandlerService } from '../../tool-handler/trace/brush/brush-tool-handler.service';
import {FeatherToolHandlerService} from '../../tool-handler/trace/feather/feather-tool-handler.service';
import { PenToolHandlerService } from '../../tool-handler/trace/pen/pen-tool-handler.service';
import { PencilToolHandlerService } from '../../tool-handler/trace/pencil/pencil-tool-handler.service';
import { SprayToolHandlerService } from '../../tool-handler/trace/spray/spray-tool-handler.service';
import { DrawingService } from '../drawing.service';
import {OpenError} from './open-error';

@Injectable({
  providedIn: 'root',
})
export class ImageHandlerService {

  drawingService: DrawingService;
  private notifyResetDrawing = new Subject<void>();

  constructor(private http: HttpClient, public rectangleToolHandlerService: RectangleToolHandlerService,
              public pencilToolHandler: PencilToolHandlerService, public brushToolHandler: BrushToolHandlerService,
              public ellipseToolHandler: EllipseToolHandlerService, public polygonToolHandler: PolygonToolHandlerService,
              public penToolHandler: PenToolHandlerService, public stampToolHandler: StampToolHandlerService,
              public textToolHandler: TextToolHandlerService, public lineToolHandler: LineToolHandlerService,
              public drawingElementManager: DrawingElementManagerService,  public featherToolHandler: FeatherToolHandlerService,
              public bucketToolHandler: BucketToolHandlerService, public sprayToolHandler: SprayToolHandlerService) {
    this.drawingService = DrawingService.getInstance();
  }

  getDrawingData(url: string): Observable<any> {
    return this.http.get(url, {observe: RESPONSE, responseType: TEXT});
  }

  sendResetDrawingNotification() {
    this.notifyResetDrawing.next();
  }

  getResetDrawingNotification(): Observable<void> {
    return this.notifyResetDrawing.asObservable();
  }

  openDrawing(html: string): void {
    this.drawingElementManager.drawingElementsOnDrawing = [];
    this.setSVGSize(html);
    this.createObjectReferences();
    this.sendResetDrawingNotification();
  }

  openProprietaryDrawing(encryptedDrawing: string): void {
    const decryptedDrawing = AES.decrypt(encryptedDrawing, LOCAL_SAVE_SECRET).toString(enc.Utf8);
    if (!decryptedDrawing.startsWith(SVG_FILE_BEGIN)) {
      throw new OpenError(OPEN_ERROR_MESSAGE);
    }
    this.openDrawing(decryptedDrawing);
  }

  setSVGSize(html: string) {
    this.drawingService.setNewDrawing(html);
    this.drawingService.setNewDrawingSize();
  }

  createObjectReferences() {
    const currentTool: any = ToolHandler.currentToolType;
    const toolTypeList: any[] = [
      this.rectangleToolHandlerService, this.pencilToolHandler, this.brushToolHandler, this.ellipseToolHandler,
      this.polygonToolHandler, this.penToolHandler, this.stampToolHandler, this.textToolHandler, this.lineToolHandler,
      this.featherToolHandler, this.bucketToolHandler, this.sprayToolHandler,
    ];
    for (const tool of toolTypeList) {
      ToolHandler.currentToolType = tool;
      ToolHandler.currentToolType.handleDrawingLoad();
    }
    ToolHandler.currentToolType = currentTool;
  }
}
