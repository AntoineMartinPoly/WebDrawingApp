import { Injectable } from '@angular/core';
import { FIFTEEN, TWO } from 'src/constant/constant';
import { DRAWING_WIDTH, MAGNETISM_STATE, OPTION_GRID_SIZE } from 'src/constant/storage/constant';
import { TRUE } from 'src/constant/svg/constant';
import { Point } from 'src/interface/Point';
import { DrawingService } from '../drawing/drawing.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class MagnetismService {

  drawingService: DrawingService;

  constructor(public storage: StorageService) {
    this.drawingService = DrawingService.getInstance();
  }

  updateCoordinate(event: MouseEvent): Point {
    if (this.storage.get(MAGNETISM_STATE) === TRUE) {
    const point: Point = this.drawingService.getRelativeCoordinates({ x: event.x, y: event.y });
    return this.getMagneticCoordinate(point);
    }

    return this.drawingService.getRelativeCoordinates({ x: event.x, y: event.y });
  }

  findClosestCorner(axis: number): number {
    const factor = Number(this.storage.get(OPTION_GRID_SIZE));
    for (let i = 0; i < Number(this.storage.get(DRAWING_WIDTH, true)); i += (factor +  FIFTEEN)) {
      if (axis < i) {
        return axis % (factor + FIFTEEN) < (factor +  FIFTEEN) / TWO ? i - (factor +  FIFTEEN) : i;
      }
    }
    return 0;
  }

  getMagneticCoordinate(point: Point): Point {
    return {
      x: this.findClosestCorner(point.x),
      y: this.findClosestCorner(point.y),
    };
  }

}
