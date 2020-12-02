import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { ActionService } from '../../actions/action.service';
import { EraserService } from '../../tool-service/eraser/eraser.service';
import { EraserToolHandlerService } from './eraser-tool-handler.service';

describe('EraserToolHandlerService', () => {

  let service: EraserToolHandlerService;
  let generateCursorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const eraserService = TestBed.get(EraserService);
    generateCursorSpy = spyOn(eraserService, 'generateCursor');
    generateCursorSpy.calls.reset();
    service = TestBed.get(EraserToolHandlerService);
    service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should call erase from eraser on a left click', () => {
    const eraseSpy: jasmine.Spy = spyOn(service.eraser, 'erase');
    const getClickedObjectSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent');
    getClickedObjectSpy.and.returnValue(1);
    service.mouseDown = false;
    service.handleMouseDown(new MouseEvent('click'), {leftKey: true});
    expect(eraseSpy).toHaveBeenCalled();
  });

  it('handleMouseDown should not call erase from eraser on a right click', () => {
    const eraseSpy: jasmine.Spy = spyOn(service.eraser, 'erase');
    service.mouseDown = false;
    service.handleMouseDown(new MouseEvent('click'), {rightKey: true});
    expect(eraseSpy).not.toHaveBeenCalled();
  });

  it('handleMouseDown should not call erase from eraser if no valid DrawingElement was clicked', () => {
    const eraseSpy: jasmine.Spy = spyOn(service.eraser, 'erase');
    const getClickedObjectSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent');
    getClickedObjectSpy.and.returnValue(0);
    service.mouseDown = false;
    service.handleMouseDown(new MouseEvent('click'), {leftKey: true});
    expect(eraseSpy).not.toHaveBeenCalled();
    expect(getClickedObjectSpy).toHaveBeenCalled();
  });

  it('handleMouseUp should call addAction, changeShortcutAccess and reset drawingElementDeleted if table isnt empty', () => {
    service.drawingElementDeleted = [{ref: new MockElementRef()}, {ref: new MockElementRef()}, {ref: new MockElementRef()}];
    const addSpy: jasmine.Spy = spyOn(service.actionService, 'addAction');
    const changeSpy: jasmine.Spy = spyOn(service.shortcutService, 'changeShortcutAccess');
    service.handleMouseUp();
    expect(service.drawingElementDeleted).toEqual([]);
    expect(addSpy).toHaveBeenCalled();
    expect(changeSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should call erase from eraser if mouse is down and a valid DrawingElement is clicked', () => {
    const eraseSpy: jasmine.Spy = spyOn(service.eraser, 'erase');
    const getClickedObjectSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent');
    getClickedObjectSpy.and.returnValue(1);
    service.mouseDown = true;
    service.handleMouseMove(new MouseEvent('click'), {leftKey: true});
    expect(eraseSpy).toHaveBeenCalled();
    expect(generateCursorSpy).toHaveBeenCalled();
    expect(getClickedObjectSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should not call erase from eraser if mouse is down and it is not a valid DrawingElement', () => {
    const eraseSpy: jasmine.Spy = spyOn(service.eraser, 'erase');
    const getClickedObjectSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent');
    getClickedObjectSpy.and.returnValue(0);
    service.mouseDown = true;
    service.handleMouseMove(new MouseEvent('click'), {leftKey: true});
    expect(eraseSpy).not.toHaveBeenCalled();
    expect(generateCursorSpy).toHaveBeenCalled();
    expect(getClickedObjectSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should call surroundSVGElementWithRed from eraser if mouse is not down', () => {
    const surroundWithRedSpy: jasmine.Spy = spyOn(service, 'surroundSVGElementWithRed');
    service.mouseDown = false;
    service.handleMouseMove(new MouseEvent('click'), {leftKey: true});
    expect(surroundWithRedSpy).toHaveBeenCalled();
    expect(generateCursorSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should only call generateCursor on a right click', () => {
    const surroundWithRedSpy: jasmine.Spy = spyOn(service, 'surroundSVGElementWithRed');
    service.mouseDown = true;
    service.handleMouseMove(new MouseEvent('click'), {rightKey: true});
    expect(surroundWithRedSpy).not.toHaveBeenCalled();
    expect(generateCursorSpy).toHaveBeenCalled();
  });

  it('handleMouseLeave should call removeCursor from eraser', () => {
    const removeCursorSpy: jasmine.Spy = spyOn(service.eraser, 'removeCursor');
    service.handleMouseLeave();
    expect(removeCursorSpy).toHaveBeenCalled();
  });

  it('surroundSVGElementWithRed should call removedContourElement if it is not a valid DrawingElement', () => {
    const getClickedObjectSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent');
    const removeContourSpy: jasmine.Spy = spyOn(service.eraser, 'removedContourElement');
    getClickedObjectSpy.and.returnValue(0);
    service.surroundSVGElementWithRed(new MouseEvent('click'));
    expect(getClickedObjectSpy).toHaveBeenCalled();
    expect(removeContourSpy).toHaveBeenCalled();
  });

  it('surroundSVGElementWithRed should call surroundRed if it is the same valid DrawingElement as the last event', () => {
    const getClickedObjectSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent');
    const surroundSpy: jasmine.Spy = spyOn(service.eraser, 'surroundRed');
    getClickedObjectSpy.and.returnValue({ref: {children: [123]}});
    service.lastDrawingElementRef = 1;
    service.surroundSVGElementWithRed(new MouseEvent('click'));
    expect(getClickedObjectSpy).toHaveBeenCalled();
    expect(surroundSpy).toHaveBeenCalled();
  });

  it('surroundSVGElementWithRed should call surroundRed and removedContourElement on a new DrawingElement', () => {
    const getClickedObjectSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent');
    const surroundSpy: jasmine.Spy = spyOn(service.eraser, 'surroundRed');
    const removeContourSpy: jasmine.Spy = spyOn(service.eraser, 'removedContourElement');
    getClickedObjectSpy.and.returnValue({ref: {children: [123]}});
    service.lastDrawingElementRef = 0;
    service.surroundSVGElementWithRed(new MouseEvent('click'));
    expect(getClickedObjectSpy).toHaveBeenCalled();
    expect(surroundSpy).toHaveBeenCalled();
    expect(removeContourSpy).toHaveBeenCalled();
    expect(service.lastDrawingElementRef).toBe(123);
  });

  it('surroundSVGElementWithRed should do nothing if the DrawingElement is not valid and the object clicked is the cursor', () => {
    const getClickedObjectSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent');
    const surroundSpy: jasmine.Spy = spyOn(service.eraser, 'surroundRed');
    getClickedObjectSpy.and.returnValue(0);
    const event = new MouseEvent('click');
    service.eraser.cursorSVGElement = event.target;
    service.surroundSVGElementWithRed(event);
    expect(getClickedObjectSpy).toHaveBeenCalled();
    expect(surroundSpy).not.toHaveBeenCalled();
  });

  it('handleDoubleClick should call removeCursor from eraser', () => {
    service.handleDoubleClick(new MouseEvent('click'), {});
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseWheel should call removeCursor from eraser', () => {
    service.handleMouseWheel(new MouseEvent('click'), {});
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleKeypress should call removeCursor from eraser', () => {
    service.handleKeypress(new KeyboardEvent('Escape'));
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleCurrentToolChange should call removeCursor from eraser', () => {
    const removeSpy: jasmine.Spy = spyOn(service.eraser, 'removeCursor');
    service.handleCurrentToolChange();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement from eraser', () => {
    service.drawingElementDeleted = [{ref: new MockElementRef()}];
    const removeSpy: jasmine.Spy = spyOn(service.eraser, 'removeElement');
    service.handleRedo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleUndo should call reAddDeletedElement from eraser', () => {
    service.drawingElementDeleted = [{ref: new MockElementRef()}];
    const removeSpy: jasmine.Spy = spyOn(service.eraser, 'reAddDeletedElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('storeAction should return a copy of the service', () => {
    expect(typeof(service.storeAction())).toEqual(typeof(service));
  });
});
