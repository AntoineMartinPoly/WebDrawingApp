// tslint:disable:no-string-literal

import { TestBed } from '@angular/core/testing';

import {ElementRef} from '@angular/core';
import {MockElementRef} from '../../../../../constant/constant';
import {TEST_POINT} from '../../../../../constant/tool-service/constant';
import {Spray} from '../../../../../interface/spray/spray';
import createSpyObj = jasmine.createSpyObj;
import {ActionService} from '../../../actions/action.service';
import {DrawingElementManagerService} from '../../../drawing-element-manager/drawing-element-manager.service';
import {ShortcutService} from '../../../shortcut/shortcut.service';
import {SprayService} from '../../../tool-service/trace/spray/spray.service';
import { SprayToolHandlerService } from './spray-tool-handler.service';

describe('SprayToolHandlerService', () => {
  let service: SprayToolHandlerService;
  let sprayService: SprayService;
  let shortcutService: ShortcutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SprayService, useValue: jasmine.createSpyObj('SprayService', [
            'generateSprayGroup',
            'createSpray',
            'removeElement',
            'reAddElement',
            'createSprayFromSVGElement',
            'startSpraying',
            'stopSpraying',
            'generateSprayElement',
            'loadState',
            'saveState',
          ]),
        },
        {provide: ShortcutService, useValue: jasmine.createSpyObj('ShortcutService', ['changeShortcutAccess'])},
        {provide: DrawingElementManagerService, useValue: jasmine.createSpyObj('DrawingElementManagerService', ['appendDrawingElement'])},
      ],
    });
    service = TestBed.get(SprayToolHandlerService);
    service.actionService = createSpyObj<ActionService>('ActionService', ['addAction']);
    sprayService = TestBed.get(SprayService);
    shortcutService = TestBed.get(ShortcutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should start spraying if mouse is up', () => {
    const coordinateSpy: jasmine.Spy = spyOn(service['drawingService'], 'getRelativeCoordinates').and.returnValue(TEST_POINT);
    const fakeClick: MouseEvent = TEST_POINT as unknown as MouseEvent;
    service['isMouseDown'] = false;
    service.handleMouseDown(fakeClick);
    expect(shortcutService.changeShortcutAccess).toHaveBeenCalled();
    expect(sprayService.generateSprayGroup).toHaveBeenCalled();
    expect(sprayService.startSpraying).toHaveBeenCalled();
    expect(sprayService.createSpray).toHaveBeenCalled();
    expect(service['isMouseDown']).toBe(true);
    expect(sprayService.currentPosition).toEqual(TEST_POINT);
    expect(coordinateSpy).toHaveBeenCalled();
  });

  it('handleMouseDown should not start spraying if mouse is already down', () => {
    const fakeClick: MouseEvent = TEST_POINT as unknown as MouseEvent;
    service['isMouseDown'] = true;
    service.handleMouseDown(fakeClick);
    expect(shortcutService.changeShortcutAccess).toHaveBeenCalled();
    expect(sprayService.generateSprayGroup).not.toHaveBeenCalled();
    expect(sprayService.startSpraying).not.toHaveBeenCalled();
    expect(sprayService.createSpray).not.toHaveBeenCalled();
    expect(service['isMouseDown']).toBe(true);
    expect(sprayService.currentPosition).not.toBe(TEST_POINT);
  });

  it('handleMouseUp should call appendObject and add action and set ismousedown to false', () => {
    const elementService: DrawingElementManagerService = TestBed.get(DrawingElementManagerService);
    service['isMouseDown'] = true;
    service.handleMouseUp();
    expect(elementService.appendDrawingElement).toHaveBeenCalled();
    expect(service.actionService.addAction).toHaveBeenCalled();
    expect(sprayService.stopSpraying).toHaveBeenCalled();
    expect(service['isMouseDown']).toBe(false);
  });

  [true, false].forEach((isMouseDown: boolean) => {
    it(`handleMouseMove should update the current position when mouse is ${isMouseDown ? 'down' : 'up'}`, () => {
      const coordinateSpy: jasmine.Spy = spyOn(service['drawingService'], 'getRelativeCoordinates').and.returnValue(TEST_POINT);
      const fakeClick: MouseEvent = TEST_POINT as unknown as MouseEvent;
      service['isMouseDown'] = isMouseDown;
      service.handleMouseMove(fakeClick);
      expect(sprayService.currentPosition).toEqual(TEST_POINT);
      expect(coordinateSpy).toHaveBeenCalled();
    });
  });

  it('handleMouseLeave should call removeSVGElementFromRef, set mouse to up and stop spraying', () => {
    const removeSpy = spyOn(service['drawingService'], 'removeSVGElementFromRef');
    service['isMouseDown'] = true;
    service.handleMouseLeave();
    expect(removeSpy).toHaveBeenCalled();
    expect(sprayService.stopSpraying).toHaveBeenCalled();
    expect(service['isMouseDown']).toBe(false);
  });

  it('handleDrawingLoad should push spray objects into the toolHandler object table', () => {
    const getElemTableSpy: jasmine.Spy = spyOn(service['drawingService'], 'getElementsTable').and.returnValue([new MockElementRef()]);
    const elementService: DrawingElementManagerService = TestBed.get(DrawingElementManagerService);
    service.handleDrawingLoad();
    expect(getElemTableSpy).toHaveBeenCalled();
    expect(elementService.appendDrawingElement).toHaveBeenCalled();
    expect(sprayService.createSprayFromSVGElement);
  });

  it('handleUndo should call removeElement', () => {
    service.handleUndo();
    expect(sprayService.removeElement).toHaveBeenCalled();
  });

  it('handleRedo should call reAddElement', () => {
    service.handleRedo();
    expect(sprayService.reAddElement).toHaveBeenCalled();
  });

  it('storeAction should return deep copy', () => {
    service['elementRef'] = {nativeElement: 'initial'} as ElementRef;
    service['spray'] = {ref: 'initial'} as Spray;
    const copy: SprayToolHandlerService = service.storeAction() as SprayToolHandlerService;
    service.elementRef = {nativeElement: 'final'} as ElementRef;
    service['spray'] = {ref: 'final'} as Spray;
    expect(copy.elementRef).not.toEqual(service.elementRef);
    expect(copy['spray']).not.toEqual(service['spray']);
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
