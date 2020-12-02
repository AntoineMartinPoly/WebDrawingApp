
import { ElementRef } from '@angular/core';
import { MockElementRef } from 'src/constant/constant';
import { Line, LineOptions } from 'src/interface/shape/line';

export const SHAPES: string[] = ['Rectangle', 'Ellipse', 'Polygon', 'Line'];
export const CONTOUR = 'Contour';
export const FULL = 'Full';
export const FULL_WITH_CONTOUR = 'Full with contour';

export const SHAPE_TABLE: string[] = ['shape_rectangle', 'shape_ellipse', 'shape_polygon', 'shape_line'];

export const SHAPE_SETUP = 'shape_setup';
export const SHAPE_IS_SETUP = 'true';
export const SHAPE_IS_NOT_SETUP = 'false';
export const NO_OPTION_SELECTED = 'none';

export const DEFAULT_TRACE_VALUE = CONTOUR;
export const DEFAULT_CONTOUR_VALUE = '2';
export const DEFAULT_NB_OF_SIDES = 5;

export const STROKE_DASH_ARRAY_ATTRIBUTES_INDEX = 4;
export const STROKE_LINECAP_ATTRIBUTES_INDEX = 5;
export const ROUNDED = 'Rounded';
export const ANGLED = 'Angled';
export const POINT = 'Point';
export const CONTINUOUS = 'Continuous';
export const DOTED_WITH_POINTS = 'Doted with points';
export const DOTED_WITH_LINE = 'Doted with lines';
export const PIXEL_DISTANCE_FROM_POINT = 10;
export const LINE_THICKNESS_DIVIDER = 6.25;

export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;

export const FAKE_POINT = {x: 0, y: 0};
export const FAKE_POINT_ONE = {x: 0, y: 0};
export const FAKE_POINT_TWO = {x: 1, y: 1};
export const FAKE_TABLE = [ FAKE_POINT_ONE, FAKE_POINT_TWO];

export const FAKE_LINE_OPTIONS: LineOptions = {
  junctionType: POINT,
  lineThickness: 5,
  lineStyle: CONTINUOUS,
  pointDiameter: 7,
};

export const FAKE_LINE: Line = {
  ref: {attributes: ['', '', '', '', '', '', ''], nativeElement: {}} as ElementRef,
  value: {origin: FAKE_POINT, endPoint: FAKE_POINT},
  color: '#000000FF',
  key: {},
  option: FAKE_LINE_OPTIONS,
  path: 'asd',
  jointRef: new MockElementRef(),
};

export const ONE_TIME = 1;
export const TWO_TIMES = 2;
export const FIVE_TIMES = 5;
export const SEVEN_TIMES = 7;
export const THREE_TIMES = 3;
export const FOUR_TIMES = 4;
export const HUNDRED_FIFTY_FIVE_TIMES = 155;
export const THIRTY_TIMES = 30;
export const RAYON = 17.67766952966369;

export const CONTOUR_OPTIONS: string[] = [CONTOUR, FULL, FULL_WITH_CONTOUR];

export const POLYGON_ANGLE_OFFSET = 1 / 4;
