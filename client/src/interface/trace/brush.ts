import { DrawingElement } from '../drawing-element';

export enum PatternType {
    blur = 'Blur',
    sketch = 'Sketch',
    aerosol = 'Aerosol',
    magic = 'Magic',
    filament = 'Filament',
}

export interface Brush extends DrawingElement {
    path: string;
    thickness: number;
    pattern: PatternType;
    color: string;
}
