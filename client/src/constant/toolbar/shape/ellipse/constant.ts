import { DECIMAL, MockElementRef } from 'src/constant/constant';
import { HardShapeColors } from 'src/interface/colors';
import { KeyModifier } from 'src/interface/key-modifier';
import { Ellipse, EllipseOptions, EllispeParams } from 'src/interface/shape/ellipse';
import { DEFAULT_CONTOUR_VALUE, DEFAULT_TRACE_VALUE } from '../constant';

export const FAKE_ELLIPSE_OPTION: EllipseOptions = {
    traceType: DEFAULT_TRACE_VALUE,
    contourThickness: parseInt(DEFAULT_CONTOUR_VALUE, DECIMAL),
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
