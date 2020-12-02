import { DrawingElement } from '../drawing-element';

export interface Pen extends DrawingElement {
  start_point_paths: [{x: number , y: number}];
  path_refs: [];
  path: string;
  thicknessMax: number;
  thicknessMin: number;
  color: string;
}
