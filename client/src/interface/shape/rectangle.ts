import { HardShapeColors } from '../colors';
import { DrawingElement } from '../drawing-element';
import { KeyModifier } from '../key-modifier';
import { Point } from '../Point';

export interface RectangleValues {
    origin: Point;
    height: number;
    width: number;
}

export interface RectangleOptions {
    traceType: string;
    contourThickness: number;
}

export interface Rectangle extends DrawingElement {
    value: RectangleValues;
    option: RectangleOptions;
    color: HardShapeColors;
    key: KeyModifier;
}
