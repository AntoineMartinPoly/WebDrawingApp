import { DrawingElement } from '../drawing-element';

export interface Pencil extends DrawingElement {
    path: string;
    thickness: number;
    color: string;
}
