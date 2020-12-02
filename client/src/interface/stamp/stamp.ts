import { DrawingElement } from '../drawing-element';
import { Point } from '../Point';

export enum StampType {
    Chrome = 'Chrome',
    Sonic = 'Sonic',
    GOD_1 = 'GOD_1',
    GOD_2 = 'GOD_2',
    Deer = 'Deer',
    None = 'None',
}

export interface Stamp extends DrawingElement {
    origin: Point;
    height: number;
    width: number;
    link: string;
    scale: number;
    rotate: number;
}
