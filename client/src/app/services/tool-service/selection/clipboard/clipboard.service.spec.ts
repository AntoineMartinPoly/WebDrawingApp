import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { DEFAULT_PASTE_OFFSET } from 'src/constant/toolbar/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {

  let service: ClipboardService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(ClipboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('copy should set copiedDrawingElements with DrawingElement in paremeter and set offset to defaut', () => {
    const newDrawingElements = [{ref: 'asd'}, {ref: 123}] as DrawingElement[];
    service.copy(newDrawingElements);
    expect((service as any).copiedDrawingElements).toBe(newDrawingElements);
    expect((service as any).offsetX).toBe(DEFAULT_PASTE_OFFSET);
    expect((service as any).offsetY).toBe(DEFAULT_PASTE_OFFSET);
  });

  it('cut should do nothing if no DrawingElement was passed in paremeter', () => {
    const removeSpy = spyOn(service, 'removeDrawingElementsFromDrawing');
    const assignSpy = spyOn(Object, 'assign');
    const fakeDrawingElements = [] as DrawingElement[];
    const returnValue = service.cut(fakeDrawingElements);
    expect(removeSpy).not.toHaveBeenCalled();
    expect(assignSpy).not.toHaveBeenCalled();
    expect(returnValue).toBe(false);
  });

  it('cut should reset offset, set copiedDrawingElements and remove element from drawing', () => {
    const removeSpy = spyOn(service, 'removeDrawingElementsFromDrawing');
    const assignSpy = spyOn(Object, 'assign');
    const fakeDrawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}];
    const returnValue = service.cut(fakeDrawingElements);
    expect(removeSpy).toHaveBeenCalled();
    expect(assignSpy).toHaveBeenCalled();
    expect(returnValue).toBe(true);
  });

  it('paste should clone DrawingElements and resetOffsetAndPaste elements are clone outside the drawing', () => {
    const cloneSpy = spyOn(service, 'cloneNewDrawingElement').and.returnValue({ref: new MockElementRef()});
    const isElementInDrawingSpy = spyOn(service, 'isDrawingElementInDrawing').and.returnValue(false);
    const resetSpy = spyOn(service, 'resetOffsetAndPaste');
    const addSpy = spyOn(service.drawingElementManager, 'appendDrawingElements');
    (service as any).copiedDrawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}];
    service.paste();
    expect(cloneSpy).toHaveBeenCalled();
    expect(isElementInDrawingSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    (service as any).copiedDrawingElements = [];
    expect(service.paste()).toEqual([]);
  });

  it('paste should only clone DrawingElements if there are copiedDrawingElements and they are clone inside the drawing', () => {
    const cloneSpy = spyOn(service, 'cloneNewDrawingElement').and.returnValue({ref: new MockElementRef()});
    const isElementInDrawingSpy = spyOn(service, 'isDrawingElementInDrawing').and.returnValue(true);
    const resetSpy = spyOn(service, 'resetOffsetAndPaste');
    const addSpy = spyOn(service.drawingElementManager, 'appendDrawingElements');
    (service as any).copiedDrawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}];
    service.paste();
    expect(cloneSpy).toHaveBeenCalled();
    expect(isElementInDrawingSpy).toHaveBeenCalled();
    expect(resetSpy).not.toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
  });

  it('duplicate should only clone DrawingElements if there are copiedDrawingElements and they are clone inside the drawing', () => {
    const cloneSpy = spyOn(service, 'cloneNewDrawingElement').and.returnValue({ref: new MockElementRef()});
    const addSpy = spyOn(service.drawingElementManager, 'appendDrawingElements');
    const fakeDrawingElements = [{ref: new MockElementRef()}, {ref: new MockElementRef()}];
    (service as any).offsetX = 40;
    (service as any).offsetY = 40;
    service.duplicate(fakeDrawingElements);
    expect(cloneSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect((service as any).offsetX).toBe(DEFAULT_PASTE_OFFSET);
    expect((service as any).offsetY).toBe(DEFAULT_PASTE_OFFSET);
  });

  it('duplicate should do nothing if no DrawingElement were passed in parameter', () => {
    const cloneSpy = spyOn(service, 'cloneNewDrawingElement').and.returnValue({ref: new MockElementRef()});
    const addSpy = spyOn(service.drawingElementManager, 'appendDrawingElements');
    const fakeDrawingElements: DrawingElement[] = [];
    (service as any).offsetX = 40;
    (service as any).offsetY = 40;
    service.duplicate(fakeDrawingElements);
    expect(cloneSpy).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
    expect((service as any).offsetX).not.toBe(DEFAULT_PASTE_OFFSET);
    expect((service as any).offsetY).not.toBe(DEFAULT_PASTE_OFFSET);
  });

  it('removeDrawingElementsFromDrawing should remove drawingElement from drawing and from ToolHandler', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const removeManagerSpy = spyOn(service.drawingElementManager, 'removeDrawingElement');
    const fakeDrawingElements: DrawingElement[] = [{ref: new MockElementRef()}, {ref: new MockElementRef()}];
    service.removeDrawingElementsFromDrawing(fakeDrawingElements);
    expect(removeSpy).toHaveBeenCalled();
    expect(removeManagerSpy).toHaveBeenCalled();
  });

  it('setAllAttributes should set attribute of second ref the same as first ref', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    service.setAllAttributes({attributes: ['asd', 123]}, {attributes: []});
    expect(setSpy).toHaveBeenCalledTimes(2);
  });

  it('cloneNewDrawingElement should set attribute of second ref the same as first ref', () => {
    const copySpy = spyOn(service, 'copyDrawingElement').and.returnValue({ref: new MockElementRef()});
    const setAllSpy = spyOn(service, 'setAllAttributes');
    const setTransformSpy = spyOn(service, 'setTransformAttribute');
    service.cloneNewDrawingElement({ref: new MockElementRef()});
    expect(copySpy).toHaveBeenCalled();
    expect(setAllSpy).toHaveBeenCalled();
    expect(setTransformSpy).toHaveBeenCalled();
  });

  it('copyDrawingElement should create a new copy of a DrawingElement and set all his attribute', () => {
    const setAllSpy = spyOn(service, 'setAllAttributes');
    const assignSpy = spyOn(Object, 'assign').and.returnValue({ref: {}});
    const generateSpy = spyOn(service.drawingService, 'generateSVGElement').and.returnValue({ref: {children: [123, 'asd']}});
    const addSVGSpy = spyOn(service.drawingService, 'addSVGToSVG');
    const addSVGFromRefSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    service.copyDrawingElement({ref: {children: [123, 'asd']}});
    expect(setAllSpy).toHaveBeenCalled();
    expect(assignSpy).toHaveBeenCalled();
    expect(generateSpy).toHaveBeenCalled();
    expect(addSVGSpy).toHaveBeenCalled();
    expect(addSVGFromRefSpy).toHaveBeenCalled();
  });

  it('resetOffsetAndPaste should reset offset if offset is not equal to default and call paste again', () => {
    const removeSpy = spyOn(service, 'removeDrawingElementsFromDrawing');
    const pasteSpy = spyOn(service, 'paste');
    (service as any).offsetX = 100;
    (service as any).offsetY = 100;
    service.resetOffsetAndPaste([{ref: 123}]);
    expect(removeSpy).toHaveBeenCalled();
    expect(pasteSpy).toHaveBeenCalled();
  });

  it('resetOffsetAndPaste should do nothing if offset is at default', () => {
    const removeSpy = spyOn(service, 'removeDrawingElementsFromDrawing');
    const pasteSpy = spyOn(service, 'paste');
    (service as any).offset = DEFAULT_PASTE_OFFSET;
    service.resetOffsetAndPaste([{ref: 123}]);
    expect(removeSpy).toHaveBeenCalled();
    expect(pasteSpy).not.toHaveBeenCalled();
  });

  it('reAddElements should call drawingService to add svg element', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    service.reAddElements([{ref: 123}]);
    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledTimes(1);
  });

  it('setTransformAttribute should set transform attribute with offset + transform value if an attribute transform was found', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const getSpy = spyOn(service.drawingService, 'getAttributeValueFromSVG');
    getSpy.and.returnValue('translate(50 50)');
    const fakeRef = new MockElementRef();
    service.setTransformAttribute({ref: fakeRef});
    expect(getSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
  });

  it('isDrawingElementInDrawing should return isInBoudingBox, call isInBoundingBox, getSVGBoundingBox and ', () => {
    const fakeDrawing: DrawingElement = {ref: new MockElementRef()};
    const getBoundingSpy: jasmine.Spy = spyOn(fakeDrawing.ref, 'getBoundingClientRect');
    const getSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGBoundingBox');
    const isInSpy: jasmine.Spy = spyOn(service, 'isInBoundingBox').and.returnValue(true);
    expect(service.isDrawingElementInDrawing(fakeDrawing)).toBe(true);
    expect(isInSpy).toHaveBeenCalled();
    expect(getBoundingSpy).toHaveBeenCalled();
    expect(getSVGSpy).toHaveBeenCalled();
  });

  it('isInBoundingBox should set transform attribute with offset if no transform attribute was found', () => {
    const fakeSelection: any = {
      x: 5, y: 5, height: 15, width: 15,
    };
    const fakeElementBox: any = {
      x: 10, y: 10, height: 5, width: 5,
    };
    expect(service.isInBoundingBox(fakeSelection, fakeElementBox)).toBe(true);
    fakeElementBox.height = 35;
    expect(service.isInBoundingBox(fakeSelection, fakeElementBox)).toBe(false);

  });
});
