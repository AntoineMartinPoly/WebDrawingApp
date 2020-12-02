import { Injectable, } from '@angular/core';
import { NO_VALUE, PRIMARY_COLOR, SECONDARY_COLOR } from 'src/constant/constant';
import {
  BRUSH, BUCKET, DATA_TYPE, ELLIPSE, FEATHER, FILL, LINE, PEN, PENCIL, POLYGON, RECTANGLE, SPRAY, STROKE
} from 'src/constant/svg/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { DrawingService } from '../../drawing/drawing.service';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ColorizerService {

  drawingService: DrawingService;

  constructor(public storage: StorageService) {
    this.drawingService = DrawingService.getInstance();
  }

  colorize(SVGelementRef: any, keyModifier: KeyModifier, newColor: string = NO_VALUE) {
    const elementDataType = this.drawingService.getAttributeValueFromSVG(SVGelementRef, DATA_TYPE);
    if (elementDataType === RECTANGLE || elementDataType === POLYGON || elementDataType === ELLIPSE) {
      return this.colorizeShape(SVGelementRef, keyModifier, newColor);
    } else if (elementDataType === BUCKET || elementDataType === PENCIL ||
       elementDataType === BRUSH || elementDataType === PEN || elementDataType === LINE) {
      return this.colorizeTrace(SVGelementRef, keyModifier, newColor);
    } else if ( elementDataType === FEATHER ) {
      return this.colorizeFeather(SVGelementRef, keyModifier, newColor);
    } else if ( elementDataType === SPRAY ) {
      return this.colorizeSpray(SVGelementRef, keyModifier, newColor);
    }
    return '';
  }

  colorizeShape(objectRef: any, keyModifier: KeyModifier, newColor: string = NO_VALUE) {
    if (keyModifier.leftKey) {
      if (!newColor) {
        newColor = this.storage.get(PRIMARY_COLOR);
      }
      this.drawingService.setSVGattribute(objectRef, FILL, newColor);
    }
    if (keyModifier.rightKey) {
      if (!newColor) {
        newColor = this.storage.get(SECONDARY_COLOR);
      }
      this.drawingService.setSVGattribute(objectRef, STROKE, newColor);
    }
    return newColor;
  }

  colorizeTrace(objectRef: any, keyModifier: KeyModifier, newColor: string = NO_VALUE) {
    if (keyModifier.leftKey) {
      if (!newColor) {
        newColor = this.storage.get(PRIMARY_COLOR);
      }
      this.drawingService.setSVGattribute(objectRef, STROKE, newColor);
      objectRef.color = newColor;
    }
    if (keyModifier.rightKey) {
      if (!newColor) {
        newColor = this.storage.get(SECONDARY_COLOR);
      }
      this.drawingService.setSVGattribute(objectRef, STROKE, newColor);
      objectRef.color = newColor;
    }
    return newColor;
  }

  colorizeFeather(objectRef: any, keyModifier: KeyModifier, newColor: string = NO_VALUE) {
    if (keyModifier.leftKey) {
      if (!newColor) {
        newColor = this.storage.get(PRIMARY_COLOR);
      }
      this.drawingService.setSVGattribute(objectRef, STROKE, newColor);
      this.drawingService.setSVGattribute(objectRef, FILL, newColor);
      objectRef.color = newColor;
    }
    if (keyModifier.rightKey) {
      if (!newColor) {
        newColor = this.storage.get(SECONDARY_COLOR);
      }
      this.drawingService.setSVGattribute(objectRef, FILL, newColor);
      this.drawingService.setSVGattribute(objectRef, STROKE, newColor);
      objectRef.color = newColor;
    }
    return newColor;
  }

  colorizeSpray(objectRef: any, keyModifier: KeyModifier, newColor: string = NO_VALUE) {
    if (keyModifier.leftKey) {
      if (!newColor) {
        newColor = this.storage.get(PRIMARY_COLOR);
      }
      this.drawingService.setSVGattribute(objectRef, FILL, newColor);
      objectRef.color = newColor;
    }
    if (keyModifier.rightKey) {
      if (!newColor) {
        newColor = this.storage.get(SECONDARY_COLOR);
      }
      this.drawingService.setSVGattribute(objectRef, FILL, newColor);
      objectRef.color = newColor;
    }
    return newColor;
  }
}
