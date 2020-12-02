import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/shape/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { DrawingElement } from 'src/interface/drawing-element';
import { ActionService } from '../../actions/action.service';
import { BucketToolHandlerService } from './bucket-tool-handler.service';

describe('BucketToolHandlerService', () => {
  let service: BucketToolHandlerService;
  const FAKE_MOUSE_EVENT = {} as MouseEvent;
  const FAKE_BUCKET = {ref: new MockElementRef()} as DrawingElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(BucketToolHandlerService);
    service.actionService = new ActionService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleMouseDown should call fill addAction appendDrawingElement, set elementref and bucket', () => {
    const actionSpy = spyOn(service.actionService, 'addAction');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const bucketSpy = spyOn(service.bucketService, 'fill').and.returnValue(FAKE_BUCKET);
    service.handleMouseDown(FAKE_MOUSE_EVENT, FAKE_KEY_MODIFIER);
    expect(actionSpy).toHaveBeenCalledWith(service);
    expect(appendSpy).toHaveBeenCalledWith(FAKE_BUCKET);
    expect(bucketSpy).toHaveBeenCalledWith(FAKE_MOUSE_EVENT, FAKE_KEY_MODIFIER);
    expect(service.bucket).toEqual(FAKE_BUCKET);
  });

  it('storeAction should make a deep copy', () => {
    const initialRef = {nativeElement: 'initial'} as ElementRef;
    const finalRef = {nativeElement: 'final'} as ElementRef;
    service.elementRef = initialRef;
    service.bucket = FAKE_BUCKET;
    service.bucket.ref = initialRef;
    const copy = service.storeAction();
    service.bucket = FAKE_BUCKET;
    service.elementRef = finalRef;
    expect(copy.elementRef).toEqual(initialRef);
    expect(copy.bucket.ref).toEqual(initialRef);
  });

  it('handleUndo should call removeElement', () => {
    const removeSpy = spyOn(service.bucketService, 'removeElement');
    service.bucket = FAKE_BUCKET;
    service.handleUndo();
    expect(removeSpy).toHaveBeenCalledWith(FAKE_BUCKET);
  });

  it('handleRedo should call reAddElement', () => {
    const addSpy = spyOn(service.bucketService, 'reAddElement');
    service.bucket = FAKE_BUCKET;
    service.handleRedo();
    expect(addSpy).toHaveBeenCalledWith(FAKE_BUCKET);
  });
});
