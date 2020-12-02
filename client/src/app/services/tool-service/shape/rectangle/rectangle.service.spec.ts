import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DECIMAL, MockElementRef, PRIMARY_COLOR, SECONDARY_COLOR } from 'src/constant/constant';
import { RECTANGLE_OPTION_CONTOUR, RECTANGLE_OPTION_TRACE } from 'src/constant/storage/constant';
import { CONTOUR, FULL, FULL_WITH_CONTOUR } from 'src/constant/toolbar/shape/constant';
import { FAKE_RECTANGLE, FAKE_RECTANGLE_VALUE } from 'src/constant/toolbar/shape/rectangle/constant';
import { Point } from 'src/interface/Point';
import { Rectangle, RectangleOptions, RectangleValues } from 'src/interface/shape/rectangle';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {

  let service: RectangleService;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ Renderer2 ],
    });

    service = TestBed.get(RectangleService);
    storage = TestBed.get(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createRectangleFromSVGElement should create a rectangle object, call getSVGElementAttributes and defineRectangleOption', () => {
    const fakeRectangleElement: MockElementRef = new MockElementRef();
    (fakeRectangleElement as any).children = [''];
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    const getSVGAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    const optionSpy: jasmine.Spy = spyOn(service, 'defineRectangleOption').and.returnValue(fakeRectangle.option);
    getSVGAttributeSpy.withArgs('', 'x').and.returnValue(fakeRectangle.value.origin.x.toString());
    getSVGAttributeSpy.withArgs('', 'y').and.returnValue(fakeRectangle.value.origin.y.toString());
    getSVGAttributeSpy.withArgs('', 'height').and.returnValue(fakeRectangle.value.height.toString());
    getSVGAttributeSpy.withArgs('', 'width').and.returnValue(fakeRectangle.value.width.toString());
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'fill', false).and.returnValue(true);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'fill').and.returnValue(fakeRectangle.color.fill);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'stroke', false).and.returnValue(true);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'stroke').and.returnValue(fakeRectangle.color.contour);
    let rectangle: Rectangle = service.createRectangleFromSVGElement(fakeRectangleElement);
    expect(rectangle.option).toEqual(fakeRectangle.option);
    expect(rectangle.key).toEqual(fakeRectangle.key);
    expect(rectangle.value).toEqual(fakeRectangle.value);
    expect(optionSpy).toHaveBeenCalled();
    expect(getSVGAttributeSpy).toHaveBeenCalledTimes(8);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'fill', false).and.returnValue(false);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'stroke', false).and.returnValue(false);
    rectangle = service.createRectangleFromSVGElement(fakeRectangleElement);
    expect(rectangle.color.fill).toMatch('');
    expect(rectangle.color.contour).toMatch('');
  });

  it('defineRectangleOption should return right option value for the rectangle', () => {
    const fakeRectangleElement: ElementRef = new MockElementRef();
    let fakeRectangleOptions: RectangleOptions = {
      traceType: CONTOUR,
      contourThickness: 4,
    };
    const getSVGAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'fill-opacity', false).and.returnValue(true);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'stroke-width').and.returnValue('4');
    let rectangleOption: RectangleOptions = service.defineRectangleOption(fakeRectangleElement);
    expect(rectangleOption).toEqual(fakeRectangleOptions);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'fill-opacity', false).and.returnValue(false);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'stroke-opacity', false).and.returnValue(true);
    fakeRectangleOptions = {
      traceType: FULL,
      contourThickness: 0,
    };
    rectangleOption = service.defineRectangleOption(fakeRectangleElement);
    expect(rectangleOption).toEqual(fakeRectangleOptions);
    getSVGAttributeSpy.withArgs(fakeRectangleElement, 'stroke-opacity', false).and.returnValue(false);
    fakeRectangleOptions = {
      traceType: FULL_WITH_CONTOUR,
      contourThickness: 4,
    };
    rectangleOption = service.defineRectangleOption(fakeRectangleElement);
    expect(rectangleOption).toEqual(fakeRectangleOptions);
  });

  it('generateRectangleElement should call generateSVGElement / addSVGElementFromRef / setSVGattribute / addSVGToSVG', () => {
    const genSpy: jasmine.Spy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy: jasmine.Spy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const SVGSpy: jasmine.Spy = spyOn(service.drawingService, 'addSVGToSVG');
    service.generateRectangleElement();
    expect(addSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenCalled();
    expect(SVGSpy).toHaveBeenCalled();
  });

  it('createRectangle should call getRelativeCoordinates / getRectangleOptions / getRectangleColors and return rectangle', () => {
    const getOptionSpy: jasmine.Spy = spyOn(service, 'getRectangleOptions').and.callThrough();
    const getColorSpy: jasmine.Spy = spyOn(service, 'getRectangleColors').and.callThrough();
    const addOptionSpy: jasmine.Spy = spyOn(service, 'addRectangleOption');
    const fakePoint = {x: 10, y: 7};
    const rectangle = service.createRectangle(new MockElementRef(), fakePoint);
    expect(getOptionSpy).toHaveBeenCalled();
    expect(getColorSpy).toHaveBeenCalled();
    expect(addOptionSpy).toHaveBeenCalled();
    expect(rectangle.value.origin).toEqual(fakePoint);
    expect(rectangle.value.height).toBe(0);
    expect(rectangle.value.width).toBe(0);
    expect(rectangle.option).toEqual(service.getRectangleOptions());
    expect(rectangle.color).toEqual(service.getRectangleColors());
    expect(rectangle.key.shift).toBe(false);
  });

  it('getRectangleOptions should return rectangles option and call storage function get', () => {
    const getSpy: jasmine.Spy = spyOn(storage, 'get').and.callThrough();
    expect(service.getRectangleOptions()).toEqual({
      traceType: storage.get(RECTANGLE_OPTION_TRACE),
      contourThickness: parseInt(storage.get(RECTANGLE_OPTION_CONTOUR), DECIMAL),
    });
    expect(getSpy).toHaveBeenCalledTimes(4);
  });

  it('getRectangleColors should return rectangles option and call storage function get', () => {
    const getSpy: jasmine.Spy = spyOn(storage, 'get').and.callThrough();
    expect(service.getRectangleColors()).toEqual({
      fill: storage.get(PRIMARY_COLOR),
      contour: storage.get(SECONDARY_COLOR),
    });
    expect(getSpy).toHaveBeenCalledTimes(4);
  });

  it('updateValues should update rectangles value and call getRelativeCoordinates', () => {
    const fakePoint: Point = {x: 7, y: 10};
    const rectangleValue: RectangleValues = FAKE_RECTANGLE_VALUE;
    service.updateValues(rectangleValue, fakePoint, {shift: false});
    expect(rectangleValue.height).toBe(10);
    expect(rectangleValue.width).toBe(7);
  });

  it('updateValues should update rectangles value with identical height and width if shift key is pressed', () => {
    const fakePoint: Point = {x: 10, y: 7};
    const fakeRectangleValue: RectangleValues = FAKE_RECTANGLE_VALUE;
    service.updateValues(fakeRectangleValue, fakePoint, {shift: true});
    expect(fakeRectangleValue.height).toBe(7);
    expect(fakeRectangleValue.width).toBe(7);
  });

  it('addRectangleOption should setSVGattribute x amount of type depending on the option', () => {
    const setSVGSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    fakeRectangle.option.traceType = CONTOUR;
    service.addRectangleOption(fakeRectangle);
    expect(setSVGSpy).toHaveBeenCalledTimes(4);
    setSVGSpy.calls.reset();
    fakeRectangle.option.traceType = FULL;
    service.addRectangleOption(fakeRectangle);
    expect(setSVGSpy).toHaveBeenCalledTimes(2);
    setSVGSpy.calls.reset();
    fakeRectangle.option.traceType = FULL_WITH_CONTOUR;
    service.addRectangleOption(fakeRectangle);
    expect(setSVGSpy).toHaveBeenCalledTimes(3);
    setSVGSpy.calls.reset();
    fakeRectangle.option.traceType = '';
    service.addRectangleOption(fakeRectangle);
    expect(setSVGSpy).not.toHaveBeenCalled();
  });

  it('editRectangle should call setSVGattribute to modify rectangle height/width element 4 times', () => {
    const updateSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    fakeRectangle.ref = {children: ['asd']};
    service.editRectangle(fakeRectangle);
    expect(updateSpy).toHaveBeenCalledTimes(4);
  });

  it('editRectangle should call setSVGattribute to modify rectangle height/width element 4 times', () => {
    const updateSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    fakeRectangle.ref = {children: ['asd']};
    fakeRectangle.value.height = -5;
    fakeRectangle.value.width = -5;
    service.editRectangle(fakeRectangle);
    expect(updateSpy).toHaveBeenCalledTimes(4);
  });

  it('editRectangle should call setSVGattribute to modify rectangle height/width element 4 times', () => {
    const updateSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    fakeRectangle.ref = {children: ['asd']};
    fakeRectangle.value.height = 5;
    fakeRectangle.value.width = 5;
    service.editRectangle(fakeRectangle);
    expect(updateSpy).toHaveBeenCalledTimes(4);
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    service.removeElement(fakeRectangle);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef and appendObject', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    service.reAddElement(fakeRectangle);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });

});
