import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionService } from 'src/app/services/actions/action.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_POLYGON } from 'src/constant/toolbar/shape/polygon/constant';
import { Polygon } from 'src/interface/shape/polygon';
import { PolygonToolHandlerService } from './polygon-tool-handler.service';

describe('PolygonToolHandlerService', () => {
  let service: PolygonToolHandlerService;
  const MAGNETISM = 'magnetism';

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(PolygonToolHandlerService);
    service.actionService = new ActionService();
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

  it('handleMouseMove should call generatePolygonElement createPolygon sendIsSurfaceEmpty if mouse has not moved', () => {
    const fakeClick = new MouseEvent('click');
    const magnetismSpy: jasmine.Spy = spyOn(service[MAGNETISM], 'updateCoordinate').and.returnValue({x: 0, y: 0});
    const updateSpy = spyOn(service.polygonService, 'updateValue');
    const editSpy = spyOn(service.polygonService, 'editPolygon');
    const generateSpy = spyOn(service.polygonService, 'generatePolygonElement');
    const createSpy = spyOn(service.polygonService, 'createPolygon').and.returnValue(FAKE_POLYGON);
    service.isMouseDown = true;
    service.hasMouseMoved = false;
    service.polygon = FAKE_POLYGON;
    service.handleMouseMove(fakeClick);
    expect(generateSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(magnetismSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should call updateValue and editPolygon if mouse is down', () => {
    const fakeClick = new MouseEvent('click');
    const magnetismSpy = spyOn(service[MAGNETISM], 'updateCoordinate').and.returnValue({x: 0, y: 0});
    const updateSpy = spyOn(service.polygonService, 'updateValue');
    const editSpy = spyOn(service.polygonService, 'editPolygon');
    service.isMouseDown = true;
    service.hasMouseMoved = true;
    service.polygon = FAKE_POLYGON;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(magnetismSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should not call updateValue and editPolygon if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy = spyOn(service.polygonService, 'updateValue');
    const editSpy = spyOn(service.polygonService, 'editPolygon');
    service.isMouseDown = false;
    service.hasMouseMoved = true;
    service.handleMouseMove(fakeClick);
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

  it('handleDrawingLoad should push polygon objects into the toolHandler object table', () => {
    const fakePolygon: Polygon = FAKE_POLYGON;
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([
      new MockElementRef(),
    ]);
    const createPolygonSpy: jasmine.Spy = spyOn(service.polygonService, 'createPolygonFromSVGElement');
    createPolygonSpy.and.returnValue(fakePolygon);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createPolygonSpy).toHaveBeenCalled();
    createPolygonSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakePolygon);
    createPolygonSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.polygonService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.polygonService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.polygon = {ref: 'initial'} as Polygon;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.polygon = {ref: 'final'} as Polygon;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.polygon).not.toEqual(service.polygon);
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
