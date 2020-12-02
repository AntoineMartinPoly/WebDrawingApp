import {DrawingElement} from '../drawing-element';

export interface Spray extends DrawingElement {
  radius: number;
  intervalPeriod: number;
  color: string;
}
