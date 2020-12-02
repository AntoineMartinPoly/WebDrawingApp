import { ElementRef } from '@angular/core';
import { DrawingElement } from '../drawing-element';
import { KeyModifier } from '../key-modifier';
import { Point } from '../Point';

export interface LineValues {
    origin: Point;
    endPoint: Point;
}

export interface LineOptions {
    junctionType: string;
    lineThickness: number;
    lineStyle: string;
    pointDiameter: number;
}

export interface Line extends DrawingElement {
    value: LineValues;
    option: LineOptions;
    color: string;
    key: KeyModifier;
    path: string;
    jointRef?: ElementRef;
}
