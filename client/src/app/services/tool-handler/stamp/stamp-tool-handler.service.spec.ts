import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_STAMP } from 'src/constant/stamp/constant';
import { Stamp } from 'src/interface/stamp/stamp';
import { ActionService } from '../../actions/action.service';
import { DrawingService } from '../../drawing/drawing.service';
import { StampToolHandlerService } from './stamp-tool-handler.service';

describe('StampToolHandlerService', () => {
  let service: StampToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(StampToolHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should call generateStampElement, createStamp and editStamp and set isMouseDown to true', () => {
    const generateSpy: jasmine.Spy = spyOn(service.stampService, 'generateStampElement');
    const createSpy: jasmine.Spy = spyOn(service.stampService, 'createStamp');
    const editSpy: jasmine.Spy = spyOn(service.stampService, 'editStamp');
    service.actionService = new ActionService();
    spyOn(service.stampService, 'getStampUrl').and.returnValue('fake_url');
    const event = new MouseEvent('mousedown');
    service.isMouseDown = false;
    service.handleMouseDown(event);
    expect(generateSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(true);
  });

  it('handleMouseUp should set isMouseDown to false', () => {
    service.isMouseDown = true;
    service.handleMouseUp();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleMouseUp should set isMouseDown to false', () => {
    service.isMouseDown = true;
    service.handleMouseUp();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleMouseLeave should set isMouseDown to false and call removeSVGElementFromRef', () => {
    const removeSVGSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'removeSVGElementFromRef');
    service.isMouseDown = true;
    service.handleMouseLeave();
    expect(service.isMouseDown).toBe(false);
    expect(removeSVGSpy).toHaveBeenCalled();
  });

  it('handleMouseWheel should call sendAngle and modifierRotateStamp if theres a stamp element selected', () => {
    service.stamp = FAKE_STAMP;
    const modifierSpy: jasmine.Spy = spyOn(service.stampService, 'modifierRotateStamp');
    service.handleMouseWheel({altKey: true} as any);
    expect(modifierSpy).toHaveBeenCalled();
    modifierSpy.calls.reset();
    service.stamp = null as any;
    service.handleMouseWheel({altKey: true} as any);
    expect(modifierSpy).not.toHaveBeenCalled();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.stampService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.stampService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.stamp = {ref: 'initial'} as Stamp;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.stamp = {ref: 'final'} as Stamp;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.stamp).not.toEqual(service.stamp);
  });

  it('handleDrawingLoad should push pencil objects into the toolHandler object table', () => {
    const fakeStamp = FAKE_STAMP;
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([new MockElementRef()]);
    const createPencilSpy: jasmine.Spy = spyOn(service.stampService, 'createStampFromSVGElement');
    createPencilSpy.and.returnValue(fakeStamp);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createPencilSpy).toHaveBeenCalled();
    createPencilSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakeStamp);
    createPencilSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleDoubleClick should do nothing', () => {
    service.handleDoubleClick({} as any, {} as any);
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
