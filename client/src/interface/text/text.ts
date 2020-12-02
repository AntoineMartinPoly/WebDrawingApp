
import {MockElementRef} from '../../constant/constant';
import {DrawingElement} from '../drawing-element';
import {Point} from '../Point';

export interface Text extends DrawingElement {
  originPoint: Point;
  policySize: number;
}

export const FAKE_TEXT = {
  ref: new MockElementRef(),
  originPoint: {x: 10, y: 7},
  policySize: 16,
};

export enum TextState {
  deSelected = 'DESEL',
  selected = 'SEL',
  writing = 'WRITE',
}
