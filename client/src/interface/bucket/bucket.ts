import { DrawingElement } from '../drawing-element';
import { Point } from '../Point';

export interface Column {
  top: Point;
  bottom: Point;
}

export enum Side {
  left,
  right,
}

export interface Bucket extends DrawingElement {
  isBucket: boolean;
}
