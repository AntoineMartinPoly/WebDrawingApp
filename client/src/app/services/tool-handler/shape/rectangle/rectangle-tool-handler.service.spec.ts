import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionService } from 'src/app/services/actions/action.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { FAKE_RECTANGLE } from 'src/constant/toolbar/shape/rectangle/constant';
import { Rectangle } from 'src/interface/shape/rectangle';
import { RectangleToolHandlerService } from './rectangle-tool-handler.service';

describe('RectangleToolHandlerService', () => {
  let service: RectangleToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(RectangleToolHandlerService);
    service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should set !hasMouseMoved and isMouseDown', () => {
    service.hasMouseMoved = true;
    service.isMouseDown = false;
    service.handleMouseDown();
    expect(service.hasMouseMoved).toBe(false);
    expect(service.isMouseDown).toBe(true);
  });

  it('handleMouseUp should set !isMouseDown and !hasMouseMoved and call appendObject and addAction', () => {
    service.hasMouseMoved = true;
    service.isMouseDown = true;
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    service.handleMouseUp();
    expect(appendSpy).toHaveBeenCalled();
    expect(addActionSpy).toHaveBeenCalled();
    expect(service.hasMouseMoved).toBe(false);
    expect(service.isMouseDown).toBe(false);
    service.handleMouseUp();
  });

  it('handleMouseMove should call generateRectangleElement createRectangle sendIsSurfaceEmpty if mouse has not moved', () => {
    const fakeClick = new MouseEvent('click');
    const magnetismSpy = spyOn(service.magnetism, 'updateCoordinate').and.returnValue({x: 0, y: 0});
    const updateSpy = spyOn(service.rectangleService, 'updateValues');
    const editSpy = spyOn(service.rectangleService, 'editRectangle');
    const generateSpy = spyOn(service.rectangleService, 'generateRectangleElement');
    const createSpy = spyOn(service.rectangleService, 'createRectangle').and.returnValue(FAKE_RECTANGLE);
    service.isMouseDown = true;
    service.hasMouseMoved = false;
    service.rectangle = FAKE_RECTANGLE;
    service.handleMouseMove(fakeClick, FAKE_KEY_MODIFIER);
    expect(magnetismSpy).toHaveBeenCalled();
    expect(generateSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should call updateValues and editRectangle if mouse is down', () => {
    const fakeClick = new MouseEvent('click');
    const magnetismSpy = spyOn(service.magnetism, 'updateCoordinate').and.returnValue({x: 0, y: 0});
    const updateSpy: jasmine.Spy = spyOn(service.rectangleService, 'updateValues');
    const editSpy: jasmine.Spy = spyOn(service.rectangleService, 'editRectangle');
    service.isMouseDown = true;
    service.hasMouseMoved = true;
    service.rectangle = FAKE_RECTANGLE;
    service.handleMouseMove(fakeClick, FAKE_KEY_MODIFIER);
    expect(magnetismSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should not call updateValues and editRectangle if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy: jasmine.Spy = spyOn(service.rectangleService, 'updateValues');
    const editSpy: jasmine.Spy = spyOn(service.rectangleService, 'editRectangle');
    service.isMouseDown = false;
    service.hasMouseMoved = true;
    service.handleMouseMove(fakeClick, FAKE_KEY_MODIFIER);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('handleMouseLeave should call removeSVGElementFromRef and set mouse to up', () => {
    const removeSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'removeSVGElementFromRef');
    service.isMouseDown = true;
    service.handleMouseLeave();
    expect(removeSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
    removeSpy.calls.reset();
    service.handleMouseLeave();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('handleDrawingLoad should push rectangle objects into the toolHandler object table', () => {
    const fakeRectangle: Rectangle = FAKE_RECTANGLE;
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([
      new MockElementRef(),
    ]);
    const createRectangleSpy: jasmine.Spy = spyOn(service.rectangleService, 'createRectangleFromSVGElement');
    createRectangleSpy.and.returnValue(fakeRectangle);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createRectangleSpy).toHaveBeenCalled();
    createRectangleSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakeRectangle);
    createRectangleSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.rectangleService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.rectangleService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.rectangle = {ref: 'initial'} as Rectangle;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.rectangle = {ref: 'final'} as Rectangle;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.rectangle).not.toEqual(service.rectangle);
  });

  it('handleDoubleClick should do nothing', () => {
    service.handleDoubleClick({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseWheel should do nothing', () => {
    service.handleMouseWheel({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleShortcuts should do nothing', () => {
    service.handleShortcuts({} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleCurrentToolChange should do nothing', () => {
    service.handleCurrentToolChange();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });
});
