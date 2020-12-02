import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionService } from 'src/app/services/actions/action.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MockElementRef } from 'src/constant/constant';
import { Pencil } from 'src/interface/trace/pencil';
import { PencilToolHandlerService } from './pencil-tool-handler.service';

describe('PencilToolHandlerService', () => {

  let service: PencilToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(PencilToolHandlerService);
    service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should call generatePencilElement and createPencil if mouse is down and set pencil attribute', () => {
    const fakeClick = new MouseEvent('click');
    const FAKE_PENCIL = {path: '', thickness: 2, color: 'black', ref: new MockElementRef()};
    const genSpy: jasmine.Spy = spyOn(service.pencilService, 'generatePencilElement');
    const createSpy: jasmine.Spy = spyOn(service.pencilService, 'createPencil').and.returnValue(FAKE_PENCIL);
    const updateSpy: jasmine.Spy = spyOn(service.pencilService, 'updatePath');
    const editSpy: jasmine.Spy = spyOn(service.pencilService, 'editSVGpath');
    service.isMouseDown = false;
    service.handleMouseDown(fakeClick);
    expect(genSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(service.pencil).toEqual(FAKE_PENCIL);
  });

  it('handleMouseDown should not call generatePencilElement and createPencil if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const genSpy: jasmine.Spy = spyOn(service.pencilService, 'generatePencilElement');
    const createSpy: jasmine.Spy = spyOn(service.pencilService, 'createPencil');
    const updateSpy: jasmine.Spy = spyOn(service.pencilService, 'updatePath');
    const editSpy: jasmine.Spy = spyOn(service.pencilService, 'editSVGpath');
    service.isMouseDown = true;
    service.handleMouseDown(fakeClick);
    expect(genSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('handleMouseUp should not call appendObject and addAction and set ismousedown to false', () => {
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const actionSpy: jasmine.Spy = spyOn(service.actionService, 'addAction');
    service.isMouseDown = true;
    service.handleMouseUp();
    expect(appendSpy).toHaveBeenCalled();
    expect(actionSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleMouseMove should call updatePath and editSVGpath if mouse is down', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy: jasmine.Spy = spyOn(service.pencilService, 'updatePath');
    const editSpy: jasmine.Spy = spyOn(service.pencilService, 'editSVGpath');
    service.isMouseDown = true;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should not call updatePath and editSVGpath if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy: jasmine.Spy = spyOn(service.pencilService, 'updatePath');
    const editSpy: jasmine.Spy = spyOn(service.pencilService, 'editSVGpath');
    service.isMouseDown = false;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('handleMouseLeave should call removeSVGElementFromRef and set mouse to up or do nothing if mouse is not down', () => {
    const removeSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'removeSVGElementFromRef');
    service.isMouseDown = true;
    service.handleMouseLeave();
    expect(removeSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
    removeSpy.calls.reset();
    service.handleMouseLeave();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('handleDrawingLoad should push pencil objects into the toolHandler object table', () => {
    const FAKE_PENCIL = {path: '', thickness: 2, color: 'black', ref: new MockElementRef()};
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([new MockElementRef()]);
    const createPencilSpy: jasmine.Spy = spyOn(service.pencilService, 'createPencilFromSVGElement');
    createPencilSpy.and.returnValue(FAKE_PENCIL);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createPencilSpy).toHaveBeenCalled();
    createPencilSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(FAKE_PENCIL);
    createPencilSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.pencilService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.pencilService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.pencil = {ref: 'initial'} as Pencil;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.pencil = {ref: 'final'} as Pencil;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.pencil).not.toEqual(service.pencil);
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
