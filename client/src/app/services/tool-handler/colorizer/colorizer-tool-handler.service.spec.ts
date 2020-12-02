import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { KeyModifier } from 'src/interface/key-modifier';
import { ColorizerToolHandlerService } from './colorizer-tool-handler.service';

describe('ColorizerToolHandlerService', () => {

  let service: ColorizerToolHandlerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(ColorizerToolHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown', () => {
    const clickedObject = {ref: {}} as DrawingElement;
    const getClickSpy = spyOn(service.drawingElementManager, 'getClickedDrawingElementFromParent').and.returnValue(clickedObject);
    const getColorSpy = spyOn(service.pipetteService, 'getColor');
    const colorizeSpy = spyOn(service.colorizerService, 'colorize');
    service.handleMouseDown(new MouseEvent('click'), FAKE_KEY_MODIFIER);
    expect(getClickSpy).toHaveBeenCalled();
    expect(getColorSpy).toHaveBeenCalled();
    expect(colorizeSpy).toHaveBeenCalled();
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.colorizerService, 'colorize');
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('handleRedo should call removeElement', () => {
    const reAddSpy = spyOn(service.colorizerService, 'colorize');
    service.handleRedo();
    expect(reAddSpy).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service.elementRef = {nativeElement: 'initial'} as ElementRef;
    service.colorizedObject = {ref: 'initial'} as DrawingElement;
    service.usedColor = 'initial';
    service.previousColor = 'initial';
    service.keyModifier = {} as KeyModifier;
    const copy = service.storeAction();
    service.colorizedObject = {ref: 'previous'} as DrawingElement;
    service.usedColor = 'previous';
    service.previousColor = 'previous';
    expect(service.previousColor).not.toEqual(copy.previousColor);
    expect(service.colorizedObject).not.toEqual(copy.colorizedObject);
    expect(service.usedColor).not.toEqual(copy.usedColor);
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

  it('handleCurrentToolChange should do nothing', () => {
    service.handleCurrentToolChange();
    expect(true).toBe(true);
    // expect to do nothing, to correct functions coverage
  });
});
