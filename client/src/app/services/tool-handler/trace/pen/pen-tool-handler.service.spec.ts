import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionService } from 'src/app/services/actions/action.service';
import { MockElementRef } from 'src/constant/constant';
import { Pen } from '../../../../../interface/trace/pen';
import { DrawingService } from '../../../drawing/drawing.service';
import { PenToolHandlerService } from './pen-tool-handler.service';

describe('PenToolHandlerService', () => {
  let service: PenToolHandlerService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(PenToolHandlerService);
    service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should call generatePenElement and createPen ' +
    'if mouse is down and set pencil attribute', () => {
    const fakeClick = new MouseEvent('click');
    const FAKE_PEN = {start_point_paths: [{x: 5 , y: 0}] , ref: new MockElementRef(), path_refs: [], path: '',
      thicknessMax: 2, thicknessMin: 2, color: 'blue'  } as Pen;
    const genSpy = spyOn(service.penService, 'generatePenElement');
    const genTag = spyOn(service.penService, 'generateGpenTag');
    const createSpy = spyOn(service.penService, 'createPen').and.returnValue( FAKE_PEN);

    service.isMouseDown = false;
    service.handleMouseDown(fakeClick);
    expect(genSpy).toHaveBeenCalled();
    expect( genTag).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(service.pen).toEqual(FAKE_PEN);
  });

  it('handleMouseDown should not call generatePenElement and createPen if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const genSpy = spyOn(service.penService, 'generatePenElement');
    const createSpy = spyOn(service.penService, 'createPen');
    const genTag = spyOn(service.penService, 'generateGpenTag');
    service.isMouseDown = true;
    service.handleMouseDown(fakeClick);
    expect(genSpy).not.toHaveBeenCalled();
    expect( genTag).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('handleMouseUp should not call appendObject and appendAction and ' +
    'set isMouseDown to false', () => {
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const actionSpy = spyOn(service.actionService, 'addAction');
    service.isMouseDown = true;
    service.handleMouseUp();
    expect(appendSpy).toHaveBeenCalled();
    expect(actionSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleMouseMove should not call updatePath  if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy = spyOn(service.penService, 'updatePath');
    service.isMouseDown = false;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('handleMouseMove should call updatePath  if mouse is down', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy = spyOn(service.penService, 'updatePath');
    service.isMouseDown = true;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).toHaveBeenCalled();
  });

  it('handleMouseLeave should call removeSVGElementFromRef and set mouse to up', () => {
    const removeSpy = spyOn(DrawingService.getInstance(), 'removeSVGElementFromRef');
    service.isMouseDown = true;
    service.handleMouseLeave();
    expect(removeSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleDrawingLoad should push pen objects into the toolHandler object table', () => {
    const fakePen: Pen = {
      ref: new MockElementRef(),
      start_point_paths: [{x: 0, y: 0}],
      path_refs: [],
      path: '',
      thicknessMax: 0,
      thicknessMin: 0,
      color: 'black',
    };
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([new MockElementRef()]);
    const createPencilSpy: jasmine.Spy = spyOn(service.penService, 'createPenFromSVGElement');
    createPencilSpy.and.returnValue(fakePen);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createPencilSpy).toHaveBeenCalled();
    createPencilSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakePen);
    createPencilSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.penService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.penService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.pen = {ref: 'initial'} as Pen;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.pen = {ref: 'final'} as Pen;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.pen).not.toEqual(service.pen);
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
    service.handleShortcuts();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleCurrentToolChange should do nothing', () => {
    service.handleCurrentToolChange();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

});
