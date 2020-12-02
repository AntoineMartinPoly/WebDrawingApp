import { BASE_TEN } from 'src/constant/color-picker/constant';
import { MockElementRef } from 'src/constant/constant';
import { Polygon, PolygonOptions } from 'src/interface/shape/polygon';
import { DEFAULT_CONTOUR_VALUE, DEFAULT_NB_OF_SIDES, DEFAULT_TRACE_VALUE } from '../constant';

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
