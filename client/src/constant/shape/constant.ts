
import { ElementRef } from '@angular/core';
import { HardShapeColors } from 'src/interface/colors';
import { KeyModifier } from 'src/interface/key-modifier';
import { Ellipse, EllipseOptions, EllispeParams } from 'src/interface/shape/ellipse';
import { Line, LineOptions } from 'src/interface/shape/line';
import { Polygon } from 'src/interface/shape/polygon';
import { Rectangle, RectangleValues } from 'src/interface/shape/rectangle';
import { PolygonOptions } from 'src/interface/shape/ShapeOptions';
import {Feather} from '../../interface/trace/feather';
import {WHITE} from '../svg/constant';

export class MockElementRef {
  nativeElement: {};
  getBoundingClientRect() {
    return 'abc';
  }
}

export const SHAPES: string[] = ['Rectangle', 'Ellipse', 'Polygon', 'Line'];
export const CONTOUR_OPTIONS: string[] = ['Contour', 'Full', 'Full with contour'];
export const CONTOUR = 'Contour';
export const FULL = 'Full';
export const FULL_WITH_CONTOUR = 'Full with contour';

export const SHAPE_SELECTED = 'shape_selected';
export const RECTANGLE = 'shape_rectangle';
export const ELLIPSE = 'shape_ellipse';
export const POLYGON = 'shape_polygon';
export const LINE = 'shape_line';
export const SHAPE_TABLE: string[] = [RECTANGLE, ELLIPSE, POLYGON, LINE];

export const SHAPE_SETUP = 'shape_setup';
export const SHAPE_IS_SETUP = 'true';
export const SHAPE_IS_NOT_SETUP = 'false';
export const NO_OPTION_SELECTED = 'none';

export const DEFAULT_TRACE_VALUE = 'Contour';
export const DEFAULT_CONTOUR_VALUE = '2';
export const DEFAULT_NB_OF_SIDES = 5;

export const RECTANGLE_OPTION_TRACE = 'shape_rectangle_option_trace';
export const RECTANGLE_OPTION_CONTOUR = 'shape_rectangle_option_contour';
export const RECTANGLE_OPTIONS: string[] = [RECTANGLE_OPTION_TRACE, RECTANGLE_OPTION_CONTOUR];

export const LINE_OPTION_JUNCTION = 'shape_line_option_junction';
export const LINE_OPTION_THICKNESS = 'shape_line_option_thickness';
export const LINE_OPTION_DIAMETER = 'shape_line_option_diameter';
export const LINE_OPTION_STYLE = 'shape_line_option_style';
export const LINE_OPTION_STYLES: string[] = ['Continuous', 'Doted with lines', 'Doted with points'];
export const LINE_OPTION_JUNCTIONS: string[] = ['Point', 'Rounded', 'Angled'];
export const LINE_OPTIONS: string[] = [LINE_OPTION_JUNCTION, LINE_OPTION_THICKNESS, LINE_OPTION_DIAMETER, LINE_OPTION_STYLE];
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

export const ELLIPSE_OPTION_TRACE = 'shape_ellipse_option_trace';
export const ELLIPSE_OPTION_CONTOUR = 'shape_ellipse_option_contour';
export const ELLIPSE_OPTIONS: string[] = [ELLIPSE_OPTION_TRACE, ELLIPSE_OPTION_CONTOUR];
export const BASE_TEN = 10;
export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;

export const FAKE_DIMENSION = {width: 50, height: 15};
export const FAKE_POINT = {x: 0, y: 0};
export const FAKE_POINT_ONE = {x: 0, y: 0};
export const FAKE_POINT_TWO = {x: 1, y: 1};
export const FAKE_TABLE = [ FAKE_POINT_ONE, FAKE_POINT_TWO];

export const FAKE_RECTANGLE: Rectangle = {
    ref: new MockElementRef(),
    value: {
      origin: {
        x: 3,
        y: 6,
      },
      height: 100,
      width: 200,
    },
    option: {
        traceType: '',
        contourThickness: 2,
    },
    color: {
      fill: 'black',
      contour: 'blue',
    },
    key: {
      shift: false,
    },
  };

export const FAKE_RECTANGLE_VALUE: RectangleValues = {
  origin: {
    x: 0,
    y: 0,
  },
  height: 0,
  width: 0,
};

export const FAKE_ELLIPSE_OPTION: EllipseOptions = {
  traceType: DEFAULT_TRACE_VALUE,
  contourThickness: parseInt(DEFAULT_CONTOUR_VALUE, BASE_TEN),
};

export const FAKE_ELLIPSE_PARAMS: EllispeParams = {
  origin: {x: 0, y: 0},
  horizontalRadius: 0,
  verticalRadius: 0,
  horizontalCenter: 0,
  verticalCenter: 0,
};
export const FAKE_ELLIPSE_HARDSHAPECOL: HardShapeColors = {
  fill: 'rgba(255,255,0,255)',
  contour: 'rgba(0,255,255,123)',
};

export const FAKE_ELLIPSE_KEYMODIFER: KeyModifier = {
  shift: false,
};

export const FAKE_ELLIPSE: Ellipse = {
  param: FAKE_ELLIPSE_PARAMS,
  option: FAKE_ELLIPSE_OPTION,
  color: FAKE_ELLIPSE_HARDSHAPECOL,
  key: FAKE_ELLIPSE_KEYMODIFER,
  ref: new MockElementRef(),
};

export  const  FAKE_FEATHER: Feather = {
  ref: new MockElementRef(),
  Path: 'M 0 0',
  color: WHITE,
};
export const FAKE_POLYGON_OPTION: PolygonOptions = {
  traceType: DEFAULT_TRACE_VALUE,
  contourThickness: parseInt(DEFAULT_CONTOUR_VALUE, BASE_TEN),
  nbOfSides: DEFAULT_NB_OF_SIDES,
};

export const FAKE_POLYGON: Polygon = {
  ref: new MockElementRef(),
  points: '',
  origin: {
    x: 0,
    y: 0,
  },
  option: {
      traceType: '',
      contourThickness: 2,
      nbOfSides: 2,
  },
  color: {
    fill: 'black',
    contour: 'black',
  },
};

export const FAKE_LINE_OPTIONS: LineOptions = {
  junctionType: 'Point',
  lineThickness: 5,
  lineStyle: 'Continuous',
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

export const SELECTION_RECT_FILL_COLOR = '#9cb5fe3c';
export const SELECTION_RECT_CONT_COLOR = '#5b9adfff';
export const UNDEFINED_SELECTION_VALUE = {origin: {x: -1, y: -1}, width: 0, height: 0} as RectangleValues;
export const UNDEFINED_SELECTION_RECTANGLE = {ref: {children: []}} as Rectangle;

export const ONE_HUNDRED_EIGHTY = 180;
