import { TestBed } from '@angular/core/testing';

import { DrawingElementManagerService } from './drawing-element-manager.service';

describe('DrawingElementManagerService', () => {
  let service: DrawingElementManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DrawingElementManagerService);
    service.drawingElementsOnDrawing = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getClickedDrawingElement should return drawing element who is equal to event.target', () => {
    const clickEvent = new MouseEvent('click');
    const fakeRef = {value: 123, enumerable: true};
    Object.defineProperty(clickEvent, 'target', fakeRef);
    service.drawingElementsOnDrawing = [{ref: 123}, {ref: 'asd'}];
    expect(service.getClickedDrawingElement(clickEvent)).toEqual({ref: 123});
  });

  it('getClickedDrawingElement should return null if no match was found for event target', () => {
    const clickEvent = new MouseEvent('click');
    const fakeRef = {value: 456, enumerable: true};
    Object.defineProperty(clickEvent, 'target', fakeRef);
    service.drawingElementsOnDrawing = [{ref: 123}, {ref: 'asd'}];
    expect(service.getClickedDrawingElement(clickEvent)).toEqual(undefined);
  });

  it('getClickedDrawingElementFromParent should return drawing element who is equal to event.target parent', () => {
    const isChildClickedSpy: jasmine.Spy = spyOn(service, 'isChildClickedEvent');
    isChildClickedSpy.and.returnValue(true);
    const clickEvent = new MouseEvent('click');
    const fakeRef = {value: 123, enumerable: true};
    Object.defineProperty(clickEvent, 'target', fakeRef);
    service.drawingElementsOnDrawing = [{ref: {children: [123, 'asd']}}, {ref: {children: ['asd', 789]}}];
    expect(service.getClickedDrawingElementFromParent(clickEvent)).toEqual({ref: {children: [123, 'asd']}});
  });

  it('getClickedDrawingElementFromParent should return null if no match was found for event target parent', () => {
    const isChildClickedSpy: jasmine.Spy = spyOn(service, 'isChildClickedEvent');
    isChildClickedSpy.and.returnValue(false);
    const clickEvent = new MouseEvent('click');
    const fakeRef = {value: 456, enumerable: true};
    Object.defineProperty(clickEvent, 'target', fakeRef);
    service.drawingElementsOnDrawing = [{ref: {children: [123, 'asd']}}, {ref: {children: ['asd', 789]}}];
    expect(service.getClickedDrawingElementFromParent(clickEvent)).toEqual(undefined);
  });

  it('isChildClickedEvent should return true if the event target is a child of the drawing element', () => {
    const clickEvent = new MouseEvent('click');
    const fakeRef = {value: 123, enumerable: true};
    Object.defineProperty(clickEvent, 'target', fakeRef);
    expect(service.isChildClickedEvent(clickEvent, {ref: {children: [123, 'asd']}})).toEqual(true);
  });

  it('isChildClickedEvent should return false if the event target is not a child of the drawing element', () => {
    const clickEvent = new MouseEvent('click');
    const fakeRef = {value: 123, enumerable: true};
    Object.defineProperty(clickEvent, 'target', fakeRef);
    expect(service.isChildClickedEvent(clickEvent, {ref: {children: [456, 'qwe']}})).toEqual(false);
  });

  it('getLastDrawingElement should return last drawing element of drawing element on drawing array', () => {
    service.drawingElementsOnDrawing = [{ref: {children: [123, 'asd']}}, {ref: {children: ['asd', 789]}}];
    expect(service.getLastDrawingElement()).toEqual({ref: {children: ['asd', 789]}});
  });

  it('appendDrawingElement should append drawing element in paremeter to drawing element on drawing array', () => {
    service.drawingElementsOnDrawing = [];
    service.appendDrawingElement({ref: {children: ['asd', 789]}});
    expect(service.drawingElementsOnDrawing).toEqual([{ref: {children: ['asd', 789]}}]);
  });

  it('appendDrawingElements should append drawing elements in paremeter to drawing element on drawing array', () => {
    service.drawingElementsOnDrawing = [];
    service.appendDrawingElements([{ref: {children: [123, 'asd']}}, {ref: {children: ['asd', 789]}}]);
    expect(service.drawingElementsOnDrawing).toEqual([{ref: {children: [123, 'asd']}}, {ref: {children: ['asd', 789]}}]);
  });

  it('pushDrawingElementAtFirstPosition should shift drawing element in paremeter to drawing element on drawing array', () => {
    service.drawingElementsOnDrawing = [{ref: {children: ['asd', 789]}}];
    service.pushDrawingElementAtFirstPosition({ref: {children: [123, 'asd']}});
    expect(service.drawingElementsOnDrawing).toEqual([{ref: {children: [123, 'asd']}}, {ref: {children: ['asd', 789]}}]);
  });

  it('removeDrawingElement should remove drawing element in paremeter from drawing element on drawing array', () => {
    service.drawingElementsOnDrawing = [{ref: {children: [123, 'asd']}}, {ref: {children: ['asd', 789]}}];
    service.removeDrawingElement({ref: {children: [123, 'asd']}});
    expect(service.drawingElementsOnDrawing).toEqual([{ref: {children: [123, 'asd']}}]);
  });

  it('removeFirstDrawingElement should shift drawing element in paremeter to drawing element on drawing array', () => {
    service.drawingElementsOnDrawing = [{ref: {children: [123, 'asd']}}, {ref: {children: ['asd', 789]}}];
    expect(service.removeFirstDrawingElement()).toEqual({ref: {children: [123, 'asd']}});
    expect(service.drawingElementsOnDrawing).toEqual([{ref: {children: ['asd', 789]}}]);
  });
});
