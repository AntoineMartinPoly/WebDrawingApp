import { MockElementRef } from 'src/constant/constant';
import { Rectangle, RectangleValues } from 'src/interface/shape/rectangle';

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
