import { HardShapeColors } from '../colors';
import { DrawingElement } from '../drawing-element';
import { Point } from '../Point';

export interface PolygonOptions {
    traceType: string;
    contourThickness: number;
    nbOfSides: number;
}

export interface Polygon extends DrawingElement {
    origin: Point;
    points: string;
    option: PolygonOptions;
    color: HardShapeColors;
}
