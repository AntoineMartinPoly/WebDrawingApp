import { IdTag } from 'src/interface/id-tag';
import { Point } from 'src/interface/Point';

export const DEFAULT_POINT: Point = {x: 0, y: 0};
export const TEST_POINT: Point = {x: 10, y: 7};

export const BACKSPACE = 'Backspace';
export const ESCAPE = 'Escape';
export const TRANSFORM = 'transform';
export const SCALE = 'scale';
export const TRANSLATE = 'translate';
export const MATRIX = 'matrix';

export const FAKE_ID_TAG_TABLE: IdTag[] = [
    {
        _id: '177',
        name: 'bob',
        tags: ['a', 'b', 'c'],
    },
    {
        _id: '333',
        name: 'joe',
        tags: [],
    },
];

export const FAKE_URL = 'www.thatAnImage.com';
export const DEFAULT_ROTATION_DEGREE = 15;
export const REDUCED_ROTATION_DEGREE = 1;
export const SELECTION_DASHARRAY = '5';
export const SELECTION_ELLIPSE_RADIUS = 7;
export const SELECTION_ELLIPSE_TOP_LEFT_INDEX = 0;
export const SELECTION_ELLIPSE_TOP_INDEX = 1;
export const SELECTION_ELLIPSE_TOP_RIGHT_INDEX = 2;
export const SELECTION_ELLIPSE_RIGHT_INDEX = 3;
export const SELECTION_ELLIPSE_BOTTOM_RIGHT_INDEX = 4;
export const SELECTION_ELLIPSE_BOTTOM_INDEX = 5;
export const SELECTION_ELLIPSE_BOTTOM_LEFT_INDEX = 6;
export const SELECTION_ELLIPSE_LEFT_INDEX = 7;
export const NUMBER_OF_SELECTION_ELLIPSE = 8;
export enum ResizeState {
    top,
    topRight,
    right,
    bottomRight,
    bottom,
    bottomLeft,
    left,
    topLeft,
    none,
  }
