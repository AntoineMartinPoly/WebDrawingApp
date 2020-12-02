import { Injectable } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { DECIMAL, NO_VALUE, ONE, PRIMARY_COLOR, SECONDARY_COLOR, TWO } from 'src/constant/constant';
import {
  BRUSH,
  BUCKET,
  DATA_TYPE,
  ELLIPSE,
  FEATHER,
  FILL,
  LINE,
  PEN,
  PENCIL,
  POLYGON,
  RECTANGLE,
  SPRAY,
  STROKE,
  STROKE_WIDTH
} from 'src/constant/svg/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { StorageService } from '../../storage/storage.service';
import { ColorPickerService } from '../../toolbar/color-picker/color-picker.service';

@Injectable({
  providedIn: 'root',
})
export class PipetteService {

  drawingService: DrawingService;

  constructor(public storage: StorageService, public colorService: ColorPickerService ) {
    this.drawingService = DrawingService.getInstance();
  }

  getColor(objectRef: any, keyModifier: KeyModifier, event: MouseEvent, setGlobalColor: boolean = true): string {
    const originPoint: Point = DrawingService.getInstance().getRelativeCoordinates({ x: event.x, y: event.y });
    const elementDataType = this.drawingService.getAttributeValueFromSVG(objectRef, DATA_TYPE);
    switch (elementDataType) {
      case RECTANGLE: {
        return this.getRectangleColor(objectRef, keyModifier, originPoint, setGlobalColor);
      }
      case PEN: {
        return this.getTraceColor(objectRef, keyModifier, setGlobalColor);
      }
      case PENCIL: {
        return this.getTraceColor(objectRef, keyModifier, setGlobalColor);
      }
      case FEATHER: {
        return this.getTraceColor(objectRef, keyModifier, setGlobalColor);
      }
      case BRUSH: {
        return this.getTraceColor(objectRef, keyModifier, setGlobalColor);
      }
      case ELLIPSE: {
        return this.getEllipseColor(objectRef, keyModifier, originPoint, setGlobalColor);
      }
      case POLYGON: {
        return this.getPolygonColor(objectRef, keyModifier, setGlobalColor);
      }
      case LINE: {
        return this.getTraceColor(objectRef, keyModifier, setGlobalColor);
      }
      case BUCKET: {
        return this.getTraceColor(objectRef, keyModifier, setGlobalColor);
      }
      case SPRAY: {
        return this.getSprayColor(objectRef, keyModifier, setGlobalColor);
      }
    }
    return NO_VALUE;
  }

  getRectangleColor(object: any, keyModifier: KeyModifier, pointClicked: Point, setGlobalColor: boolean = true) {
    let color;
    if (this.isRectangleContourClicked(object.children[FIRST_CHILD], pointClicked)) {
      color = this.drawingService.getAttributeValueFromSVG(object, STROKE);
      if (keyModifier.leftKey && setGlobalColor) {
        this.storage.set(PRIMARY_COLOR, color);
        this.colorService.setUpPrimaryColor();
      }
      if (keyModifier.rightKey && setGlobalColor) {
        this.storage.set(SECONDARY_COLOR, color);
        this.colorService.setUpSecondaryColor();
      }
    } else {
      color = this.drawingService.getAttributeValueFromSVG(object, FILL);
      if (keyModifier.leftKey && setGlobalColor) {
        this.storage.set(PRIMARY_COLOR, color);
        this.colorService.setUpPrimaryColor();
      }
      if (keyModifier.rightKey && setGlobalColor) {
        this.storage.set(SECONDARY_COLOR, color);
        this.colorService.setUpSecondaryColor();
      }
    }
    return color;
  }

  getTraceColor(object: any, keyModifier: KeyModifier, setGlobalColor: boolean = true) {
    const color = this.drawingService.getAttributeValueFromSVG(object, STROKE);
    if (keyModifier.leftKey && setGlobalColor) {
      this.storage.set(PRIMARY_COLOR, color);
      this.colorService.setUpPrimaryColor();
    }
    if (keyModifier.rightKey && setGlobalColor) {
      this.storage.set(SECONDARY_COLOR, color);
      this.colorService.setUpSecondaryColor();
    }
    return color;
  }

  getSprayColor(object: any, keyModifier: KeyModifier, setGlobalColor: boolean = true) {
    const color = this.drawingService.getAttributeValueFromSVG(object, FILL);
    if (keyModifier.leftKey && setGlobalColor) {
      this.storage.set(PRIMARY_COLOR, color);
      this.colorService.setUpPrimaryColor();
    }
    if (keyModifier.rightKey && setGlobalColor) {
      this.storage.set(SECONDARY_COLOR, color);
      this.colorService.setUpSecondaryColor();
    }
    return color;
  }

