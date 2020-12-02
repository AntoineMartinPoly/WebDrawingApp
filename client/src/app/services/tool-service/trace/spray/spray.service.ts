import {ElementRef, Injectable} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {NO_VALUE, PRIMARY_COLOR, THREE} from 'src/constant/constant';
import {
  CENTER_X,
  CENTER_Y,
  MAX_ROTATE, RADIUS, SPRAY_DEFAULT_PERIOD,
  SPRAY_DEFAULT_RADIUS, SPRAY_OPACITY, SPRAY_SPECK_RADIUS
} from 'src/constant/spray/constant';
import {ERROR, SPRAY_INTERVAL_PERIOD, SPRAY_RADIUS} from 'src/constant/storage/constant';
import {
  CIRCLE, DATA_TYPE, FILL,
  FILL_OPACITY,
  GROUP,
  POINTERS_EVENT, SPRAY, TRANSFORM,
  VISIBLE_STROKE
} from 'src/constant/svg/constant';
import {DEFAULT_POINT} from 'src/constant/tool-service/constant';
import {Point} from 'src/interface/Point';
import {Spray} from 'src/interface/spray/spray';
import {DrawingElementManagerService} from '../../../drawing-element-manager/drawing-element-manager.service';
import {DrawingService} from '../../../drawing/drawing.service';
import {StorageService} from '../../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SprayService {
  sprayGroup: ElementRef;
  private mInterval: Observable<number>;
  private mIntervalPeriod: number;
  radius: number;
  currentPosition: Point;
  private sprayGenerator: Subscription;
  private drawingService: DrawingService;
  private color: string;

  constructor(private storage: StorageService, private drawingElementManager: DrawingElementManagerService) {
    const intervalPeriodRaw: string = this.storage.get(SPRAY_INTERVAL_PERIOD);
    this.intervalPeriod = intervalPeriodRaw === ERROR ? SPRAY_DEFAULT_PERIOD : Number(intervalPeriodRaw);
    const diameterRaw: string = this.storage.get(SPRAY_RADIUS);
    this.radius = diameterRaw === ERROR ? SPRAY_DEFAULT_RADIUS : Number(diameterRaw);
    this.drawingService = DrawingService.getInstance();
    this.currentPosition = DEFAULT_POINT;
  }

  set intervalPeriod(period: number) {
    this.mIntervalPeriod = period;
    this.mInterval = interval(this.mIntervalPeriod);
  }
  get intervalPeriod(): number {
    return this.mIntervalPeriod;
  }

  get interval(): Observable<number> {
    return this.mInterval;
  }

  generateSprayGroup(): ElementRef {
    this.color = this.storage.get(PRIMARY_COLOR);
    this.sprayGroup = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.setSVGattribute(this.sprayGroup, DATA_TYPE, SPRAY);
    this.drawingService.setSVGattribute(this.sprayGroup, FILL_OPACITY, SPRAY_OPACITY);
    this.drawingService.setSVGattribute(this.sprayGroup, FILL, this.color);
    this.drawingService.addSVGElementFromRef(this.sprayGroup);
    this.drawingService.setSVGattribute(this.sprayGroup, POINTERS_EVENT, VISIBLE_STROKE);
    return this.sprayGroup;
  }

  generateSprayElement(): void {
    for (let numCircles = 0; numCircles < this.radius / THREE; ++numCircles) {
      const sprayCircle: ElementRef = this.drawingService.generateSVGElement(CIRCLE);
      this.drawingService.addSVGElementFromRef(sprayCircle);
      [
        {key: CENTER_X, value: (this.currentPosition.x + numCircles * THREE).toString()},
        {key: CENTER_Y, value: this.currentPosition.y.toString()},
        {
          key: TRANSFORM,
          value:
            `rotate(${Math.random() * MAX_ROTATE}, ${this.currentPosition.x}, ${this.currentPosition.y})`,
        },
        {key: RADIUS, value: SPRAY_SPECK_RADIUS},
      ].forEach((attribute: { key: string, value: string }) => {
        this.drawingService.setSVGattribute(sprayCircle, attribute.key, attribute.value);
      });
      this.drawingService.addSVGToSVG(sprayCircle, this.sprayGroup);
    }
  }

  createSpray(sprayGroup: ElementRef): Spray {
    return {
      ref: sprayGroup,
      radius: Number(this.storage.get(SPRAY_RADIUS)),
      intervalPeriod: Number(this.storage.get(SPRAY_INTERVAL_PERIOD)),
      color: this.color,
    };
  }

  removeElement(spray: Spray) {
    this.drawingService.removeSVGElementFromRef(spray.ref);
    this.drawingElementManager.removeDrawingElement(spray);
  }

  reAddElement(spray: Spray) {
    this.drawingService.addSVGElementFromRef(spray.ref);
    this.drawingElementManager.appendDrawingElement(spray);
  }

  createSprayFromSVGElement(element: ElementRef): Spray {
    return {
      ref: element,
      radius: SPRAY_DEFAULT_RADIUS,
      intervalPeriod: SPRAY_DEFAULT_PERIOD,
      color: NO_VALUE,
    };
  }

  startSpraying() {
    this.sprayGenerator = this.interval.subscribe(() => this.generateSprayElement());
  }

  stopSpraying() {
    this.sprayGenerator.unsubscribe();
  }

  saveState() {
    this.storage.set(SPRAY_INTERVAL_PERIOD, this.intervalPeriod.toString());
    this.storage.set(SPRAY_RADIUS, this.radius.toString());
  }

  loadState() {
    const intervalPeriodRaw: string = this.storage.get(SPRAY_INTERVAL_PERIOD);
    this.intervalPeriod = intervalPeriodRaw === ERROR ? SPRAY_DEFAULT_PERIOD : Number(intervalPeriodRaw);
    const radiusRaw: string = this.storage.get(SPRAY_RADIUS);
    this.radius = radiusRaw === ERROR ? SPRAY_DEFAULT_RADIUS : Number(radiusRaw);
  }
}
