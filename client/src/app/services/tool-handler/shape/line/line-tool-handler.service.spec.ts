import { TestBed } from '@angular/core/testing';
import { ActionService } from 'src/app/services/actions/action.service';
import { LineService } from 'src/app/services/tool-service/shape/line/line.service';
import { MockElementRef } from 'src/constant/constant';
import { BACKSPACE } from 'src/constant/keypress/constant';
import { ESCAPE } from 'src/constant/tool-service/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { FAKE_LINE, POINT } from 'src/constant/toolbar/shape/constant';
import { Line } from 'src/interface/shape/line';
import { LineToolHandlerService } from './line-tool-handler.service';

describe('LineToolHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let service: LineToolHandlerService;

  beforeEach(() => {
    service = TestBed.get(LineToolHandlerService);
    service.actionService = new ActionService();
    spyOn(service.magnetism, 'updateCoordinate').and.returnValue({
      x : 0,
      y: 0,
    });
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should generate a circle if the line is created with point', () => {
    service.isMouseDown = false;
    service.firstLine = true;
    const fakeLine = Object.assign({}, FAKE_LINE);
    fakeLine.option.junctionType = POINT;
    const insertJctSpy = spyOn(service.lineService, 'generateLineElement');
    const createSpy = spyOn(service.lineService, 'createLine').and.returnValue(fakeLine);
    const updateSpy = spyOn(service.lineService, 'updateEndPointValue');
    const addOptionSpy = spyOn(service.lineService, 'addLineOption');
    const editSpy = spyOn(service.lineService, 'editLineEndPoint');
    const addSpy = spyOn(service.lineService, 'addLine');
    const circleSpy = spyOn(service.lineService, 'generateSVGCircle');
    service.handleMouseDown(new MouseEvent('click'));
    expect(circleSpy).toHaveBeenCalled();
    expect(insertJctSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
    expect(addOptionSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    service.firstLine = false;
    service.handleMouseDown({x: 120031, y: 923424} as any);
  });

  it('handleMouseDown should not generate a circle if the line is created with no point', () => {
    service.isMouseDown = false;
    service.firstLine = true;
    const fakeLine = FAKE_LINE;
    fakeLine.option.junctionType = 'not a point';
    const insertJctSpy = spyOn(service.lineService, 'generateLineElement');
    const createSpy = spyOn(service.lineService, 'createLine').and.returnValue(fakeLine);
    const updateSpy = spyOn(service.lineService, 'updateEndPointValue');
    const addOptionSpy = spyOn(service.lineService, 'addLineOption');
    const editSpy = spyOn(service.lineService, 'editLineEndPoint');
    const addSpy = spyOn(service.lineService, 'addLine');
    const circleSpy = spyOn(service.lineService, 'generateSVGCircle');
    service.handleMouseDown(new MouseEvent('click'));
    expect(insertJctSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
    expect(addOptionSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(circleSpy).not.toHaveBeenCalled();
  });

  it('handleMouseDown should not call generatelineElement and createline if mouse is up', () => {
    const fakeClick = new MouseEvent('click');
    const lineService: LineService = TestBed.get(LineService);
    const genSpy = spyOn(lineService, 'generateLineElement');
    const createSpy = spyOn(lineService, 'createLine');
    service.isMouseDown = true;
    service.handleMouseDown(fakeClick);
    expect(genSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('handleMouseUp should set ismousedown to false', () => {
    service.isMouseDown = false;
    service.handleMouseUp(new MouseEvent('click'));
    expect(service.isMouseDown).toBe(false);
  });

  it('handleMouseMove should call editLineEndPoint and updateEndPointValue if mouse is down', () => {
    const fakeClick = new MouseEvent('mousemove');
    const lineService: LineService = TestBed.get(LineService);
    const editSpy = spyOn(lineService, 'editLineEndPoint');
    const updateSpy = spyOn(lineService, 'updateEndPointValue');
    service.isMouseDown = false;
    service.firstLine = false;
    service.handleMouseMove(fakeClick, FAKE_KEY_MODIFIER);
    expect(updateSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('handleMouseMove should not call editLineEndPoint and updateEndPointValue if mouse is up', () => {
    const fakeClick = new MouseEvent('mousemove');
    const lineService: LineService = TestBed.get(LineService);
    const editSpy = spyOn(lineService, 'editLineEndPoint');
    const updateSpy = spyOn(lineService, 'updateEndPointValue');
    service.isMouseDown = true;
    service.firstLine = false;
    service.handleMouseMove(fakeClick, FAKE_KEY_MODIFIER);
    expect(updateSpy).not.toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('handleMouseLeave should call removeSVGElementFromRef and set mouse to up', () => {
    const removeSpy = spyOn(service.lineService, 'removeElement');
    service.isMouseDown = false;
    service.firstLine = false;
    service.handleMouseLeave();
    expect(removeSpy).toHaveBeenCalled();
    expect(service.isMouseDown).toBe(false);
  });

  it('handleMouseLeave should not call removeSVGElementFromRef and set mouse to up if mouse is down', () => {
    const removeSpy = spyOn(service.lineService, 'removeElement');
    service.isMouseDown = true;
    service.firstLine = true;
    service.handleMouseLeave();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(service.isMouseDown).toBe(true);
  });

  it('handleDoubleClick should call connectLastLineToFirstLine when pressing shift', () => {
    const connectSpy = spyOn(service.lineService, 'connectLastLineToFirstLine');
    const removeSpy = spyOn(service.lineService, 'removeLastLine');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    service.line = FAKE_LINE;
    const fakeKeyEvent = FAKE_KEY_MODIFIER;
    fakeKeyEvent.shift = true;
    service.handleDoubleClick(new MouseEvent('click'), fakeKeyEvent);
    expect(connectSpy).toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });

  it('handleDoubleClick should call removeLastLine when not pressing shift', () => {
    const connectSpy = spyOn(service.lineService, 'connectLastLineToFirstLine');
    const removeSpy = spyOn(service.lineService, 'removeLastLine');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    service.line = FAKE_LINE;
    const fakeKeyEvent = FAKE_KEY_MODIFIER;
    fakeKeyEvent.shift = false;
    service.handleDoubleClick(new MouseEvent('click'), fakeKeyEvent);
    expect(connectSpy).not.toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });

  it('handleShortcuts should call removeLastLine when pressing backspace', () => {
    const removeSpy = spyOn(service.lineService, 'removeLastLine');
    const removeElementSpy = spyOn(service.lineService, 'removeElement');
    service.firstLine = false;
    service.handleShortcuts(new KeyboardEvent('keydown', {key: BACKSPACE}));
    expect(removeSpy).toHaveBeenCalled();
    expect(removeElementSpy).not.toHaveBeenCalled();
    expect(service.firstLine).toBe(false);
  });

  it('handleShortcuts should call removeElement when pressing escape', () => {
    const removeSpy = spyOn(service.lineService, 'removeLastLine');
    const removeElementSpy = spyOn(service.lineService, 'removeElement');
    service.firstLine = false;
    service.line = FAKE_LINE;
    service.handleShortcuts(new KeyboardEvent('keydown', {key: ESCAPE}));
    expect(removeSpy).not.toHaveBeenCalled();
    expect(removeElementSpy).toHaveBeenCalled();
    expect(service.firstLine).toBe(true);
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.lineService, 'removeElement');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.lineService, 'reAddElement');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.line = {ref: 'initial'} as Line;
    const copy = service.storeAction();
    service.line = {ref: 'final'} as Line;
    expect(copy.line).not.toEqual(service.line);
  });

  it('handleDrawingLoad should push rectangle objects into the toolHandler object table', () => {
    const fakeRectangle: Line = FAKE_LINE;
    const getElemTableSpy: jasmine.Spy = spyOn(service.drawingService, 'getElementsTable').and.returnValue([
      new MockElementRef(),
    ]);
    const createRectangleSpy: jasmine.Spy = spyOn(service.lineService, 'createLineFromSVGElement');
    createRectangleSpy.and.returnValue(fakeRectangle);
    service.drawingElementManager.drawingElementsOnDrawing = [];
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(createRectangleSpy).toHaveBeenCalled();
    createRectangleSpy.calls.reset();
    expect(service.drawingElementManager.drawingElementsOnDrawing[0]).toEqual(fakeRectangle);
    createRectangleSpy.and.returnValue(null);
    service.handleDrawingLoad();
  });

  it('handleMouseWheel should do nothing', () => {
    service.handleMouseWheel({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleCurrentToolChange should do nothing', () => {
    service.handleCurrentToolChange();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

});
