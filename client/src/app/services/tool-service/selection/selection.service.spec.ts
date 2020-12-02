import { TestBed } from '@angular/core/testing';
import { FAKE_POINT, FAKE_RECTANGLE, MockElementRef
} from 'src/constant/shape/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { Rectangle, RectangleValues } from 'src/interface/shape/rectangle';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {

  let service: SelectionService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(SelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateSelectionElement should call generateRectangleElement', () => {
    const genSpy = spyOn(service.drawer, 'generateSelection');
    service.generateSelectionElement();
    expect(genSpy).toHaveBeenCalled();
  });

  it('removeOldSelectionElement should not call removeSVGElementFromRef if there is no selection', () => {
    const removeRefSpy = spyOn(service.drawer, 'removeRefFromDrawing');
    const removeCirclesSpy = spyOn(service.drawer, 'removeCircles');
    const observableSpy = spyOn((service as any).aDrawingElementIsSelected, 'next');
    delete(service.selectRectangle);
    service.removeOldSelectionElement();
    expect(removeRefSpy).not.toHaveBeenCalled();
    expect(removeCirclesSpy).not.toHaveBeenCalled();
    expect(observableSpy).toHaveBeenCalled();
  });

  it('removeOldSelectionElement should call removeSVGElementFromRef twice if selectRectangle is defined', () => {
    const removeRefSpy = spyOn(service.drawer, 'removeRefFromDrawing');
    const removeCirclesSpy = spyOn(service.drawer, 'removeCircles');
    const observableSpy = spyOn((service as any).aDrawingElementIsSelected, 'next');
    service.selectRectangle = {ref: {}} as Rectangle;
    service.removeOldSelectionElement();
    expect(removeRefSpy).toHaveBeenCalled();
    expect(removeCirclesSpy).toHaveBeenCalled();
    expect(observableSpy).toHaveBeenCalled();
  });

  it('createSelection should call getRelativeCoordinates addSelectionOption and set selectRectangle', () => {
    const genSpy = spyOn(service.drawer, 'getCoordinate').and.returnValue(FAKE_POINT);
    const createSpy = spyOn(service.drawer, 'createSelection');
    const optionSpy = spyOn(service, 'addSelectionOption');
    service.createSelection(new MockElementRef(), new MouseEvent('click'));
    expect(genSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(optionSpy).toHaveBeenCalled();
  });

  it('addSelectionOption should call addRectangleOption', () => {
    const addSpy = spyOn(service.drawer, 'addSelectionOption');
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    service.addSelectionOption(fakeRectangle);
    expect(addSpy).toHaveBeenCalled();
  });

  it('updateValues should call updateValues', () => {
    const updateSpy = spyOn(service.drawer, 'updateValues');
    service.selectRectangle = {} as Rectangle;
    service.updateValues(new MouseEvent('click'), FAKE_KEY_MODIFIER);
    expect(updateSpy).toHaveBeenCalled();
  });

  it('editSelection should call editSelection', () => {
    const editSpy = spyOn(service.drawer, 'editSelection');
    service.editSelection();
    expect(editSpy).toHaveBeenCalled();
  });

  it('isInBoundingBox should return true if elemnt in box', () => {
    const selection = {x: 0, y: 0, width: 10, height: 10} as SVGRect;
    const element   = {x: 1, y: 1, width: 1, height: 1} as SVGRect;
    expect(service.isInBoundingBox(selection, element)).toBe(true);
  });

  it('isInBoundingBox should return false if element outside box', () => {
    const selection = {x: 0, y: 0, width: 10, height: 10} as SVGRect;
    const element   = {x: 100, y: 100, width: 1, height: 1} as SVGRect;
    expect(service.isInBoundingBox(selection, element)).toBe(false);
  });

  it('isInBoundingBox should return false if elemnt in box', () => {
    const selection = {x: 5, y: 5, width: 10, height: 10} as SVGRect;
    const element   = {x: 1, y: 1, width: 5, height: 5} as SVGRect;
    expect(service.isInBoundingBox(selection, element)).toBe(true);
  });

  it('updateBoundingBox should return selectedBox equal to elementBox if isUndefined', () => {
    const selection = {origin: {x: 0, y: 0}, width: 10, height: 10} as RectangleValues;
    const element   = {x: 100, y: 100, width: 1, height: 1} as SVGRect;
    service.updateBoundingBox(selection, element, false);
    expect(selection.origin.x).toEqual(element.x);
    expect(selection.origin.y).toEqual(element.y);
    expect(selection.width).toEqual(element.width);
    expect(selection.height).toEqual(element.height);
  });

  it('updateBoundingBox should update selectedBox if smaller than object', () => {
    const selection = {origin: {x: 5, y: 5}, width: 0, height: 0} as RectangleValues;
    const element   = {x: 0, y: 0, width: 10, height: 10} as SVGRect;
    expect(service.updateBoundingBox(selection, element, true));
    expect(selection.origin.x).toEqual(element.x);
    expect(selection.origin.y).toEqual(element.y);
    expect(selection.width).toEqual(element.width);
    expect(selection.height).toEqual(element.height);
  });

  it('updateBoundingBox should do nothing to selectedBox if bigger than object', () => {
    const selection = {origin: {x: 0, y: 0}, width: 10, height: 10} as RectangleValues;
    const element   = {x: 5, y: 5, width: 1, height: 1} as SVGRect;
    expect(service.updateBoundingBox(selection, element, true));
    expect(selection.origin.x).not.toEqual(element.x);
    expect(selection.origin.y).not.toEqual(element.y);
    expect(selection.width).not.toEqual(element.width);
    expect(selection.height).not.toEqual(element.height);
  });

  it('selectElementsInBoundary should not call createSelectionFromDrawingElements if no object is in selectRectangle', () => {
    const isInBoundingBoxSpy = spyOn(service, 'isInBoundingBox');
    const removeSpy = spyOn(service, 'removeOldSelectionElement');
    const createSpy = spyOn(service, 'createSelectionFromDrawingElements');
    const fakeDrawing: DrawingElement = {ref: new MockElementRef()};
    const getBoundingSpy: jasmine.Spy = spyOn(fakeDrawing.ref, 'getBoundingClientRect');
    (service as any).drawingElementManager.drawingElementsOnDrawing = [fakeDrawing];
    service.selectRectangle = {ref: new MockElementRef(), } as Rectangle;
    service.selectElementsInBoundary();
    expect(isInBoundingBoxSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(getBoundingSpy).toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('selectElementsInBoundary should call createSelectionFromDrawingElements if there are objects in selectRectangle', () => {
    const isInBoundingBoxSpy = spyOn(service, 'isInBoundingBox').and.returnValue(true);
    const removeSpy = spyOn(service, 'removeOldSelectionElement');
    const createSpy = spyOn(service, 'createSelectionFromDrawingElements');
    const fakeDrawing: DrawingElement = {ref: new MockElementRef()};
    const getBoundingSpy: jasmine.Spy = spyOn(fakeDrawing.ref, 'getBoundingClientRect');
    (service as any).drawingElementManager.drawingElementsOnDrawing = [fakeDrawing];
    service.selectRectangle = {ref: new MockElementRef()} as Rectangle;
    service.selectElementsInBoundary();
    expect(isInBoundingBoxSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(getBoundingSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
  });

  it('selectElement should do nothing if getClickedObject is undefined', () => {
    const getSpy = spyOn((service as any).drawingElementManager, 'getClickedDrawingElementFromParent').and.returnValue(undefined);
    const removeSpy = spyOn(service, 'removeOldSelectionElement');
    const createSpy = spyOn(service, 'createSelectionFromDrawingElements');
    expect(service.selectElement(new MouseEvent('click'))).toEqual([]);
    expect(getSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('selectElement should call createSelectionFromDrawingElements if the selection is not reversed', () => {
    const getSpy = spyOn((service as any).drawingElementManager, 'getClickedDrawingElementFromParent');
    getSpy.and.returnValue({ref: new MockElementRef() });
    const removeSpy = spyOn(service, 'removeOldSelectionElement');
    const createSpy = spyOn(service, 'createSelectionFromDrawingElements');
    service.selectElement(new MouseEvent('click'));
    expect(getSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
  });

  it('deleteSelection should call removeSVGElementFromRef and remove the object from ToolHandler', () => {
    const removeSpy = spyOn(service.drawer, 'removeRefFromDrawing');
    const removeManagerSpy = spyOn((service as any).drawingElementManager, 'removeDrawingElement');
    (service as any).selectedDrawingElements = [{ref: {}} as Rectangle, {ref: {}} as Rectangle];
    service.deleteSelection((service as any).selectedDrawingElements);
    expect(removeSpy).toHaveBeenCalled();
    expect(removeManagerSpy).toHaveBeenCalled();
  });

  it('selectAll should call removeSVGElementFromRef and remove the object from ToolHandler', () => {
    const removeSpy = spyOn(service, 'removeOldSelectionElement');
    const createSpy = spyOn(service, 'createSelectionFromDrawingElements');
    service.selectRectangle = {ref: new MockElementRef(), value: {origin: {x: 0, y: 0}}} as Rectangle;
    service.selectAll();
    expect(removeSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
  });

  it('isADrawingSelected should call asObservable', () => {
    // tslint:disable-next-line: no-string-literal
    const observableSpy = spyOn(service['aDrawingElementIsSelected'], 'asObservable');
    service.isADrawingSelected();
    expect(observableSpy).toHaveBeenCalled();
  });

  it('createSelectionFromDrawingElements should set the new selectRectangle', () => {
    const createValuesSpy = spyOn(service, 'createSelectionRectangleValues').and.returnValue({origin: {x: 0, y: 0}} as RectangleValues);
    const getCoordSpy = spyOn(service.drawer, 'getCoordinate');
    const genSpy = spyOn(service, 'generateSelectionElement');
    const createSpy = spyOn(service, 'createSelection');
    const editSpy = spyOn(service, 'editSelection');
    const updateSpy = spyOn((service as any).drawer, 'updateAllSelectionCircles');
    service.selectRectangle = {ref: new MockElementRef(), value: {origin: {x: 0, y: 0}}} as Rectangle;
    service.createSelectionFromDrawingElements([{ref: {}} as Rectangle, {ref: {}} as Rectangle]);
    expect(createValuesSpy).toHaveBeenCalled();
    expect(getCoordSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
  });

  it('createSelectionRectangleValues should call asObservable', () => {
    const updatedSpy = spyOn(service, 'updateBoundingBox');
    service.selectRectangle = {ref: new MockElementRef(), value: {origin: {x: 0, y: 0}}} as Rectangle;
    service.createSelectionRectangleValues([{ref: new MockElementRef()} as Rectangle, {ref: new MockElementRef()} as Rectangle]);
    expect(updatedSpy).toHaveBeenCalled();
  });
});
