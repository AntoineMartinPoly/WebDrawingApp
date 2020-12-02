import { HardShapeColors } from '../colors';
import { DrawingElement } from '../drawing-element';
import { KeyModifier } from '../key-modifier';
import { Point } from '../Point';

export interface EllipseOptions {
    traceType: string;
    contourThickness: number;
}

export interface EllispeParams {
    origin: Point;
    horizontalRadius: number;
    verticalRadius: number;
    horizontalCenter: number;
    verticalCenter: number;
}

export interface Ellipse extends DrawingElement {
    param: EllispeParams;
    option: EllipseOptions;
    color: HardShapeColors;
    key: KeyModifier;
}
