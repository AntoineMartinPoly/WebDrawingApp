import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MockElementRef, PRIMARY_COLOR } from 'src/constant/constant';
import { BRUSH_OPTION_THICKNESS } from 'src/constant/storage/constant';
import { FILTER, ORIGIN_TAG, PATH_ATTRIBUTE, SPACE, STROKE, STROKE_WIDTH } from 'src/constant/svg/constant';
import { TEST_POINT } from 'src/constant/tool-service/constant';
import { Brush, PatternType } from 'src/interface/trace/brush';
import { BrushService } from './brush.service';

describe('BrushService', () => {

  let service: BrushService;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService, Renderer2],
    });
    service = TestBed.get(BrushService);
    storage = TestBed.get(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateBrushElement should call drawing service generateSVGElement / addSVGElementFromRef', () => {
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const SVGSpy = spyOn(service.drawingService, 'addSVGToSVG');
    service.generateBrushElement();
    expect(addSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenCalled();
    expect(SVGSpy).toHaveBeenCalled();
  });

  it('createBrushFromSVGElement should should create a Brush object or return null if element is not for brush', () => {
    const fakeBrushElement: ElementRef = new MockElementRef();
    (fakeBrushElement as any).children = [''];
    const getSVGAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    getSVGAttributeSpy.withArgs(fakeBrushElement, FILTER, false).and.returnValue(true);
    getSVGAttributeSpy.withArgs('', PATH_ATTRIBUTE).and.returnValue('P');
    getSVGAttributeSpy.withArgs(fakeBrushElement, STROKE_WIDTH).and.returnValue('2');
    getSVGAttributeSpy.withArgs(fakeBrushElement, STROKE).and.returnValue('black');
    const brush = service.createBrushFromSVGElement(fakeBrushElement);
    expect(brush.path).toMatch('P');
    expect(brush.thickness).toBe(2);
    expect(brush.pattern).toBe('');
    expect(brush.color).toMatch('black');
    expect(getSVGAttributeSpy).toHaveBeenCalledTimes(3);
  });

  it('createBrush should call drawing service getRelativeCoordinates and return brush with right value', () => {
    const coordSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue(TEST_POINT);
    const addOptionsSpy = spyOn(service, 'addBrushOption');
    const mockMouseClick = { x: 0, y: 0 } as MouseEvent;
    storage.set(BRUSH_OPTION_THICKNESS, '22');
    const brush = service.createBrush(new MockElementRef(), mockMouseClick);
    expect(coordSpy).toHaveBeenCalled();
    expect(addOptionsSpy).toHaveBeenCalled();
    expect(brush.path).toBe(ORIGIN_TAG + TEST_POINT.x.toString() + SPACE + TEST_POINT.y.toString());
    expect(brush.thickness).toBe(22);
    expect(brush.color).toBe(storage.get(PRIMARY_COLOR));
  });

  it('addBrushOption should call setSVGattribute 4 times', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const FAKE_BRUSH: Brush = { path: '', pattern: 'Blur' as PatternType, thickness: 2, color: 'black', ref: {children: ['asd']} };
    service.addBrushOption(FAKE_BRUSH);
    expect(setSpy).toHaveBeenCalledTimes(4);
  });

  it('updatePath should update path', () => {
    const updateSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue(TEST_POINT);
    const mockMouseClick = { x: 0, y: 0 } as MouseEvent;
    const fakeBrush: Brush = { path: '', pattern: 'Blur' as PatternType, thickness: 2, color: 'black', ref: new MockElementRef() };
    service.updatePath(fakeBrush, mockMouseClick);
    expect(updateSpy).toHaveBeenCalled();
    expect(fakeBrush.path).toBe(' L 10 7');
    expect(fakeBrush.thickness).toBe(2);
    expect(fakeBrush.color).toBe('black');
  });

  it('editBrush should call setSVGattribute to modify brush line element 8 times', () => {
    const updateSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeBrush: Brush = { path: '', pattern: 'Blur' as PatternType, thickness: 2, color: 'black', ref: {children: ['asd']} };
    service.editBrushPath(fakeBrush);
    expect(updateSpy).toHaveBeenCalledTimes(4);
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const fakeBrush: Brush = { path: '', pattern: 'Blur' as PatternType, thickness: 2, color: 'black', ref: {children: ['asd']} };
    service.removeElement(fakeBrush);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef and appendObject', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const fakeBrush: Brush = { path: '', pattern: 'Blur' as PatternType, thickness: 2, color: 'black', ref: {children: ['asd']} };
    service.reAddElement(fakeBrush);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });
});
