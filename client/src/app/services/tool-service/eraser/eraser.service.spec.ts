import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/shape/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { EraserService } from './eraser.service';

describe('EraserService', () => {

  let service: EraserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(EraserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('erase should call removedContourElement, removeSVGElementFromRef from DrawingService', () => {
    const removeSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const removeContourSpy: jasmine.Spy = spyOn(service, 'removedContourElement');
    const removeManager: jasmine.Spy = spyOn(service.drawingElementManager, 'removeDrawingElement');
    service.erase({ref: new MockElementRef()});
    expect(removeSVGSpy).toHaveBeenCalled();
    expect(removeContourSpy).toHaveBeenCalled();
    expect(removeManager).toHaveBeenCalled();
  });

  it('surroundRed should generate a new element and set his attribute the same as the element clicked expect two', () => {
    const generateSpy: jasmine.Spy = spyOn(service.drawingService, 'generateSVGElement');
    const insertBeforeSpy: jasmine.Spy = spyOn(service.drawingService, 'insertBeforeSVGElement');
    const setAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const getParentSpy: jasmine.Spy = spyOn(service.drawingService, 'getParentSVG');
    const setAllAttributesSpy: jasmine.Spy = spyOn(service, 'setAllAttributes');
    const getContourWidthSpy: jasmine.Spy = spyOn(service, 'getContourStrokeWidth');
    generateSpy.and.returnValue(0);
    service.lastSVGElement = {ref: 123};
    service.surroundRed({ref: 'asd'});
    expect(generateSpy).toHaveBeenCalled();
    expect(insertBeforeSpy).toHaveBeenCalled();
    expect(getParentSpy).toHaveBeenCalledTimes(3);
    expect(setAllAttributesSpy).toHaveBeenCalledTimes(2);
    expect(getContourWidthSpy).toHaveBeenCalled();
    expect(setAttributeSpy).toHaveBeenCalledTimes(4);
    expect(service.lastSVGElement).toEqual({ref: 'asd'});
  });

  it('surroundRed should do nothing if it is the same DrawingElement as the last event', () => {
    const generateSpy: jasmine.Spy = spyOn(service.drawingService, 'generateSVGElement');
    const insertBeforeSpy: jasmine.Spy = spyOn(service.drawingService, 'insertBeforeSVGElement');
    const setAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const getParentSpy: jasmine.Spy = spyOn(service.drawingService, 'getParentSVG');
    const setAllAttributesSpy: jasmine.Spy = spyOn(service, 'setAllAttributes');
    const getContourWidthSpy: jasmine.Spy = spyOn(service, 'getContourStrokeWidth');
    const drawingElement = {ref: 123};
    service.lastSVGElement = drawingElement;
    service.surroundRed(drawingElement);
    expect(generateSpy).not.toHaveBeenCalled();
    expect(insertBeforeSpy).not.toHaveBeenCalled();
    expect(getParentSpy).not.toHaveBeenCalled();
    expect(setAllAttributesSpy).not.toHaveBeenCalled();
    expect(getContourWidthSpy).not.toHaveBeenCalled();
    expect(setAttributeSpy).not.toHaveBeenCalled();
  });

  it('getContourStrokeWidth should return  10 if no stroke-width attribute was found', () => {
    expect(service.getContourStrokeWidth({attributes: ['asd', 123]})).toBe('10');
  });

  it('getContourStrokeWidth should return stroke-width + 10 if a stroke-width attribute was found', () => {
    expect(service.getContourStrokeWidth({attributes: ['asd', {name: 'stroke-width', value: '10'}]})).toBe('20');
  });

  it('removedContourElement should remove contourElement if it exist', () => {
    const removeSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    service.contourElement = {};
    service.removedContourElement();
    expect(removeSVGSpy).toHaveBeenCalled();
  });

  it('removedContourElement should do nothing if contourElement does not exist', () => {
    const removeSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    service.contourElement = 0;
    service.removedContourElement();
    expect(removeSVGSpy).not.toHaveBeenCalled();
  });

  it('setAllAttributes should call setAttribute of DrawingService for every attributes', () => {
    const setAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    service.setAllAttributes({attributes: ['asd', 123]}, {});
    expect(setAttributeSpy).toHaveBeenCalledTimes(2);
  });

  it('generateCursor should generate a new SVG element if the cursor is not initated yet', () => {
    const generateSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'generateSVGElement');
    const addSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const setDiameterSpy: jasmine.Spy = spyOn(service, 'setCursorDiameter');
    const getRelativeSpy: jasmine.Spy = spyOn(service.drawingService, 'getRelativeCoordinates');

    generateSVGSpy.and.returnValue({});
    getRelativeSpy.and.returnValue({x: 10, y: 10});
    service.cursorExist = false;

    service.generateCursor(new MouseEvent('click'));

    expect(setAttributeSpy).toHaveBeenCalledTimes(6);
    expect(service.cursorExist).toBe(true);
    expect(addSVGSpy).toHaveBeenCalled();
    expect(setDiameterSpy).toHaveBeenCalled();
    expect(getRelativeSpy).toHaveBeenCalled();
  });

  it('generateCursor should update existing SVG element if the cursor is initated', () => {
    const setAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const getRelativeSpy: jasmine.Spy = spyOn(service.drawingService, 'getRelativeCoordinates');

    getRelativeSpy.and.returnValue({x: 10, y: 10});
    service.cursorExist = true;

    service.generateCursor(new MouseEvent('click'));

    expect(setAttributeSpy).toHaveBeenCalledTimes(2);
    expect(service.cursorExist).toBe(true);
    expect(getRelativeSpy).toHaveBeenCalled();
  });

  it('setCursorDiameter should call setAttribute of DrawingService two times', () => {
    const setAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    service.setCursorDiameter('10');
    expect(setAttributeSpy).toHaveBeenCalledTimes(2);
  });

  it('removeCursor should call removeSVGElementFromRef of DrawingService and set cursorExist to false', () => {
    const removeSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    service.cursorExist = true;
    service.removeCursor();
    expect(removeSVGSpy).toHaveBeenCalled();
    expect(service.cursorExist).toBe(false);
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const fakeElementList: DrawingElement[] = [
      {ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()},
    ];
    service.removeElement(fakeElementList);
    expect(removeSpy).toHaveBeenCalledTimes(3);
  });

  it('reAddDeletedElement should call addSVGElementFromRef and appendObject', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const fakeElementList: DrawingElement[] = [
      {ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()},
    ];
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    service.reAddDeletedElement(fakeElementList);
    expect(addSpy).toHaveBeenCalledTimes(3);
    expect(appendSpy).toHaveBeenCalledTimes(3);
  });
});
