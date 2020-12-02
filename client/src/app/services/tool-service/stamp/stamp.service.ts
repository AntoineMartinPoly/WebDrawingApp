import { ElementRef, Injectable } from '@angular/core';
import { DECIMAL, LEFT_PARENTHESIS, NO_VALUE } from 'src/constant/constant';
import { STAMP_URL_1, STAMP_URL_2, STAMP_URL_3, STAMP_URL_4, STAMP_URL_5 } from 'src/constant/stamp/constant';
import { STAMP_OPTION_IMAGE, STAMP_OPTION_ROTATE, STAMP_OPTION_SCALE } from 'src/constant/storage/constant';
import { DATA_TYPE, DEFAULT_VALUE, GROUP, HEIGHT, HREF, IMAGE, NONE, POINTERS_EVENT,
  RIGHT_BRACKET, ROTATE, SPACE, STAMP, TRANSFORM, WIDTH, X, Y } from 'src/constant/svg/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { Point } from 'src/interface/Point';
import { Stamp, StampType } from 'src/interface/stamp/stamp';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import { DrawingService } from '../../drawing/drawing.service';

import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class StampService {

  constructor(public storage: StorageService,
              public drawingElementManager: DrawingElementManagerService) {
    this.drawingService = DrawingService.getInstance();
  }

  drawingService: DrawingService;

  generateStampElement() {
    const stampGroup = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.setSVGattribute(stampGroup, DATA_TYPE, STAMP);
    const stamp = this.drawingService.generateSVGElement(IMAGE);
    this.drawingService.setSVGattribute(stamp, POINTERS_EVENT, NONE);
    this.drawingService.addSVGToSVG(stamp, stampGroup);
    this.drawingService.addSVGElementFromRef(stampGroup);

    return stampGroup;
  }

  createStampFromSVGElement(svgElement: ElementRef): Stamp {
    return {
      ref: svgElement,
      origin: {
        x: parseInt(this.drawingService.getSVGElementAttributes(
          (svgElement as any).children[DEFAULT_VALUE], X), DECIMAL),
        y: parseInt(this.drawingService.getSVGElementAttributes(
          (svgElement as any).children[DEFAULT_VALUE], Y), DECIMAL),
      },
      height: parseInt(this.drawingService.getSVGElementAttributes(
        (svgElement as any).children[DEFAULT_VALUE], HEIGHT), DECIMAL),
      width: parseInt(this.drawingService.getSVGElementAttributes(
        (svgElement as any).children[DEFAULT_VALUE], WIDTH), DECIMAL),
      link: this.drawingService.getSVGElementAttributes(
        (svgElement as any).children[DEFAULT_VALUE], HREF),
      scale: DEFAULT_VALUE,
      rotate: DEFAULT_VALUE,
    };
  }

  createStamp(stampRef: ElementRef, event: MouseEvent): Stamp {
    const originPoint: Point = this.drawingService.getRelativeCoordinates({ x: event.x, y: event.y });
    return {
      ref: stampRef,
      origin: originPoint,
      height: 100,
      width: 100,
      link: this.getStampUrl(),
      scale: parseInt(this.storage.get(STAMP_OPTION_SCALE), DECIMAL),
      rotate: parseInt(this.storage.get(STAMP_OPTION_ROTATE), DECIMAL),
    };
  }

  getStampUrl(): string {
    switch (this.storage.get(STAMP_OPTION_IMAGE)) {
      case StampType.Chrome:
        return STAMP_URL_1;
      case StampType.Sonic:
        return STAMP_URL_2;
      case StampType.GOD_1:
        return STAMP_URL_3;
      case StampType.GOD_2:
        return STAMP_URL_4;
      case StampType.Deer:
        return STAMP_URL_5;
      default:
        return NO_VALUE;
    }
  }

  editStamp(stamp: Stamp) {
    const groupChild = stamp.ref.children[FIRST_CHILD];
    this.drawingService.setSVGattribute(groupChild, X, (stamp.origin.x - stamp.scale * 50).toString());
    this.drawingService.setSVGattribute(groupChild, Y, (stamp.origin.y - stamp.scale * 50).toString());
    this.drawingService.setSVGattribute(groupChild, HEIGHT, (stamp.scale * stamp.height).toString());
    this.drawingService.setSVGattribute(groupChild, WIDTH, (stamp.scale * stamp.width).toString());
    this.drawingService.setSVGattribute(groupChild, HREF, stamp.link);
    this.drawingService.setSVGattribute(groupChild, TRANSFORM, ROTATE + LEFT_PARENTHESIS +
      stamp.rotate.toString() + SPACE + (stamp.origin.x).toString() + SPACE +
      (stamp.origin.y).toString() + RIGHT_BRACKET);
  }

  modifierRotateStamp(angle: number, stamp: Stamp) {
    const groupChild = stamp.ref.children[FIRST_CHILD];
    this.drawingService.setSVGattribute(groupChild, TRANSFORM, ROTATE + LEFT_PARENTHESIS +
      angle.toString() + SPACE + (stamp.origin.x).toString() + SPACE +
      (stamp.origin.y).toString() + RIGHT_BRACKET);
  }

  removeElement(stamp: Stamp) {
    this.drawingService.removeSVGElementFromRef(stamp.ref);
    this.drawingElementManager.removeDrawingElement(stamp);
  }

  reAddElement(stamp: Stamp) {
    this.drawingService.addSVGElementFromRef(stamp.ref);
    this.drawingElementManager.appendDrawingElement(stamp);
  }

}
