import { TestBed } from '@angular/core/testing';
import { MockToolHandler } from '../tool-handler/tool-handler.service.spec';
import { ActionService } from './action.service';

describe('ActionService', () => {

  let service: ActionService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(ActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('addAction should add action to actionList and change iterator', () => {
    const mockToolHandler = new MockToolHandler();
    service.addAction(mockToolHandler);
    // tslint:disable-next-line: no-string-literal
    expect(service['actionList']).toEqual([mockToolHandler]);
    expect(service.iteratorIndex).toEqual(1);
  });

  it('addAction should reset undone actions and change iterator', () => {
    const mockToolHandler = new MockToolHandler();
    service.addAction(mockToolHandler);
    expect(service.iteratorIndex).toEqual(1);
    service.undoAction();
    service.addAction(mockToolHandler);
    // tslint:disable-next-line: no-string-literal
    expect(service['actionList']).toEqual([mockToolHandler]);
    expect(service.iteratorIndex).toEqual(1);
  });

  it('clearActions should clear all actions and reset iterator', () => {
    const mockToolHandler = new MockToolHandler();
    service.addAction(mockToolHandler);
    service.addAction(mockToolHandler);
    service.addAction(mockToolHandler);
    service.clearActions();
    // tslint:disable-next-line: no-string-literal
    expect(service['actionList']).toEqual([]);
    expect(service.iteratorIndex).toEqual(0);
  });

  it('undoAction should call handleUndo and decrement iterator', () => {
    const mockToolHandler = new MockToolHandler();
    service.addAction(mockToolHandler);
    // tslint:disable-next-line: no-string-literal
    const handleUndoSpy = spyOn(service['actionList'][0], 'handleUndo');
    service.undoAction();
    expect(service.iteratorIndex).toEqual(0);
    expect(handleUndoSpy).toHaveBeenCalled();
  });

  it('undoAction should not call handleUndo and not decrement iterator if array is empty', () => {
    const mockToolHandler = new MockToolHandler();
    service.addAction(mockToolHandler);
    service.undoAction();
    service.undoAction();
    // tslint:disable-next-line: no-string-literal
    const handleUndoSpy = spyOn(service['actionList'][0], 'handleUndo');
    expect(service.iteratorIndex).toEqual(0);
    expect(handleUndoSpy).not.toHaveBeenCalled();
  });

  it('redoAction should call handleRedo and decrement iterator', () => {
    const mockToolHandler = new MockToolHandler();
    service.addAction(mockToolHandler);
    // tslint:disable-next-line: no-string-literal
    const handleRedoSpy = spyOn(service['actionList'][0], 'handleRedo');
    service.undoAction();
    service.redoAction();
    expect(service.iteratorIndex).toEqual(1);
    expect(handleRedoSpy).toHaveBeenCalled();
  });

  it('redoAction should not call handleRedo and not decrement iterator if array is at end', () => {
    const mockToolHandler = new MockToolHandler();
    service.addAction(mockToolHandler);
    // tslint:disable-next-line: no-string-literal
    const handleRedoSpy = spyOn(service['actionList'][0], 'handleRedo');
    service.redoAction();
    expect(service.iteratorIndex).toEqual(1);
    expect(handleRedoSpy).not.toHaveBeenCalled();
  });

  it('isRedoAvailable should return correct bool values', () => {
    expect(service.isRedoAvailable()).toBe(false);
    service.addAction(new MockToolHandler());
    expect(service.isRedoAvailable()).toBe(false);
    service.undoAction();
    expect(service.isRedoAvailable()).toBe(true);
  });

  it('isUndoAvailable should return correct bool values', () => {
    expect(service.isUndoAvailable()).toBe(false);
    service.addAction(new MockToolHandler());
    expect(service.isUndoAvailable()).toBe(true);
    service.undoAction();
    expect(service.isUndoAvailable()).toBe(false);
  });
});
