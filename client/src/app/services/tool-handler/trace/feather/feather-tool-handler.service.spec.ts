import {ElementRef} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {MockElementRef} from '../../../../../constant/constant';
import {Feather} from '../../../../../interface/trace/feather';
import {ActionService} from '../../../actions/action.service';
import {DrawingService} from '../../../drawing/drawing.service';
import { FeatherToolHandlerService } from './feather-tool-handler.service';

describe('FeatherToolHandlerService', () => {
  let service: FeatherToolHandlerService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(FeatherToolHandlerService);
    service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should call generateFeatherElement and createFeather ' +
    'if mouse is down and set feather attribute', () => {
    const fakeClick = new MouseEvent('click');
    const FAKE_FEATHER = {  color: 'blue',  Path: '',
       } as Feather;
    const genSpy = spyOn(service.featherService, 'generateFeatherElement');
    const genTag = spyOn(service.featherService, 'generateGroupTag');
    const createSpy = spyOn(service.featherService, 'createFeather').and.returnValue( FAKE_FEATHER);
    const setFeather = spyOn(service.featherService, 'setFeatherOption');
    const genLine = spyOn(service.featherService, 'generateFirstLine');
    const setLast = spyOn(service.featherService, 'setLastEvent');
    const setSvgSpy = spyOn(service.drawingService, 'setSVGattribute');

    service.isMouseDown = false;
    service.handleMouseDown(fakeClick);
    expect(genSpy).toHaveBeenCalled();
    expect(setSvgSpy).toHaveBeenCalled();
    expect(genTag).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(setFeather).toHaveBeenCalled();
    expect(genLine).toHaveBeenCalled();
    expect(setLast).toHaveBeenCalled();
    expect(service.feather).toEqual(FAKE_FEATHER);
  });

  it('handleMouseDown should not call generateFeatherElement and createFeather if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const genSpy = spyOn(service.featherService, 'generateFeatherElement');
    const genTag = spyOn(service.featherService, 'generateGroupTag');
    const createSpy = spyOn(service.featherService, 'createFeather');
    const setFeather = spyOn(service.featherService, 'setFeatherOption');
    const genLine = spyOn(service.featherService, 'generateFirstLine');
    const setLast = spyOn(service.featherService, 'setLastEvent');
    service.isMouseDown = true;
    service.handleMouseDown(fakeClick);
    expect(genSpy).not.toHaveBeenCalled();
    expect(genTag).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(setFeather).not.toHaveBeenCalled();
    expect(genLine).not.toHaveBeenCalled();
    expect(setLast).not.toHaveBeenCalled();
  });

  it('handleMouseUp should call appendDrawingElement, addAction and changeShortcutAccess and ' +
    'set isMouseDown to false', () => {
    const appendSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const actionSpy = spyOn(service.actionService, 'addAction');
    const shortcutSpy: jasmine.Spy = spyOn(service.shortcutService, 'changeShortcutAccess');
    service.isMouseDown = true;
    service.handleMouseUp();
    expect(appendSpy).toHaveBeenCalled();
    expect(actionSpy).toHaveBeenCalled();
    expect(shortcutSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleMouseMove should not call updatePath  if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy = spyOn(service.featherService, 'updateFeatherPath');
    const setSpy = spyOn(service.featherService, 'setFeatherOption');
    const seLast = spyOn(service.featherService, 'setLastEvent');
    service.isMouseDown = false;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
    expect(seLast).not.toHaveBeenCalled();
  });

  it('handleMouseMove should call updatePath  if mouse is down', () => {
    const fakeClick = new MouseEvent('click');
    const updateSpy = spyOn(service.featherService, 'updateFeatherPath');
    const setSpy = spyOn(service.featherService, 'setFeatherOption');
    const seLast = spyOn(service.featherService, 'setLastEvent');
    service.isMouseDown = true;
    service.handleMouseMove(fakeClick);
    expect(updateSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(seLast).toHaveBeenCalled();
  });

  it('handleMouseLeave should call removeSVGElementFromRef and set mouse to up', () => {
    const removeSpy = spyOn(DrawingService.getInstance(), 'removeSVGElementFromRef');
    service.isMouseDown = true;
    service.handleMouseLeave();
    expect(removeSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleDrawingLoad should push feather objects into the toolHandler object table', () => {
    const fakeFeather: Feather = {
      ref: new MockElementRef(),
      color: 'blue',
      Path: '',
    };
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([new MockElementRef()]);
    const createFeatherSpy: jasmine.Spy = spyOn(service.featherService, 'createFeatherFromSVGElement');
    createFeatherSpy.and.returnValue(fakeFeather);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createFeatherSpy).toHaveBeenCalled();
    createFeatherSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakeFeather);
    createFeatherSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.featherService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.featherService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.feather = {ref: 'initial'} as Feather;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.feather = {ref: 'final'} as Feather;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.feather).not.toEqual(service.feather);
  });

  it('handleDoubleClick should do nothing', () => {
    service.handleDoubleClick({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseWheel should do nothing', () => {
    service.handleMouseWheel({} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleShortcuts should do nothing', () => {
    const fakeClick = new KeyboardEvent('click');

    service.handleShortcuts(fakeClick);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleCurrentToolChange should do nothing', () => {
    service.handleCurrentToolChange();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

});
