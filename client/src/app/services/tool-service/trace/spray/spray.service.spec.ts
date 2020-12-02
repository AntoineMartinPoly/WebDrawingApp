// tslint:disable:no-string-literal
import {TestBed} from '@angular/core/testing';
import createSpyObj = jasmine.createSpyObj;
import {Observable, Subscription} from 'rxjs';
import {MockElementRef, NO_VALUE} from 'src/constant/constant';
import {SPRAY_DEFAULT_COLOR, SPRAY_DEFAULT_PERIOD, SPRAY_DEFAULT_RADIUS} from '../../../../../constant/spray/constant';
import {TEST_POINT} from '../../../../../constant/tool-service/constant';
import {Spray} from '../../../../../interface/spray/spray';
import {DrawingElementManagerService} from '../../../drawing-element-manager/drawing-element-manager.service';
import {DrawingService} from '../../../drawing/drawing.service';
import {StorageService} from '../../../storage/storage.service';
import {SprayService} from './spray.service';

describe('SprayService', () => {
  let service: SprayService;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let drawingElementSpy: jasmine.SpyObj<DrawingElementManagerService>;

  beforeEach(() => {
    const drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [
        'getRelativeCoordinates',
        'setSVGattribute',
        'addSVGElementFromRef',
        'generateSVGElement',
        'addSVGToSVG',
        'removeSVGElementFromRef',
        'getSVGElementAttributes',
      ]);
    drawingServiceSpyObj.getRelativeCoordinates.and.returnValue(TEST_POINT);
    spyOn(DrawingService, 'getInstance').and.returnValue(drawingServiceSpyObj);
    TestBed.configureTestingModule({
      providers: [
        {provide: StorageService, useValue: jasmine.createSpyObj('StorageService', ['get', 'set'])},
        {
          provide: DrawingElementManagerService, useValue: jasmine.createSpyObj('DrawingElementManagerService',
            ['appendDrawingElement', 'removeDrawingElement']),
        },
      ],
    });

    service = TestBed.get(SprayService);
    storageSpy = TestBed.get(StorageService);
    drawingElementSpy = TestBed.get(DrawingElementManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateSprayElement should call drawing service addSVGElementFromRef / setSVGattribute / generateSVGElement / addSVGToSVG', () => {
    service.radius = 1;
    service.generateSprayElement();
    expect(service['drawingService'].setSVGattribute).toHaveBeenCalled();
    expect(service['drawingService'].addSVGElementFromRef).toHaveBeenCalled();
    expect(service['drawingService'].generateSVGElement).toHaveBeenCalled();
    expect(service['drawingService'].addSVGToSVG).toHaveBeenCalled();
    expect(storageSpy.get).toHaveBeenCalled();
  });

  it('createSprayFromSVGElement should create a Spray object and call getSVGElementAttributes', () => {
    const fakeSprayElement = new MockElementRef();
    const spray = service.createSprayFromSVGElement(fakeSprayElement);
    expect(spray).toEqual({
      radius: SPRAY_DEFAULT_RADIUS,
      intervalPeriod: SPRAY_DEFAULT_PERIOD,
      ref: fakeSprayElement,
      color: NO_VALUE,
    });
  });

  it('createSpray should call drawing service addSVGElementFromRef / setSVGattribute / generateSVGElement', () => {
    service.radius = SPRAY_DEFAULT_RADIUS;
    service['intervalPeriod'] = SPRAY_DEFAULT_PERIOD;
    service['color'] = SPRAY_DEFAULT_COLOR;
    const spray = service.createSpray(new MockElementRef());
    expect(spray.color).toBe(SPRAY_DEFAULT_COLOR);
  });

  it('generateSprayGroup should call generateSVGElement, addSVGElementFromRef, setSVGattribute and return group ref', () => {
    const genSpy: jasmine.Spy = (service['drawingService'].generateSVGElement as jasmine.Spy).and.returnValue(new MockElementRef());
    const groupRef = service.generateSprayGroup();
    expect(groupRef).toEqual(new MockElementRef());
    expect(genSpy).toHaveBeenCalled();
    expect(service['drawingService'].addSVGElementFromRef).toHaveBeenCalled();
    expect(service['drawingService'].setSVGattribute).toHaveBeenCalled();
  });

  it('removeElement should call removeSVGElementFromRef and remove the ref from the drawing element manager', () => {
    service.removeElement({ref: new MockElementRef()} as Spray);
    expect(service['drawingService'].removeSVGElementFromRef).toHaveBeenCalled();
    expect(drawingElementSpy.removeDrawingElement).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef', () => {
    service.reAddElement({ref: new MockElementRef()} as Spray);
    expect(service['drawingService'].addSVGElementFromRef).toHaveBeenCalled();
    expect(drawingElementSpy.appendDrawingElement).toHaveBeenCalled();
  });

  it('startSpraying should subscribe to the `interval` observable', () => {
    service['mInterval'] = createSpyObj<Observable<number>>('Observable', ['subscribe']);
    const FAKE: Subscription = 'fake' as unknown as Subscription;
    // tslint:disable-next-line:deprecation
    (service['mInterval'].subscribe as jasmine.Spy).and.returnValue(FAKE);
    service.startSpraying();
    expect(service['sprayGenerator']).toBe(FAKE);
    // tslint:disable-next-line:deprecation
    expect(service['mInterval'].subscribe).toHaveBeenCalled();
  });

  it('stopSpraying should unsubscribe from sprayGenerator', () => {
    service['sprayGenerator'] = createSpyObj('Subscription', ['unsubscribe']);
    service.stopSpraying();
    expect(service['sprayGenerator'].unsubscribe).toHaveBeenCalled();
  });

  it('loadState should load state from localStorage', () => {
    const FAKE_NUMERAL_STRING = '11';
    const getSpy: jasmine.Spy = (service['storage'].get as jasmine.Spy).and.returnValue(FAKE_NUMERAL_STRING);
    service.loadState();
    expect(getSpy).toHaveBeenCalled();
    expect(service.radius).toBe(Number(FAKE_NUMERAL_STRING));
    expect(service.intervalPeriod).toBe(Number(FAKE_NUMERAL_STRING));
  });

  it('saveState should save state to localStorage', () => {
    service.saveState();
    expect(service['storage'].set).toHaveBeenCalled();
  });
});
