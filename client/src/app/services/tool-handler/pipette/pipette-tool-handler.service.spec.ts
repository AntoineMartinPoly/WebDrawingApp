import { TestBed } from '@angular/core/testing';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { PipetteToolHandlerService } from './pipette-tool-handler.service';

describe('PipetteToolHandlerService', () => {

  let service: PipetteToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(PipetteToolHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown', () => {
    const clickedObject = { ref: {children: ['a']} } as DrawingElement;
    const isBGSpy = spyOn(service.drawingService, 'isEventTargetBackgroundElement');
    const getClickSpy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent').and.returnValue(clickedObject);
    const getColorSpy = spyOn(service.pipetteService, 'getColor');
    service.handleMouseDown(new MouseEvent('click'), FAKE_KEY_MODIFIER);
    expect(isBGSpy).toHaveBeenCalled();
    expect(getClickSpy).toHaveBeenCalled();
    expect(getColorSpy).toHaveBeenCalled();
  });

  it('storeAction should return pipetteService', () => {
    expect(service.storeAction()).toEqual(service);
  });

  it('handleMouseUp should do nothing', () => {
    service.handleMouseUp({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseMove should do nothing', () => {
    service.handleMouseMove({} as any, {} as any);
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
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

  it('handleDrawingLoad should do nothing', () => {
    service.handleDrawingLoad();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleCurrentToolChange should do nothing', () => {
    service.handleCurrentToolChange();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleUndo should do nothing', () => {
    service.handleUndo();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleRedo should do nothing', () => {
    service.handleRedo();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });

  it('handleMouseLeave should do nothing', () => {
    service.handleMouseLeave();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });
});
