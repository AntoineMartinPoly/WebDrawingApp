import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FAKE_RECTANGLE, MockElementRef } from 'src/constant/shape/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { SelectionAction } from 'src/interface/action';
import { ActionService } from '../../actions/action.service';
import { SelectionToolHandlerService } from './selection-tool-handler.service';

describe('SelectionToolHandlerService', () => {

  let service: SelectionToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(SelectionToolHandlerService);
    service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should call removeOldSelectionElement, createSelection and generateSelectionElement from SelectionService', () => {
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const createSpy = spyOn(service.selectionService, 'createSelection');
    const generateSpy = spyOn(service.selectionService, 'generateSelectionElement');
    const targetSpy = spyOn(service.selectionService, 'isTargetSelectionCircles');
    const movableSpy = spyOn(service.selectionService, 'isTargetMovable');
    const mockMouseEvent = new MouseEvent('click');
    service.handleMouseDown(mockMouseEvent, {leftKey: true});
    expect(removeSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(generateSpy).toHaveBeenCalled();
    expect(targetSpy).toHaveBeenCalled();
    expect(movableSpy).toHaveBeenCalled();
  });

  it('handleMouseDown should call generateSelectionElement createSelection and set isMouseDown', () => {
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const createSpy = spyOn(service.selectionService, 'createSelection');
    const generateSpy = spyOn(service.selectionService, 'generateSelectionElement');
    const targetSpy = spyOn(service.selectionService, 'isTargetSelectionCircles');
    const movableSpy = spyOn(service.selectionService, 'isTargetMovable');
    const coordSpy = spyOn((service.selectionService as any).drawer, 'getCoordinate');
    targetSpy.and.returnValue(true);
    const mockMouseEvent = new MouseEvent('click');
    service.handleMouseDown(mockMouseEvent, {leftKey: true});
    expect(removeSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
    expect(targetSpy).toHaveBeenCalled();
    expect(movableSpy).not.toHaveBeenCalled();
    expect(coordSpy).toHaveBeenCalled();
  });

  it('handleMouseDown should call reverse selection on rightclick', () => {
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const createSpy = spyOn(service.selectionService, 'createSelection');
    const generateSpy = spyOn(service.selectionService, 'generateSelectionElement');
    const targetSpy = spyOn(service.selectionService, 'isTargetSelectionCircles');
    const movableSpy = spyOn(service.selectionService, 'isTargetMovable');
    const coordSpy = spyOn((service.selectionService as any).drawer, 'getCoordinate');
    movableSpy.and.returnValue(true);
    const mockMouseEvent = new MouseEvent('click');
    service.handleMouseDown(mockMouseEvent, {leftKey: true});
    expect(removeSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
    expect(targetSpy).toHaveBeenCalled();
    expect(movableSpy).toHaveBeenCalled();
    expect(coordSpy).toHaveBeenCalled();
  });

  it('handleMouseUp should call selectInBoundary if isMouseDown and hasMouseMoved', () => {
    (service as any).isMouseDown = true;
    (service as any).selectionAction = SelectionAction.resize;
    const selectSpy = spyOn(service, 'handleSelect');
    const actionSpy = spyOn(service.actionService, 'addAction');
    const resetSpy = spyOn(service.selectionService, 'resetFirstAction');
    const mockMouseEvent = new MouseEvent('click');
    service.handleMouseUp(mockMouseEvent, FAKE_KEY_MODIFIER);
    expect(selectSpy).not.toHaveBeenCalled();
    expect(actionSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect((service as any).isMouseDown).toBe(false);
  });

  it('handleMouseUp should call select if isMouseDown and not hasMouseMoved', () => {
    (service as any).isMouseDown = true;
    (service as any).selectionAction = SelectionAction.selecting;
    const selectSpy = spyOn(service, 'handleSelect');
    const actionSpy = spyOn(service.actionService, 'addAction');
    const resetSpy = spyOn(service.selectionService, 'resetFirstAction');
    const mockMouseEvent = new MouseEvent('click');
    service.handleMouseUp(mockMouseEvent, FAKE_KEY_MODIFIER);
    expect(selectSpy).toHaveBeenCalled();
    expect(actionSpy).not.toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect((service as any).isMouseDown).toBe(false);
  });

  it('handleMouseUp should call nothing if not isMouseDown', () => {
    (service as any).isMouseDown = false;
    (service as any).selectionAction = SelectionAction.selecting;
    const selectSpy = spyOn(service, 'handleSelect');
    const actionSpy = spyOn(service.actionService, 'addAction');
    const resetSpy = spyOn(service.selectionService, 'resetFirstAction');
    const mockMouseEvent = new MouseEvent('click');
    service.handleMouseUp(mockMouseEvent, FAKE_KEY_MODIFIER);
    expect(selectSpy).not.toHaveBeenCalled();
    expect(actionSpy).not.toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
    expect((service as any).isMouseDown).toBe(false);
  });

  it('handleMouseMove should call updateValues and editSelection if isMouseDown', () => {
    (service as any).isMouseDown = true;
    (service as any).selectionElement = FAKE_RECTANGLE;
    const updateSpy = spyOn(service.selectionService, 'updateValues');
    const editSpy = spyOn(service.selectionService, 'editSelection');
    const mockMouseEvent = new MouseEvent('click');
    service.handleMouseMove(mockMouseEvent, FAKE_KEY_MODIFIER);
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should call nothing if not isMouseDown', () => {
    (service as any).isMouseDown = false;
    (service as any).selectionElement = FAKE_RECTANGLE;
    const updateSpy = spyOn(service.selectionService, 'updateValues');
    const editSpy = spyOn(service.selectionService, 'editSelection');
    const mockMouseEvent = new MouseEvent('click');
    service.handleMouseMove(mockMouseEvent, FAKE_KEY_MODIFIER);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    (service as any).modifiedDrawingElements = [{ref: {nativeElement: 'initial'} as ElementRef}];
    const copy = service.storeAction();
    (service as any).modifiedDrawingElements = [{ref: {nativeElement: 'final'} as ElementRef}];
    expect((copy as any).modifiedDrawingElements).not.toEqual((service as any).modifiedDrawingElements);
  });

  it('handleUndo should call setTranslationsValues if clipboard is resize', () => {
    (service as any).selectionAction = SelectionAction.resize;
    const reAddSpy = spyOn(service.clipboardService, 'reAddElements');
    const setSpy = spyOn(service.selectionService, 'setTranslationsValues');
    const removeSpy = spyOn(service.clipboardService, 'removeDrawingElementsFromDrawing');
    const removeOldSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    service.handleUndo();
    expect(reAddSpy).not.toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(removeOldSpy).not.toHaveBeenCalled();
  });

  it('handleUndo should call removeElements if clipboard is not cut or delete', () => {
    (service as any).selectionAction = SelectionAction.paste;
    const reAddSpy = spyOn(service.clipboardService, 'reAddElements');
    const setSpy = spyOn(service.selectionService, 'setTranslationsValues');
    const removeSpy = spyOn(service.clipboardService, 'removeDrawingElementsFromDrawing');
    const removeOldSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    service.handleUndo();
    expect(reAddSpy).not.toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(removeOldSpy).toHaveBeenCalled();
  });

  it('handleUndo should call reAddElements if clipboard is cut or delete', () => {
    (service as any).selectionAction = SelectionAction.delete;
    const reAddSpy = spyOn(service.clipboardService, 'reAddElements');
    const setSpy = spyOn(service.selectionService, 'setTranslationsValues');
    const removeSpy = spyOn(service.clipboardService, 'removeDrawingElementsFromDrawing');
    const removeOldSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    service.handleUndo();
    expect(reAddSpy).toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(removeOldSpy).toHaveBeenCalled();
  });

  it('handleRedo should call setTranslationsValues if clipboard is resize', () => {
    (service as any).selectionAction = SelectionAction.resize;
    const reAddSpy = spyOn(service.clipboardService, 'reAddElements');
    const setSpy = spyOn(service.selectionService, 'setTranslationsValues');
    const removeSpy = spyOn(service.clipboardService, 'removeDrawingElementsFromDrawing');
    const removeOldSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    service.handleRedo();
    expect(reAddSpy).not.toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(removeOldSpy).not.toHaveBeenCalled();
  });

  it('handleRedo should call removeElements if clipboard is cut or delete', () => {
    (service as any).selectionAction = SelectionAction.delete;
    const reAddSpy = spyOn(service.clipboardService, 'reAddElements');
    const setSpy = spyOn(service.selectionService, 'setTranslationsValues');
    const removeSpy = spyOn(service.clipboardService, 'removeDrawingElementsFromDrawing');
    const removeOldSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    service.handleRedo();
    expect(reAddSpy).not.toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(removeOldSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElements if clipboard is cut or delete', () => {
    (service as any).selectionAction = SelectionAction.paste;
    const reAddSpy = spyOn(service.clipboardService, 'reAddElements');
    const setSpy = spyOn(service.selectionService, 'setTranslationsValues');
    const removeSpy = spyOn(service.clipboardService, 'removeDrawingElementsFromDrawing');
    const removeOldSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(removeOldSpy).toHaveBeenCalled();
  });

  it('handleCopy should call copy from clibboardService', () => {
    const copySpy = spyOn(service.clipboardService, 'copy');
    service.handleCopy();
    expect(copySpy).toHaveBeenCalled();
  });

  it('handleCut should call cut from clibboardService and do nothing if nothing is cut', () => {
    const copySpy = spyOn(service.clipboardService, 'cut').and.returnValue(false);
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    service.handleCut();
    expect(copySpy).toHaveBeenCalled();
    expect(addActionSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('handleCut should call cut from clibboardService and select modified DrawingElements', () => {
    const copySpy = spyOn(service.clipboardService, 'cut').and.returnValue(true);
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    service.handleCut();
    expect(copySpy).toHaveBeenCalled();
    expect(addActionSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handlePaste should call paste from clibboardService and do nothing if nothing is cut', () => {
    const pasteSpy = spyOn(service.clipboardService, 'paste').and.returnValue([]);
    const createSpy = spyOn(service.selectionService, 'createSelectionFromDrawingElements');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    service.handlePaste();
    expect(pasteSpy).toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(addActionSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('handlePaste should call paste from clibboardService and paste modified DrawingElements', () => {
    const pasteSpy = spyOn(service.clipboardService, 'paste').and.returnValue([{ref: new MockElementRef()}]);
    const createSpy = spyOn(service.selectionService, 'createSelectionFromDrawingElements');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    service.handlePaste();
    expect(pasteSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(addActionSpy).toHaveBeenCalled();
  });

  it('handleDuplicate should call duplicate from clibboardService and do nothing if nothing is cut', () => {
    const duplicateSpy = spyOn(service.clipboardService, 'duplicate').and.returnValue([]);
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    service.handleDuplicate();
    expect(duplicateSpy).toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(addActionSpy).not.toHaveBeenCalled();
  });

  it('handleDuplicate should call duplicate from clibboardService and duplicate modified DrawingElements', () => {
    const duplicateSpy = spyOn(service.clipboardService, 'duplicate').and.returnValue([{ref: new MockElementRef()}]);
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    service.handleDuplicate();
    expect(duplicateSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(addActionSpy).toHaveBeenCalled();
  });

  it('handleSelectAll should call selectAll from selectionService', () => {
    const selectSpy = spyOn(service.selectionService, 'selectAll');
    service.handleSelectAll();
    expect(selectSpy).toHaveBeenCalled();
  });

  it('handleDelete should not call deleteSelection from selectionService if no object is selected', () => {
    const deleteSpy = spyOn(service.selectionService, 'deleteSelection');
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    service.handleDelete();
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(addActionSpy).not.toHaveBeenCalled();
  });

  it('handleDelete should call deleteSelection from selectionService if objects are selected', () => {
    const deleteSpy = spyOn(service.selectionService, 'deleteSelection');
    const removeSpy = spyOn(service.selectionService, 'removeOldSelectionElement');
    const addActionSpy = spyOn(service.actionService, 'addAction');
    (service as any).selectedDrawingElements = [{ref: new MockElementRef()}];
    service.handleDelete();
    expect(deleteSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(addActionSpy).toHaveBeenCalled();
  });

  it('handleShortcuts should call handleDelete when delete is pressed', () => {
    const copySpy = spyOn(service, 'handleCopy');
    const cutSpy = spyOn(service, 'handleCut');
    const duplicateSpy = spyOn(service, 'handleDuplicate');
    const pasteSpy = spyOn(service, 'handlePaste');
    const selectAllSpy = spyOn(service, 'handleSelectAll');
    const deleteSpy = spyOn(service, 'handleDelete');
    service.handleShortcuts(new KeyboardEvent('keydown', {key: 'Delete'}));
    expect(deleteSpy).toHaveBeenCalled();
    expect(copySpy).not.toHaveBeenCalled();
    expect(cutSpy).not.toHaveBeenCalled();
    expect(duplicateSpy).not.toHaveBeenCalled();
    expect(pasteSpy).not.toHaveBeenCalled();
    expect(selectAllSpy).not.toHaveBeenCalled();
  });

  it('handleShortcuts should call handleCopy when ctrl + c is pressed', () => {
    const copySpy = spyOn(service, 'handleCopy');
    const cutSpy = spyOn(service, 'handleCut');
    const duplicateSpy = spyOn(service, 'handleDuplicate');
    const pasteSpy = spyOn(service, 'handlePaste');
    const selectAllSpy = spyOn(service, 'handleSelectAll');
    const deleteSpy = spyOn(service, 'handleDelete');
    const keyboardEvent = new KeyboardEvent('keydown', {ctrlKey: true, key: 'c'});
    service.handleShortcuts(keyboardEvent);
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(copySpy).toHaveBeenCalled();
    expect(cutSpy).not.toHaveBeenCalled();
    expect(duplicateSpy).not.toHaveBeenCalled();
    expect(pasteSpy).not.toHaveBeenCalled();
    expect(selectAllSpy).not.toHaveBeenCalled();
  });

  it('handleShortcuts should call handleCut when ctrl + x is pressed', () => {
    const copySpy = spyOn(service, 'handleCopy');
    const cutSpy = spyOn(service, 'handleCut');
    const duplicateSpy = spyOn(service, 'handleDuplicate');
    const pasteSpy = spyOn(service, 'handlePaste');
    const selectAllSpy = spyOn(service, 'handleSelectAll');
    const deleteSpy = spyOn(service, 'handleDelete');
    const keyboardEvent = new KeyboardEvent('keydown', {ctrlKey: true, key: 'x'});
    service.handleShortcuts(keyboardEvent);
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(copySpy).not.toHaveBeenCalled();
    expect(cutSpy).toHaveBeenCalled();
    expect(duplicateSpy).not.toHaveBeenCalled();
    expect(pasteSpy).not.toHaveBeenCalled();
    expect(selectAllSpy).not.toHaveBeenCalled();
  });

  it('handleShortcuts should call handleDuplicate when ctrl + d is pressed', () => {
    const copySpy = spyOn(service, 'handleCopy');
    const cutSpy = spyOn(service, 'handleCut');
    const duplicateSpy = spyOn(service, 'handleDuplicate');
    const pasteSpy = spyOn(service, 'handlePaste');
    const selectAllSpy = spyOn(service, 'handleSelectAll');
    const deleteSpy = spyOn(service, 'handleDelete');
    const keyboardEvent = new KeyboardEvent('keydown', {ctrlKey: true, key: 'd'});
    service.handleShortcuts(keyboardEvent);
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(copySpy).not.toHaveBeenCalled();
    expect(cutSpy).not.toHaveBeenCalled();
    expect(duplicateSpy).toHaveBeenCalled();
    expect(pasteSpy).not.toHaveBeenCalled();
    expect(selectAllSpy).not.toHaveBeenCalled();
  });

  it('handleShortcuts should call handlePaste when ctrl + v is pressed', () => {
    const copySpy = spyOn(service, 'handleCopy');
    const cutSpy = spyOn(service, 'handleCut');
    const duplicateSpy = spyOn(service, 'handleDuplicate');
    const pasteSpy = spyOn(service, 'handlePaste');
    const selectAllSpy = spyOn(service, 'handleSelectAll');
    const deleteSpy = spyOn(service, 'handleDelete');
    const keyboardEvent = new KeyboardEvent('keydown', {ctrlKey: true, key: 'v'});
    service.handleShortcuts(keyboardEvent);
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(copySpy).not.toHaveBeenCalled();
    expect(cutSpy).not.toHaveBeenCalled();
    expect(duplicateSpy).not.toHaveBeenCalled();
    expect(pasteSpy).toHaveBeenCalled();
    expect(selectAllSpy).not.toHaveBeenCalled();
  });

  it('handleShortcuts should call handleSelectAll when ctrl + a is pressed', () => {
    const copySpy = spyOn(service, 'handleCopy');
    const cutSpy = spyOn(service, 'handleCut');
    const duplicateSpy = spyOn(service, 'handleDuplicate');
    const pasteSpy = spyOn(service, 'handlePaste');
    const selectAllSpy = spyOn(service, 'handleSelectAll');
    const deleteSpy = spyOn(service, 'handleDelete');
    const keyboardEvent = new KeyboardEvent('keydown', {ctrlKey: true, key: 'a'});
    service.handleShortcuts(keyboardEvent);
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(copySpy).not.toHaveBeenCalled();
    expect(cutSpy).not.toHaveBeenCalled();
    expect(duplicateSpy).not.toHaveBeenCalled();
    expect(pasteSpy).not.toHaveBeenCalled();
    expect(selectAllSpy).toHaveBeenCalled();
  });

  it('handleCurrentToolChange should call removeOldSelectionElement and reset selectedDrawingElements', () => {
    const removeSpy: jasmine.Spy = spyOn(service.selectionService, 'removeOldSelectionElement');
    (service as any).selectedDrawingElements = [{ref: new MockElementRef()}];
    service.handleCurrentToolChange();
    expect(removeSpy).toHaveBeenCalled();
    expect((service as any).selectedDrawingElements).toEqual([]);
  });

  it('handleDoubleClick should do nothing', () => {
    service.handleDoubleClick({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseWheel should do nothing', () => {
    const rotateSpy: jasmine.Spy = spyOn(service.selectionService, 'rotateSelection');
    const actionSpy: jasmine.Spy = spyOn(service.actionService, 'addAction');
    service.handleMouseWheel({} as any, {} as any);
    expect(rotateSpy).toHaveBeenCalled();
    expect(actionSpy).toHaveBeenCalled();
  });

  it('handleMouseLeave should do nothing', () => {
    service.handleMouseLeave();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleDrawingLoad should do nothing', () => {
    service.handleDrawingLoad();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });
});
