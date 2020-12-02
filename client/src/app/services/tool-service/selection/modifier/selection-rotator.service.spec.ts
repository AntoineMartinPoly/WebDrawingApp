import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_DIMENSION, FAKE_POINT, FAKE_RECTANGLE } from 'src/constant/shape/constant';
import { DEFAULT_POINT } from 'src/constant/tool-service/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { SelectionRotatorService } from './selection-rotator.service';

describe('SelectionRotatorService', () => {
  let service: SelectionRotatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionRotatorService],
    });
    service = TestBed.get(SelectionRotatorService);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('rotate should set initial value and set all drawings element with new rotate degree', () => {
    const setUpSpy = spyOn(service, 'setUpInitialTransform');
    const getRotateSpy = spyOn(service, 'getRotateDegre').and.returnValue(123);
    const setSpy = spyOn(service, 'setDrawingElementRotateValue').and.returnValue('asd');
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    service.rotate(drawingElements, FAKE_RECTANGLE);
    expect(setUpSpy).toHaveBeenCalledWith(drawingElements, FAKE_RECTANGLE);
    expect(getRotateSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
  });

  it('setUpInitialTransform should store initial transform values for each drawing elements and selection if its not already store', () => {
    const getTransformSpy = spyOn(service, 'getTransformationsFromDrawingElement').and.returnValue('asd');
    const getDrawRotateSpy = spyOn(service, 'getDrawingElementRotationPoint').and.returnValue(FAKE_POINT);
    const getRotateSpy = spyOn(service, 'getNewRotationPoint').and.returnValue(FAKE_POINT);
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    const fakeRect = Object.assign({}, FAKE_RECTANGLE);
    service.setUpInitialTransform(drawingElements, fakeRect);
    expect(getTransformSpy).toHaveBeenCalled();
    expect(getDrawRotateSpy).not.toHaveBeenCalled();
    expect(getRotateSpy).toHaveBeenCalled();
    expect(service.initialTransformValues).toEqual(['asd', 'asd', 'asd']);
    expect((service as any).rotatePoint).toEqual(FAKE_POINT);
  });

  it('setUpInitialTransform should store initial transform values for each drawing elements and selection if its not already store', () => {
    const getTransformSpy = spyOn(service, 'getTransformationsFromDrawingElement').and.returnValue('asd');
    const getDrawRotateSpy = spyOn(service, 'getDrawingElementRotationPoint').and.returnValue(FAKE_POINT);
    const getRotateSpy = spyOn(service, 'getNewRotationPoint').and.returnValue(FAKE_POINT);
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    const fakeRect = Object.assign({}, FAKE_RECTANGLE);
    fakeRect.key.shift = true;
    (service as any).drawingElementsRotatePoints = [];
    service.setUpInitialTransform(drawingElements, fakeRect);
    fakeRect.key.shift = false;
    expect(getTransformSpy).toHaveBeenCalled();
    expect(getDrawRotateSpy).toHaveBeenCalled();
    expect(getRotateSpy).toHaveBeenCalled();
    expect(service.initialTransformValues).toEqual(['asd', 'asd', 'asd']);
    expect((service as any).rotatePoint).toEqual(FAKE_POINT);
  });

  it('getNewRotationPoint should return rotate point based on selection rectangle', () => {
    const rotatePoint = service.getNewRotationPoint(FAKE_RECTANGLE);
    expect(rotatePoint.x).toEqual(FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width / 2);
    expect(rotatePoint.y).toEqual(FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height / 2);
  });

  it('getDrawingElementRotationPoint should return rotate point based on selection rectangle', () => {
    const fakeDrawing: DrawingElement = {ref: new MockElementRef()};
    const getBoundingSpy: jasmine.Spy = spyOn(fakeDrawing.ref, 'getBoundingClientRect').and.returnValue(FAKE_DIMENSION);
    const getRelSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue(FAKE_POINT);
    const rotatePoint = service.getDrawingElementRotationPoint(fakeDrawing);
    expect(rotatePoint.x).toEqual(FAKE_POINT.x + FAKE_DIMENSION.width / 2);
    expect(rotatePoint.y).toEqual(FAKE_POINT.y + FAKE_DIMENSION.height / 2);
    expect(getBoundingSpy).toHaveBeenCalled();
    expect(getRelSpy).toHaveBeenCalled();
  });

  it('getRotateDegre should return rotate degree positive if mouse wheel up', () => {
    const fakeKeyModifier = Object.assign({}, FAKE_KEY_MODIFIER);
    fakeKeyModifier.wheelUp = true;
    fakeKeyModifier.altKey = false;
    const rotateDegree = service.getRotateDegre(fakeKeyModifier);
    expect(rotateDegree).toEqual(15);
  });

  it('getRotateDegre should return rotate degree negative if mouse wheel up', () => {
    const fakeKeyModifier = Object.assign({}, FAKE_KEY_MODIFIER);
    fakeKeyModifier.wheelUp = false;
    fakeKeyModifier.altKey = false;
    const rotateDegree = service.getRotateDegre(fakeKeyModifier);
    expect(rotateDegree).toEqual(-15);
  });

  it('getRotateDegre should return rotate degree increment by 1 on alt positive if mouse wheel up', () => {
    const fakeKeyModifier = Object.assign({}, FAKE_KEY_MODIFIER);
    fakeKeyModifier.wheelUp = true;
    fakeKeyModifier.altKey = true;
    const rotateDegree = service.getRotateDegre(fakeKeyModifier);
    expect(rotateDegree).toEqual(1);
  });

  it('getRotateDegre should return rotate degree increment by 1 on alt negative if mouse wheel up', () => {
    const fakeKeyModifier = Object.assign({}, FAKE_KEY_MODIFIER);
    fakeKeyModifier.wheelUp = false;
    fakeKeyModifier.altKey = true;
    const rotateDegree = service.getRotateDegre(fakeKeyModifier);
    expect(rotateDegree).toEqual(-1);
  });

  it('setDrawingElementRotateValue should set new rotate value to the specific drawing element', () => {
    const setSpy = spyOn(service, 'setTransformAttribute');
    service.transformIterator = 0;
    service.initialTransformValues = ['fake rotate'];
    (service as any).rotatePoint = FAKE_POINT;
    const fakeKeyModifier = Object.assign({}, FAKE_KEY_MODIFIER);
    fakeKeyModifier.shift = false;
    service.setDrawingElementRotateValue({ref: new MockElementRef()}, 123, fakeKeyModifier);
    expect(setSpy).toHaveBeenCalledWith(new MockElementRef(), `rotate(123,${FAKE_POINT.x},${FAKE_POINT.y}) fake rotate`);
  });

  it('setDrawingElementRotateValue should set new rotate value to the specific drawing element base on element center on shift', () => {
    const setSpy = spyOn(service, 'setTransformAttribute');
    service.transformIterator = 0;
    service.initialTransformValues = ['fake rotate'];
    (service as any).drawingElementsRotatePoints = [FAKE_POINT];
    const fakeKeyModifier = Object.assign({}, FAKE_KEY_MODIFIER);
    fakeKeyModifier.shift = true;
    service.setDrawingElementRotateValue({ref: new MockElementRef()}, 123, fakeKeyModifier);
    fakeKeyModifier.shift = false;
    expect(setSpy).toHaveBeenCalledWith(new MockElementRef(), `rotate(123,${FAKE_POINT.x},${FAKE_POINT.y}) fake rotate`);
  });

  it('resetAdditionnalAttribute should set initialRectDimension to default value', () => {
    (service as any).rotateDegree = 123;
    (service as any).rotatePoint = FAKE_POINT;
    (service as any).drawingElementsRotatePoints = [123, 123];
    service.resetAdditionnalAttribute();
    expect((service as any).rotateDegree).toEqual(0);
    expect((service as any).rotatePoint).toEqual(DEFAULT_POINT);
    expect((service as any).drawingElementsRotatePoints).toEqual([]);
  });
});
