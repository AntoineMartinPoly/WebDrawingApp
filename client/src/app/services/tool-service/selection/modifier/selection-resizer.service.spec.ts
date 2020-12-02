import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_DIMENSION, FAKE_POINT, FAKE_RECTANGLE } from 'src/constant/shape/constant';
import { ResizeState } from 'src/constant/tool-service/constant';
import { SelectionResizerService } from './selection-resizer.service';

describe('SelectionResizerService', () => {
  const MAGNETISM_SERVICE = 'magnetismService';
  let service: SelectionResizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionResizerService],
    });
    service = TestBed.get(SelectionResizerService);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('resize should set initial value, set new selection dimension, create new matrix and set drawingElements with it', () => {
    const magnetismSpy: jasmine.Spy = spyOn(service[MAGNETISM_SERVICE], 'updateCoordinate').and.returnValue({x: 10, y: 10});
    const setUpSpy = spyOn(service, 'setUpInitialTransform');
    const createMatrixSpy = spyOn(service, 'createNewTransformMatrix').and.returnValue('matrix(1.5,0,0,1.5,10,10');
    const setSpy = spyOn(service, 'setDrawingElementScaleValue').and.returnValue('asd');
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    service.resize(new MouseEvent('click'), drawingElements, FAKE_RECTANGLE, {x: 20, y: 20}, ResizeState.topRight);
    expect(magnetismSpy).toHaveBeenCalled();
    expect(setUpSpy).toHaveBeenCalledWith(drawingElements, FAKE_RECTANGLE);
    expect(createMatrixSpy).toHaveBeenCalledWith(FAKE_RECTANGLE, {x: 20, y: 20}, ResizeState.topRight, {x: 10, y: 10});
    expect(setSpy).toHaveBeenCalled();
  });

  it('setUpInitialTransform should store initial transform values for each drawing elements and selection if its not already store', () => {
    const getSpy = spyOn(service, 'getTransformationsFromDrawingElement').and.returnValue('asd');
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    const fakeRect = Object.assign({}, FAKE_RECTANGLE);
    service.setUpInitialTransform(drawingElements, fakeRect);
    expect(getSpy).toHaveBeenCalled();
    expect(service.initialTransformValues).toEqual(['asd', 'asd', 'asd']);
    expect((service as any).initialRectDimension).toEqual({width: FAKE_RECTANGLE.value.width, height: FAKE_RECTANGLE.value.height});
  });

  it('setUpInitialTransform should not store initial transform values for each drawing elements and selection if its already store', () => {
    const getSpy = spyOn(service, 'getTransformationsFromDrawingElement').and.returnValue('asd');
    const drawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    service.initialTransformValues = ['asd'];
    (service as any).initialRectDimension = {x: 15, y: 15};
    const fakeRect = Object.assign({}, FAKE_RECTANGLE);
    service.setUpInitialTransform(drawingElements, fakeRect);
    expect(getSpy).not.toHaveBeenCalled();
    expect(service.initialTransformValues).not.toEqual(['asd', 'asd', 'asd']);
    expect((service as any).initialRectDimension).not.toEqual({width: FAKE_RECTANGLE.value.width, height: FAKE_RECTANGLE.value.height});
  });

  it('createNewTransformMatrix should return correct new matrix value for transform attribute and set rectangle new dimension', () => {
    const setRectSpy = spyOn(service, 'setSelectRectangleNewDimension');
    const scaleValues = {x: 10, y: 15};
    const createScaleSpy = spyOn(service, 'createNewScale').and.returnValue(scaleValues);
    const translateValues = {x: 30, y: -120};
    const createTranslateSpy = spyOn(service, 'createNewTranslate').and.returnValue(translateValues);
    expect(service.createNewTransformMatrix(FAKE_RECTANGLE, FAKE_POINT, ResizeState.top, FAKE_POINT)).toEqual('matrix(10,0,0,15,30,-120) ');
    expect(setRectSpy).toHaveBeenCalled();
    expect(createScaleSpy).toHaveBeenCalled();
    expect(createTranslateSpy).toHaveBeenCalled();
  });

  it('createNewScale should create new scale values based on bottom ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    const newScale = service.createNewScale(ResizeState.bottom, FAKE_POINT, FAKE_RECTANGLE, secondFakePoint);
    expect(newScale.x).toBe(1);
    expect(newScale.y).toBe((FAKE_POINT.y - FAKE_RECTANGLE.value.origin.y) / (secondFakePoint.y - FAKE_RECTANGLE.value.origin.y));
  });

  it('createNewScale should create new scale values based on bottomLeft ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    (service as any).initialRectDimension = FAKE_DIMENSION;
    const newScale = service.createNewScale(ResizeState.bottomLeft, FAKE_POINT, FAKE_RECTANGLE, secondFakePoint);
    expect(newScale.x).toBe((secondFakePoint.x - FAKE_POINT.x + FAKE_DIMENSION.width) / (FAKE_DIMENSION.width));
    expect(newScale.y).toBe((FAKE_POINT.y - FAKE_RECTANGLE.value.origin.y) / (secondFakePoint.y - FAKE_RECTANGLE.value.origin.y));
  });

  it('createNewScale should create new scale values based on bottomRight ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    const newScale = service.createNewScale(ResizeState.bottomRight, FAKE_POINT, FAKE_RECTANGLE, secondFakePoint);
    expect(newScale.x).toBe((FAKE_POINT.x - FAKE_RECTANGLE.value.origin.x) / (secondFakePoint.x - FAKE_RECTANGLE.value.origin.x));
    expect(newScale.y).toBe((FAKE_POINT.y - FAKE_RECTANGLE.value.origin.y) / (secondFakePoint.y - FAKE_RECTANGLE.value.origin.y));
  });

  it('createNewScale should create new scale values based on top ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    (service as any).initialRectDimension = FAKE_DIMENSION;
    const newScale = service.createNewScale(ResizeState.top, FAKE_POINT, FAKE_RECTANGLE, secondFakePoint);
    expect(newScale.x).toBe(1);
    expect(newScale.y).toBe((secondFakePoint.y - FAKE_POINT.y + FAKE_DIMENSION.height) / (FAKE_DIMENSION.height));
  });

  it('createNewScale should create new scale values based on topLeft ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    (service as any).initialRectDimension = FAKE_DIMENSION;
    const newScale = service.createNewScale(ResizeState.topLeft, FAKE_POINT, FAKE_RECTANGLE, secondFakePoint);
    expect(newScale.x).toBe((secondFakePoint.x - FAKE_POINT.x + FAKE_DIMENSION.width) / (FAKE_DIMENSION.width));
    expect(newScale.y).toBe((secondFakePoint.y - FAKE_POINT.y + FAKE_DIMENSION.height) / (FAKE_DIMENSION.height));
  });

  it('createNewScale should create new scale values based on topRight ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    (service as any).initialRectDimension = FAKE_DIMENSION;
    const newScale = service.createNewScale(ResizeState.topRight, FAKE_POINT, FAKE_RECTANGLE, secondFakePoint);
    expect(newScale.x).toBe((FAKE_POINT.x - FAKE_RECTANGLE.value.origin.x) / (secondFakePoint.x - FAKE_RECTANGLE.value.origin.x));
    expect(newScale.y).toBe((secondFakePoint.y - FAKE_POINT.y + FAKE_DIMENSION.height) / (FAKE_DIMENSION.height));
  });

  it('createNewScale should create new scale values based on left ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    (service as any).initialRectDimension = FAKE_DIMENSION;
    const newScale = service.createNewScale(ResizeState.left, FAKE_POINT, FAKE_RECTANGLE, secondFakePoint);
    expect(newScale.x).toBe((secondFakePoint.x - FAKE_POINT.x + FAKE_DIMENSION.width) / (FAKE_DIMENSION.width));
    expect(newScale.y).toBe(1);
  });

  it('createNewScale should create new scale values based on right ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    const newScale = service.createNewScale(ResizeState.right, FAKE_POINT, FAKE_RECTANGLE, secondFakePoint);
    expect(newScale.x).toBe((FAKE_POINT.x - FAKE_RECTANGLE.value.origin.x) / (secondFakePoint.x - FAKE_RECTANGLE.value.origin.x));
    expect(newScale.y).toBe(1);
  });

  it('createNewScale should call setSquaredSelection on shift key and create new scale values based on right ResizeState', () => {
    const secondFakePoint = {x: 10, y: 10};
    const setSquareSpy = spyOn(service, 'setSquaredSelection').and.returnValue(secondFakePoint);
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    fakeRectangle.key.shift = true;
    const newScale = service.createNewScale(ResizeState.none, FAKE_POINT, fakeRectangle, secondFakePoint);
    fakeRectangle.key.shift = false;
    expect(newScale.x).toBe(secondFakePoint.x);
    expect(newScale.y).toBe(secondFakePoint.y);
    expect(setSquareSpy).toHaveBeenCalled();
  });

  it('createNewRectReferencePoint should create reference base on selectionRectangle and ResizeState.top', () => {
    const newRefPoint = service.createNewRectReferencePoint(ResizeState.top, FAKE_RECTANGLE);
    expect(newRefPoint.x).toBe(FAKE_RECTANGLE.value.origin.x);
    expect(newRefPoint.y).toBe(FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height);
  });

  it('createNewRectReferencePoint should create reference base on selectionRectangle and ResizeState.topLeft', () => {
    const newRefPoint = service.createNewRectReferencePoint(ResizeState.topLeft, FAKE_RECTANGLE);
    expect(newRefPoint.x).toBe(FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width);
    expect(newRefPoint.y).toBe(FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height);
  });

  it('createNewRectReferencePoint should create reference base on selectionRectangle and ResizeState.topRight', () => {
    const newRefPoint = service.createNewRectReferencePoint(ResizeState.topRight, FAKE_RECTANGLE);
    expect(newRefPoint.x).toBe(FAKE_RECTANGLE.value.origin.x);
    expect(newRefPoint.y).toBe(FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height);
  });

  it('createNewRectReferencePoint should create reference base on selectionRectangle and ResizeState.right', () => {
    const newRefPoint = service.createNewRectReferencePoint(ResizeState.right, FAKE_RECTANGLE);
    expect(newRefPoint.x).toBe(FAKE_RECTANGLE.value.origin.x);
    expect(newRefPoint.y).toBe(FAKE_RECTANGLE.value.origin.y);
  });

  it('createNewRectReferencePoint should create reference base on selectionRectangle and ResizeState.bottomRight', () => {
    const newRefPoint = service.createNewRectReferencePoint(ResizeState.bottomRight, FAKE_RECTANGLE);
    expect(newRefPoint.x).toBe(FAKE_RECTANGLE.value.origin.x);
    expect(newRefPoint.y).toBe(FAKE_RECTANGLE.value.origin.y);
  });

  it('createNewRectReferencePoint should create reference base on selectionRectangle and ResizeState.bottom', () => {
    const newRefPoint = service.createNewRectReferencePoint(ResizeState.bottom, FAKE_RECTANGLE);
    expect(newRefPoint.x).toBe(FAKE_RECTANGLE.value.origin.x);
    expect(newRefPoint.y).toBe(FAKE_RECTANGLE.value.origin.y);
  });

  it('createNewRectReferencePoint should create reference base on selectionRectangle and ResizeState.bottomLeft', () => {
    const newRefPoint = service.createNewRectReferencePoint(ResizeState.bottomLeft, FAKE_RECTANGLE);
    expect(newRefPoint.x).toBe(FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width);
    expect(newRefPoint.y).toBe(FAKE_RECTANGLE.value.origin.y);
  });

  it('createNewRectReferencePoint should create reference base on selectionRectangle and ResizeState.left', () => {
    const newRefPoint = service.createNewRectReferencePoint(ResizeState.left, FAKE_RECTANGLE);
    expect(newRefPoint.x).toBe(FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width);
    expect(newRefPoint.y).toBe(FAKE_RECTANGLE.value.origin.y);
  });

  it('createNewTranslate should create new translate value base on selectRect ref point and scale value', () => {
    const createRefSpy = spyOn(service, 'createNewRectReferencePoint').and.returnValue(FAKE_POINT);
    const secondFakePoint = {x: 10, y: 10};
    const returnValue = service.createNewTranslate(ResizeState.top, FAKE_RECTANGLE, secondFakePoint);
    expect(returnValue.x).toEqual(-FAKE_POINT.x * (secondFakePoint.x - 1));
    expect(returnValue.y).toEqual(-FAKE_POINT.y * (secondFakePoint.y - 1));
    expect(createRefSpy).toHaveBeenCalled();
  });

  it('createNewTranslate should create different translate value base on selectRect ref point and scale value', () => {
    const createRefSpy = spyOn(service, 'createNewRectReferencePoint').and.returnValue(FAKE_POINT);
    const secondFakePoint = {x: 10, y: 10};
    (service as any).initialRectDimension = FAKE_DIMENSION;
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    fakeRectangle.key.altKey = true;
    const returnValue = service.createNewTranslate(ResizeState.top, fakeRectangle, secondFakePoint);
    fakeRectangle.key.altKey = false;
    expect(returnValue.x).toEqual((-FAKE_POINT.x - FAKE_DIMENSION.width / 2) * (secondFakePoint.x - 1));
    expect(returnValue.y).toEqual((-FAKE_POINT.y - FAKE_DIMENSION.height / 2) * (secondFakePoint.y - 1));
    expect(createRefSpy).toHaveBeenCalled();
  });

  it('setSelectRectangleNewDimension should set selectionRectangle dimension based on ResizeState.top', () => {
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    service.setSelectRectangleNewDimension(ResizeState.top, fakeRectangle, FAKE_POINT);
    expect(fakeRectangle.value.height).toBe(FAKE_RECTANGLE.value.height + FAKE_RECTANGLE.value.origin.y - FAKE_POINT.y);
    expect(fakeRectangle.value.origin.y).toBe(FAKE_POINT.y);
  });

  it('setSelectRectangleNewDimension should set selectionRectangle dimension based on ResizeState.topLeft', () => {
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    service.setSelectRectangleNewDimension(ResizeState.topLeft, fakeRectangle, FAKE_POINT);
    expect(fakeRectangle.value.height).toBe(FAKE_RECTANGLE.value.height + FAKE_RECTANGLE.value.origin.y - FAKE_POINT.y);
    expect(fakeRectangle.value.width).toBe(FAKE_RECTANGLE.value.width + FAKE_RECTANGLE.value.origin.x - FAKE_POINT.x);
    expect(fakeRectangle.value.origin.x).toBe(FAKE_POINT.x);
    expect(fakeRectangle.value.origin.y).toBe(FAKE_POINT.y);
  });

  it('setSelectRectangleNewDimension should set selectionRectangle dimension based on ResizeState.topRight', () => {
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    service.setSelectRectangleNewDimension(ResizeState.topRight, fakeRectangle, FAKE_POINT);
    expect(fakeRectangle.value.height).toBe(FAKE_RECTANGLE.value.height + FAKE_RECTANGLE.value.origin.y - FAKE_POINT.y);
    expect(fakeRectangle.value.width).toBe(FAKE_POINT.x - FAKE_RECTANGLE.value.origin.x);
    expect(fakeRectangle.value.origin.y).toBe(FAKE_POINT.y);
  });

  it('setSelectRectangleNewDimension should set selectionRectangle dimension based on ResizeState.right', () => {
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    service.setSelectRectangleNewDimension(ResizeState.right, fakeRectangle, FAKE_POINT);
    expect(fakeRectangle.value.width).toBe(FAKE_POINT.x - FAKE_RECTANGLE.value.origin.x);
  });

  it('setSelectRectangleNewDimension should set selectionRectangle dimension based on ResizeState.bottomRight', () => {
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    service.setSelectRectangleNewDimension(ResizeState.bottomRight, fakeRectangle, FAKE_POINT);
    expect(fakeRectangle.value.height).toBe(FAKE_POINT.y - FAKE_RECTANGLE.value.origin.y);
    expect(fakeRectangle.value.width).toBe(FAKE_POINT.x - FAKE_RECTANGLE.value.origin.x);
  });

  it('setSelectRectangleNewDimension should set selectionRectangle dimension based on ResizeState.bottom', () => {
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    service.setSelectRectangleNewDimension(ResizeState.bottom, fakeRectangle, FAKE_POINT);
    expect(fakeRectangle.value.height).toBe(FAKE_POINT.y - FAKE_RECTANGLE.value.origin.y);
  });

  it('setSelectRectangleNewDimension should set selectionRectangle dimension based on ResizeState.bottomLeft', () => {
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    service.setSelectRectangleNewDimension(ResizeState.bottomLeft, fakeRectangle, FAKE_POINT);
    expect(fakeRectangle.value.width).toBe(FAKE_RECTANGLE.value.width + FAKE_RECTANGLE.value.origin.x - FAKE_POINT.x);
    expect(fakeRectangle.value.height).toBe(FAKE_POINT.y - FAKE_RECTANGLE.value.origin.y);
    expect(fakeRectangle.value.origin.x).toBe(FAKE_POINT.x);
  });

  it('setSelectRectangleNewDimension should set selectionRectangle dimension based on ResizeState.left', () => {
    const fakeRectangle = Object.assign({}, FAKE_RECTANGLE);
    service.setSelectRectangleNewDimension(ResizeState.left, fakeRectangle, FAKE_POINT);
    expect(fakeRectangle.value.width).toBe(FAKE_RECTANGLE.value.width + FAKE_RECTANGLE.value.origin.x - FAKE_POINT.x);
    expect(fakeRectangle.value.origin.x).toBe(FAKE_POINT.x);
  });

  it('setSquaredSelection should return scale value with the same max value for x and y', () => {
    expect(service.setSquaredSelection({x: 10, y: 15})).toEqual({x: 15, y: 15});
  });

  it('setDrawingElementScaleValue should set new matrix value to the specific drawing element', () => {
    const setSpy = spyOn(service, 'setTransformAttribute');
    service.transformIterator = 0;
    service.initialTransformValues = ['fake transform 1'];
    service.setDrawingElementScaleValue({ref: new MockElementRef()}, 'fake transform 2 ');
    expect(setSpy).toHaveBeenCalledWith(new MockElementRef() , 'fake transform 2 fake transform 1');
  });

  it('resetAdditionnalAttribute should set initialRectDimension to default value', () => {
    (service as any).initialRectDimension = FAKE_DIMENSION;
    service.resetAdditionnalAttribute();
    expect((service as any).initialRectDimension).toEqual({width: 0, height: 0});
  });
});
