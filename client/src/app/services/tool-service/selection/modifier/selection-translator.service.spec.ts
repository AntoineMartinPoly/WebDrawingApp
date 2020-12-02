import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_POINT, FAKE_RECTANGLE } from 'src/constant/shape/constant';
import { SelectionTranslatorService } from './selection-translator.service';

describe('SelectionTranslatorService', () => {

  const MAGNETISM_SERVICE = 'magnetismService';
  let service: SelectionTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionTranslatorService],
    });
    service = TestBed.get(SelectionTranslatorService);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('translate should set initial value, set new selection dimension, create new translate and set drawingElements with it', () => {
    const updadeCoordinateService: jasmine.Spy = spyOn(service[MAGNETISM_SERVICE], 'updateCoordinate').and.returnValue({x: 10, y: 10});
    const setUpSpy = spyOn(service, 'setUpInitialTransform');
    const setUpRectSpy = spyOn(service, 'setSelectRectangleNewDimension');
    const setSpy = spyOn(service, 'setDrawingElementTranslateValue').and.returnValue('asd');
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    service.translate(drawingElements, FAKE_RECTANGLE, new MouseEvent('click'), {x: 20, y: 20});
    expect(setUpSpy).toHaveBeenCalledWith(drawingElements, FAKE_RECTANGLE);
    expect(setUpRectSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(updadeCoordinateService).toHaveBeenCalled();
  });

  it('setUpInitialTransform should store initial transform values for each drawing elements and selection if its not already store', () => {
    const getSpy = spyOn(service, 'getTransformationsFromDrawingElement').and.returnValue('asd');
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    const fakeRect = Object.assign({}, FAKE_RECTANGLE);
    service.setUpInitialTransform(drawingElements, fakeRect);
    expect(getSpy).toHaveBeenCalled();
    expect(service.initialTransformValues).toEqual(['asd', 'asd', 'asd']);
    expect((service as any).initialPosition).toEqual({x: FAKE_RECTANGLE.value.origin.x, y: FAKE_RECTANGLE.value.origin.y});
  });

  it('setUpInitialTransform should not store initial transform values for each drawing elements and selection if its already store', () => {
    const getSpy = spyOn(service, 'getTransformationsFromDrawingElement').and.returnValue('asd');
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    service.initialTransformValues = ['asd'];
    (service as any).initialPosition = {x: 15, y: 15};
    const fakeRect = Object.assign({}, FAKE_RECTANGLE);
    service.setUpInitialTransform(drawingElements, fakeRect);
    expect(getSpy).not.toHaveBeenCalled();
    expect(service.initialTransformValues).not.toEqual(['asd', 'asd', 'asd']);
    expect((service as any).initialPosition).not.toEqual({x: FAKE_RECTANGLE.value.origin.x, y: FAKE_RECTANGLE.value.origin.y});
  });

  it('setDrawingElementScaleValue should set new matrix value to the specific drawing element', () => {
    const setSpy = spyOn(service, 'setTransformAttribute');
    service.transformIterator = 0;
    service.initialTransformValues = ['fake transform 1'];
    service.setDrawingElementTranslateValue({ref: new MockElementRef()}, FAKE_POINT);
    expect(setSpy).toHaveBeenCalledWith(new MockElementRef() , 'translate(0,0) fake transform 1');
  });

  it('setSelectRectangleNewDimension should set new origin for selection with new mouse position', () => {
    const secondFakePoint = {x: 15, y: 15};
    const fakeRect = Object.assign({}, FAKE_RECTANGLE);
    (service as any).initialPosition = {x: -5, y: 30};
    service.setSelectRectangleNewDimension(fakeRect, FAKE_POINT, secondFakePoint);
    expect(fakeRect.value.origin.x).toEqual((service as any).initialPosition.x + FAKE_POINT.x - secondFakePoint.x);
    expect(fakeRect.value.origin.y).toEqual((service as any).initialPosition.y + FAKE_POINT.y - secondFakePoint.y);
  });
});
