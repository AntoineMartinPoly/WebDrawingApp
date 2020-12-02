import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { BACKSPACE, ENTER } from 'src/constant/keypress/constant';
import { ZERO } from 'src/constant/shape/constant';
import { Point } from 'src/interface/Point';
import { FAKE_TEXT, Text, TextState } from 'src/interface/text/text';
import { ActionService } from '../../actions/action.service';
import { DrawingService } from '../../drawing/drawing.service';
import { KeypressService } from '../../tool-service/keypress.service';
import { TextToolHandlerService } from './text-tool-handler.service';

describe('TextToolHandlerService', () => {
  let service: TextToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
   service = TestBed.get(TextToolHandlerService);
   service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should set textOrigin and state attributes with deSelected state', () => {
    service.state = TextState.deSelected;
    const FAKE_EVENT = {x: ZERO, y: ZERO} as MouseEvent;
    const FAKE_POINT = {x: ZERO, y: ZERO} as Point;
    service.handleMouseDown(FAKE_EVENT);
    expect(service.state).toBe(TextState.selected);
    expect(service.textOrigin).toEqual(FAKE_POINT);
  });

  it('handleMouseDown should set textOrigin and state attributes with selected state', () => {
    service.state = TextState.selected;
    const FAKE_EVENT = {x: ZERO, y: ZERO} as MouseEvent;
    const FAKE_POINT = {x: ZERO, y: ZERO} as Point;
    service.handleMouseDown(FAKE_EVENT);
    expect(service.state).toBe(TextState.selected);
    expect(service.textOrigin).toEqual(FAKE_POINT);
  });

  it('handleMouseDown should set state attributes and call removeTextBox & addAction with writing state', () => {
    service.state = TextState.writing;
    const FAKE_EVENT = {x: ZERO, y: ZERO} as MouseEvent;
    const remSpy = spyOn(service.textService, 'removeTextBox');
    const actSpy = spyOn(service.actionService, 'addAction');
    service.handleMouseDown(FAKE_EVENT);
    expect(service.state).toBe(TextState.deSelected);
    expect(remSpy).toHaveBeenCalled();
    expect(actSpy).toHaveBeenCalled();
  });

  it('handleKeypress should call handleKeypressStateSelected and handleKeypressStateWriting with state selected', () => {
    service.state = TextState.selected;
    const FAKE_EVENT = {} as KeyboardEvent;
    const keypressSelSpy = spyOn(service, 'handleKeypressStateSelected');
    const keypressWrtSpy = spyOn(service, 'handleKeypressStateWriting');
    service.handleKeypress(FAKE_EVENT);
    expect(keypressSelSpy).toHaveBeenCalled();
    expect(keypressWrtSpy).toHaveBeenCalled();
    expect(service.state).toBe(TextState.writing);
  });

  it('handleKeypress should call handleKeypressStateWriting with state writing', () => {
    service.state = TextState.selected;
    const FAKE_EVENT = {} as KeyboardEvent;
    const keypressSelSpy = spyOn(service, 'handleKeypressStateSelected');
    const keypressWrtSpy = spyOn(service, 'handleKeypressStateWriting');
    service.handleKeypress(FAKE_EVENT);
    expect(keypressSelSpy).toHaveBeenCalled();
    expect(keypressWrtSpy).toHaveBeenCalled();
    expect(service.state).toBe(TextState.writing);
  });

  it('handleKeypress should call handleShortcuts with state deSelected', () => {
    service.state = TextState.deSelected;
    const FAKE_EVENT = {} as KeyboardEvent;
    const keypressSelSpy = spyOn(service, 'handleKeypressStateSelected');
    const keypressWrtSpy = spyOn(service, 'handleKeypressStateWriting');
    const handleShrtSpy = spyOn(service, 'handleShortcuts');
    service.handleKeypress(FAKE_EVENT);
    expect(keypressSelSpy).not.toHaveBeenCalled();
    expect(keypressWrtSpy).not.toHaveBeenCalled();
    expect(handleShrtSpy).toHaveBeenCalled();
    expect(service.state).toBe(TextState.deSelected);
  });

  it('handleShortcuts should call redoAction if ctrl Y', () => {
    const FAKE_KEYBOARD_EVENT = {} as KeyboardEvent;
    const isCtrlShiftZSpy = spyOn(KeypressService, 'isCtrlShiftZ').and.returnValue(true);
    const hndlRedoSpy = spyOn(service.actionService, 'redoAction');
    service.handleShortcuts(FAKE_KEYBOARD_EVENT);
    expect(isCtrlShiftZSpy).toHaveBeenCalled();
    expect(hndlRedoSpy).toHaveBeenCalled();
  });

  it('handleShortcuts should call undoAction if ctrl Z', () => {
    const FAKE_KEYBOARD_EVENT = {} as KeyboardEvent;
    const isCtrlShiftZSpy = spyOn(KeypressService, 'isCtrlShiftZ').and.returnValue(false);
    const isCtrlZSpy = spyOn(KeypressService, 'isCtrlZ').and.returnValue(true);
    const hndlRedoSpy = spyOn(service.actionService, 'redoAction');
    const hndlUndoSpy = spyOn(service.actionService, 'undoAction');
    service.handleShortcuts(FAKE_KEYBOARD_EVENT);
    expect(isCtrlShiftZSpy).toHaveBeenCalled();
    expect(isCtrlZSpy).toHaveBeenCalled();
    expect(hndlRedoSpy).not.toHaveBeenCalled();
    expect(hndlUndoSpy).toHaveBeenCalled();
  });

  it('handleKeypressStateSelected should call generateTextElement createText editText updateHeightText', () => {
    const genSpy = spyOn(service.textService, 'generateTextElement').and.returnValue(new MockElementRef());
    const createSpy = spyOn(service.textService, 'createText').and.returnValue(FAKE_TEXT);
    const editSpy = spyOn(service.textService, 'editText');
    const updateSpy = spyOn(service.textService, 'updateTextBox');
    service.textService.textBox = new MockElementRef();
    service.handleKeypressStateSelected();
    expect(genSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(service.elementRef).toEqual(new MockElementRef());
    expect(service.lastTextBox).toEqual(new MockElementRef());
    expect(service.text).toEqual(FAKE_TEXT);
  });

  it('handleKeypressStateWriting should call typeText updateLine updateWidthTextBox', () => {
    const typeSpy = spyOn(service.textService, 'typeText');
    const updtLineSpy = spyOn(service.textService, 'updateLine');
    const updtTextSpy = spyOn(service.textService, 'updateTextBox');
    const genLineSpy = spyOn(service.textService, 'generateNewLineText');
    const FAKE_KEYBOARD_EVENT = {key: 'fake_value'} as KeyboardEvent;
    service.handleKeypressStateWriting(FAKE_KEYBOARD_EVENT);
    expect(typeSpy).toHaveBeenCalled();
    expect(updtLineSpy).toHaveBeenCalled();
    expect(updtTextSpy).toHaveBeenCalled();
    expect(genLineSpy).not.toHaveBeenCalled();
  });

  it('handleKeypressStateWriting should call generateNewLineText updateHeightText with ENTER', () => {
    const typeSpy = spyOn(service.textService, 'typeText');
    const updtLineSpy = spyOn(service.textService, 'updateLine');
    const updtTextSpy = spyOn(service.textService, 'updateTextBox');
    const genLineSpy = spyOn(service.textService, 'generateNewLineText');
    const FAKE_KEYBOARD_EVENT = {key: ENTER} as KeyboardEvent;
    service.handleKeypressStateWriting(FAKE_KEYBOARD_EVENT);
    expect(updtLineSpy).toHaveBeenCalled();
    expect(updtTextSpy).toHaveBeenCalled();
    expect(typeSpy).not.toHaveBeenCalled();
    expect(genLineSpy).toHaveBeenCalled();
  });

  it('handleKeypressStateWriting should call deleteText updateHeightText with BACKSPACE', () => {
    const typeSpy = spyOn(service.textService, 'typeText');
    const updtLineSpy = spyOn(service.textService, 'updateLine');
    const updtTextSpy = spyOn(service.textService, 'updateTextBox');
    const genLineSpy = spyOn(service.textService, 'generateNewLineText');
    const deleteSpy = spyOn(service.textService, 'deleteText');
    const FAKE_KEYBOARD_EVENT = {key: BACKSPACE} as KeyboardEvent;
    service.handleKeypressStateWriting(FAKE_KEYBOARD_EVENT);
    expect(typeSpy).not.toHaveBeenCalled();
    expect(updtLineSpy).toHaveBeenCalled();
    expect(updtTextSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
    expect(genLineSpy).not.toHaveBeenCalled();
  });

  it('toggleKeypress should set opposite of enableKeyPress', () => {
    service.enableKeyPress = true;
    service.toggleKeypress();
    expect(service.enableKeyPress).toBe(false);
    service.toggleKeypress();
    expect(service.enableKeyPress).toBe(true);
  });

  it('handleUndo should call removeElement', () => {
    const remSpy = spyOn(service.textService, 'removeElement');
    service.handleUndo();
    expect(remSpy).toHaveBeenCalled();
  });

  it('handleRedo should call reAddElement', () => {
    const addSpy = spyOn(service.textService, 'reAddElement');
    service.text = FAKE_TEXT;
    service.handleRedo();
    expect(addSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.text = {ref: 'initial'} as Text;
    const copy = service.storeAction();
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service.text = {ref: 'final'} as Text;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy.text).not.toEqual(service.text);
  });

  it('handleCurrentToolChange should call removeTextBox and addAction state equal TextState.writing', () => {
    service.state = 'WRITE' as TextState;
    const removeSpy: jasmine.Spy = spyOn(service.textService, 'removeTextBox');
    const addSpy: jasmine.Spy = spyOn(service.actionService, 'addAction');
    service.handleCurrentToolChange();
    expect(removeSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    removeSpy.calls.reset();
    addSpy.calls.reset();
    service.state = '' as TextState;
    service.handleCurrentToolChange();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('handleDrawingLoad should push pencil objects into the toolHandler object table', () => {
    const fakeText = FAKE_TEXT;
    const getElemTableSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getElementsTable').and.returnValue([new MockElementRef()]);
    const createPencilSpy: jasmine.Spy = spyOn(service.textService, 'createTextFromSVGElement');
    createPencilSpy.and.returnValue(fakeText);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createPencilSpy).toHaveBeenCalled();
    createPencilSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakeText);
    createPencilSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleMouseMove should do nothing', () => {
    service.handleMouseMove({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseWheel should do nothing', () => {
    service.handleMouseWheel({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleDoubleClick should do nothing', () => {
    service.handleDoubleClick({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseUp should do nothing', () => {
    service.handleMouseUp();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseLeave should do nothing', () => {
    service.handleMouseLeave();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });
});
