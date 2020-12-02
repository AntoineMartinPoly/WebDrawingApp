import { ElementRef, Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { FIFTEEN } from 'src/constant/constant';
import { OPACITY } from 'src/constant/drawing/constant';
import { DRAWING_HEIGHT, DRAWING_WIDTH, OPTION_GRID_OPACITY, OPTION_GRID_SIZE, SESSION_STORAGE, } from 'src/constant/storage/constant';
import { BLACK, DEFAULT_VALUE, ID, LINE, STROKE, SVG, X1, X2, Y1, Y2, ZERO } from 'src/constant/svg/constant';
import { DrawingService } from '../drawing/drawing.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GridService {

  drawingService: DrawingService;
  gridRef: ElementRef;
  verticalLinesRef: ElementRef;
  horizontalLinesRef: ElementRef;
  private gridSize = new Subject<number>();
  private gridOpacity = new Subject<number>();

  constructor(public storage: StorageService) {
    this.drawingService = DrawingService.getInstance();
  }

  linesGenerator(size: number, height: string, Width: string): any {
    this.gridRef = this.drawingService.generateSVGElement(SVG);
    for (let i = DEFAULT_VALUE; i < + height; i = i + size) {
      this.verticalLinesRef = this.drawingService.generateSVGElement(LINE);
      this.drawingService.setSVGattribute(this.verticalLinesRef, X1, ZERO);
      this.drawingService.setSVGattribute(this.verticalLinesRef, Y1, i.toString());
      this.drawingService.setSVGattribute(this.verticalLinesRef, X2, Width);
      this.drawingService.setSVGattribute(this.verticalLinesRef, Y2, i.toString());
      this.drawingService.setSVGattribute(this.verticalLinesRef, STROKE, BLACK);
      this.drawingService.addSVGToSVG(this.verticalLinesRef, this.gridRef);
    }
    for (let j = 0; j < + Width; j = j + size) {
      this.horizontalLinesRef = this.drawingService.generateSVGElement(LINE);
      this.drawingService.setSVGattribute(
        this.horizontalLinesRef,
        X1,
        j.toString(),
      );
      this.drawingService.setSVGattribute(this.horizontalLinesRef, Y1, ZERO);
      this.drawingService.setSVGattribute(
        this.horizontalLinesRef,
        X2,
        j.toString(),
      );
      this.drawingService.setSVGattribute(this.horizontalLinesRef, Y2, height);
      this.drawingService.setSVGattribute(this.horizontalLinesRef, STROKE, BLACK);
      this.drawingService.addSVGToSVG(this.horizontalLinesRef, this.gridRef);
      this.drawingService.addSVGElementFromRef(this.gridRef);
    }
    return this.gridRef;
  }

  generateGrid() {
    this.gridRef = this.linesGenerator(
      Number(this.storage.get(OPTION_GRID_SIZE)),
      this.storage.get(DRAWING_HEIGHT, SESSION_STORAGE),
      this.storage.get(DRAWING_WIDTH, SESSION_STORAGE),
    );
    this.drawingService.setSVGattribute(this.gridRef, ID, 'gridRef');
  }

  toggleGrid(isShown: boolean) {
    if (isShown && this.gridRef ) {
      this.drawingService.addSVGElementFromRef(this.gridRef);
    } else if ( this.gridRef ) {
      this.drawingService.removeSVGElementFromRef(this.gridRef);
    }
  }

  updateSize() {
    this.drawingService.removeSVGElementFromRef(this.gridRef);
    this.gridRef = this.linesGenerator(
      Number(this.storage.get(OPTION_GRID_SIZE)) + FIFTEEN,
      this.storage.get(DRAWING_HEIGHT, SESSION_STORAGE),
      this.storage.get(DRAWING_WIDTH, SESSION_STORAGE),
    );
  }

  updateOpacity(opacity: number = Number(this.storage.get(OPTION_GRID_OPACITY))) {
    this.drawingService.setSVGattribute(this.gridRef, OPACITY, opacity.toString());
  }

  sendGridsize(size: number) {
    this.gridSize.next(size);
  }

  getGridsize(): Observable<number> {
    return this.gridSize.asObservable();
  }

  sendGridOpacity(opacity: number) {
    this.gridOpacity.next(opacity);
  }

  getGridOpacity(): Observable<number> {
    return this.gridOpacity.asObservable();
  }

}
