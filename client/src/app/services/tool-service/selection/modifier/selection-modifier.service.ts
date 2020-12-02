import { ElementRef, Injectable } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ZERO } from 'src/constant/constant';
import { TRANSFORM } from 'src/constant/svg/constant';
import { DrawingElement } from 'src/interface/drawing-element';

@Injectable({
  providedIn: 'root',
})
export class SelectionModifierService {

  drawingService: DrawingService;
    initialTransformValues: string[];
    transformIterator: number;

    constructor() {
        this.drawingService = DrawingService.getInstance();
        this.initialTransformValues = [];
        this.transformIterator = ZERO;
    }

    getTransformationsFromDrawingElement(drawingElement: DrawingElement): string {
        return this.drawingService.getAttributeValueFromSVG(drawingElement.ref, TRANSFORM);
    }

    setTransformAttribute(ref: ElementRef, translateValue?: string): void {
        this.drawingService.setSVGattribute(ref, TRANSFORM, translateValue ? translateValue : '');
    }

    resetFirstAction(): void {
        this.initialTransformValues = [];
        this.transformIterator = ZERO;
        this.resetAdditionnalAttribute();
    }

    resetAdditionnalAttribute(): void {
        // Template Method
    }
}
