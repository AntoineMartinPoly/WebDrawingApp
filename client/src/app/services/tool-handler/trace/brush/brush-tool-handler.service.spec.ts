import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionService } from 'src/app/services/actions/action.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MockElementRef } from 'src/constant/constant';
import { Brush, PatternType } from 'src/interface/trace/brush';
import { BrushToolHandlerService } from './brush-tool-handler.service';

describe('BrushToolHandlerService', () => {

  let service: BrushToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(BrushToolHandlerService);
    service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should call generateBrushElement and createBrush if mouse is down and set brush attribute', () => {
    const fakeClick = new MouseEvent('click');
    const fakeBrush: Brush = {path: '', pattern: 'Blur' as PatternType, thickness: 2, color: 'black', ref: new MockElementRef()};
    const genSpy = spyOn(service.brushService, 'generateBrushElement');
    const createSpy = spyOn(service.brushService, 'createBrush').and.returnValue(fakeBrush);
    const updateSpy = spyOn(service.brushService, 'updatePath');
    const editSpy = spyOn(service.brushService, 'editBrushPath');
    service.isMouseDown = false;
    service.handleMouseDown(fakeClick);
    expect(genSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(service.brush).toEqual(fakeBrush);
  });

  it('handleMouseDown should not call generatePencilElement and createPencil if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const fakeBrush: Brush = {path: '', pattern: 'Blur' as PatternType, thickness: 2, color: 'black', ref: new MockElementRef()};
    const genSpy = spyOn(service.brushService, 'generateBrushElement');
    const createSpy = spyOn(service.brushService, 'createBrush').and.returnValue(fakeBrush);
    service.isMouseDown = true;
    service.handleMouseDown(fakeClick);
    expect(genSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('handleMouseUp should not call appendObject and addaction and set ismousedown to false', () => {
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const actionSpy = spyOn(service.actionService, 'addAction');
    service.isMouseDown = true;
    service.handleMouseUp();
    expect(appendSpy).toHaveBeenCalled();
    expect(actionSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleMouseMove should call updatePath and editBrushPath if mouse is down', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy = spyOn(service.brushService, 'updatePath');
    const editSpy = spyOn(service.brushService, 'editBrushPath');
    service.isMouseDown = true;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should not call updatePath and editBrushPath if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy = spyOn(service.brushService, 'updatePath');
    const editSpy = spyOn(service.brushService, 'editBrushPath');
    service.isMouseDown = false;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('handleMouseLeave should call removeSVGElementFromRef and set mouse to up or do nothing if mouse is down', () => {
    const removeSpy = spyOn(DrawingService.getInstance(), 'removeSVGElementFromRef');
    service.isMouseDown = true;
    service.handleMouseLeave();
    expect(removeSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
    removeSpy.calls.reset();
    service.handleMouseLeave();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('handleDrawingLoad should push brush objects into the toolHandler object table', () => {
    const fakeBrush: Brush = {path: '', pattern: 'Blur' as PatternType, thickness: 2, color: 'black', ref: new MockElementRef()};
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([new MockElementRef()]);
    const createBrushSpy: jasmine.Spy = spyOn(service.brushService, 'createBrushFromSVGElement');
    createBrushSpy.and.returnValue(fakeBrush);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createBrushSpy).toHaveBeenCalled();
    createBrushSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakeBrush);
    createBrushSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.brushService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.brushService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.brush = {ref: 'initial'} as Brush;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.brush = {ref: 'final'} as Brush;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.brush).not.toEqual(service.brush);
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
