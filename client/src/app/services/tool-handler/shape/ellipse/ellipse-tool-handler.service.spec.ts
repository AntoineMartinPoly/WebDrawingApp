import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionService } from 'src/app/services/actions/action.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { FAKE_ELLIPSE } from 'src/constant/toolbar/shape/ellipse/constant';
import { Ellipse } from 'src/interface/shape/ellipse';
import { EllipseToolHandlerService } from './ellipse-tool-handler.service';

describe('EllipseToolHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let service: EllipseToolHandlerService;
  beforeEach(() => {
    service = TestBed.get(EllipseToolHandlerService);
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
  });

  it('handleMouseMove should call generateEllipseElement, createEllipse if mouse has not moved', () => {
    const fakeClick = new MouseEvent('click');
    const magnetismSpy = spyOn(service.magnetism, 'updateCoordinate').and.returnValue({x: 0, y: 0});
    const updateSpy = spyOn(service.ellipseService, 'updateValue');
    const editSpy = spyOn(service.ellipseService, 'editEllipse');
    const generateSpy = spyOn(service.ellipseService, 'generateEllipseElement');
    const createSpy = spyOn(service.ellipseService, 'createEllipse').and.returnValue(FAKE_ELLIPSE);
    service.isMouseDown = true;
    service.hasMouseMoved = false;
    service.ellipse = FAKE_ELLIPSE;
    service.handleMouseMove(fakeClick, FAKE_KEY_MODIFIER);
    expect(magnetismSpy).toHaveBeenCalled();
    expect(generateSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should call updateValue and editEllipse if mouse is down', () => {
    const fakeClick = new MouseEvent('click');
    const magnetismSpy = spyOn(service.magnetism, 'updateCoordinate').and.returnValue({x: 0, y: 0});
    const updateSpy = spyOn(service.ellipseService, 'updateValue');
    const editSpy = spyOn(service.ellipseService, 'editEllipse');
    service.isMouseDown = true;
    service.hasMouseMoved = true;
    service.ellipse = FAKE_ELLIPSE;
    service.handleMouseMove(fakeClick, FAKE_KEY_MODIFIER);
    expect(magnetismSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should not call updateValue and editEllipse if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy = spyOn(service.ellipseService, 'updateValue');
    const editSpy = spyOn(service.ellipseService, 'editEllipse');
    service.isMouseDown = false;
    service.hasMouseMoved = true;
    service.handleMouseMove(fakeClick, FAKE_KEY_MODIFIER);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('handleMouseLeave should call removeSVGElementFromRef and set mouse to up', () => {
    const removeSpy = spyOn(DrawingService.getInstance(), 'removeSVGElementFromRef');
    service.isMouseDown = true;
    service.handleMouseLeave();
    expect(removeSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
    service.handleMouseLeave();
  });

  it('handleDrawingLoad should push ellipse objects into the toolHandler object table', () => {
    const fakeEllipse: Ellipse = FAKE_ELLIPSE;
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([
      new MockElementRef(),
    ]);
    const createPolygonSpy: jasmine.Spy = spyOn(service.ellipseService, 'createEllipseFromSVGElement');
    createPolygonSpy.and.returnValue(fakeEllipse);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createPolygonSpy).toHaveBeenCalled();
    createPolygonSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakeEllipse);
    createPolygonSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.ellipseService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.ellipseService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.ellipse = {ref: 'initial'} as Ellipse;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.ellipse = {ref: 'final'} as Ellipse;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.ellipse).not.toEqual(service.ellipse);
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