  getEllipseColor(object: any, keyModifier: KeyModifier, pointClicked: Point, setGlobalColor: boolean = true) {
    let color;
    if (this.isEllipseContourClicked(object.children[FIRST_CHILD], pointClicked)) {
      color = this.drawingService.getAttributeValueFromSVG(object, STROKE);
      if (keyModifier.leftKey && setGlobalColor) {
        this.storage.set(PRIMARY_COLOR, color);
        this.colorService.setUpPrimaryColor();
      }
      if (keyModifier.rightKey && setGlobalColor) {
        this.storage.set(SECONDARY_COLOR, color);
        this.colorService.setUpSecondaryColor();
      }
    } else {
      color = this.drawingService.getAttributeValueFromSVG(object, FILL);
      if (keyModifier.leftKey && setGlobalColor) {
        this.storage.set(PRIMARY_COLOR, color);
        this.colorService.setUpPrimaryColor();
      }
      if (keyModifier.rightKey && setGlobalColor) {
        this.storage.set(SECONDARY_COLOR, color);
        this.colorService.setUpSecondaryColor();
      }
    }
    return color;
  }

  getPolygonColor(object: any, keyModifier: KeyModifier, setGlobalColor: boolean = true) {
    let color;
    if (object.attributes.fill) {
      color = object.attributes.fill.nodeValue;
      if (keyModifier.leftKey && setGlobalColor) {
        this.storage.set(PRIMARY_COLOR, color);
        this.colorService.setUpPrimaryColor();
      }
      if (keyModifier.rightKey && setGlobalColor) {
        this.storage.set(SECONDARY_COLOR, color);
        this.colorService.setUpSecondaryColor();
      }
    } else {
      color = object.attributes.stroke.nodeValue;
      if (keyModifier.leftKey && setGlobalColor) {
        this.storage.set(PRIMARY_COLOR, color);
        this.colorService.setUpPrimaryColor();
      }
      if (keyModifier.rightKey && setGlobalColor) {
        this.storage.set(SECONDARY_COLOR, color);
        this.colorService.setUpSecondaryColor();
      }
    }
    return color;
  }

  isRectangleContourClicked(object: any, pointClicked: Point): boolean {
    const contourWidth = Number(this.drawingService.getAttributeValueFromSVG(this.drawingService.getParentSVG(object), STROKE_WIDTH)) / TWO;
    const height = parseInt(object.attributes.height.nodeValue, DECIMAL);
    const width = parseInt(object.attributes.width.nodeValue, DECIMAL);
    const originPoint = { x: parseInt(object.attributes.x.nodeValue, DECIMAL), y: parseInt(object.attributes.y.nodeValue, DECIMAL) };
    if ((originPoint.x - contourWidth < pointClicked.x && pointClicked.x < originPoint.x + contourWidth) ||
      (originPoint.x + width - contourWidth < pointClicked.x && pointClicked.x < originPoint.x + width + contourWidth)) {
      return true;
    } else if ((originPoint.y - contourWidth < pointClicked.y && pointClicked.y < originPoint.y + contourWidth) ||
      (originPoint.y + height - contourWidth < pointClicked.y && pointClicked.y < originPoint.y + height + contourWidth)) {
      return true;
    }
    return false;
  }

  isEllipseContourClicked(object: any, pointClicked: Point): boolean {
    const contourWidth = Number(this.drawingService.getAttributeValueFromSVG(this.drawingService.getParentSVG(object), STROKE_WIDTH)) / TWO;
    const height = parseInt(object.attributes.ry.nodeValue, DECIMAL);
    const width = parseInt(object.attributes.rx.nodeValue, DECIMAL);
    const originPoint = { x: parseInt(object.attributes.cx.nodeValue, DECIMAL), y: parseInt(object.attributes.cy.nodeValue, DECIMAL) };
    if (((((pointClicked.x - originPoint.x) * (pointClicked.x - originPoint.x)) / ((width + contourWidth) * (width + contourWidth)) +
      ((pointClicked.y - originPoint.y) * (pointClicked.y - originPoint.y)) / ((height + contourWidth) * (height + contourWidth))) < ONE) &&
      ((((pointClicked.x - originPoint.x) * (pointClicked.x - originPoint.x)) / ((width - contourWidth) * (width - contourWidth)) +
      ((pointClicked.y - originPoint.y) * (pointClicked.y - originPoint.y)) / ((height - contourWidth) * (height - contourWidth))) > ONE)) {
      return true;
    }
    return false;
  }
}
