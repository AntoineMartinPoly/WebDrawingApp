import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_STAMP, STAMP_URL_1, STAMP_URL_2, STAMP_URL_3, STAMP_URL_4, STAMP_URL_5 } from 'src/constant/stamp/constant';
import { STAMP_OPTION_IMAGE, STAMP_OPTION_ROTATE, STAMP_OPTION_SCALE } from 'src/constant/storage/constant';
import { Stamp, StampType } from 'src/interface/stamp/stamp';
import { DrawingService } from '../../drawing/drawing.service';
import { StampService } from './stamp.service';

describe('StampService', () => {

  let service: StampService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(StampService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateStampElement should call generateSVGElement / addSVGElementFromRef / setSVGattribute / addSVGToSVG', () => {
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const SVGSpy = spyOn(service.drawingService, 'addSVGToSVG');
    service.generateStampElement();
    expect(addSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(SVGSpy).toHaveBeenCalled();
  });

  it('createStampFromSVGElement should call getSVGElementAttributes', () => {
    const fakeTextElement = new MockElementRef();
    (fakeTextElement as any).children = [''];
    const fakeStamp: Stamp = {
      ref: new MockElementRef(),
      origin: {
        x: 0,
        y: 0,
      },
      height: 0,
      width: 0,
      link: '',
      scale: 0,
      rotate: 0,
    };
    const getSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    getSVGSpy.withArgs('', 'x').and.returnValue(0);
    getSVGSpy.withArgs('', 'y').and.returnValue(0);
    getSVGSpy.withArgs('', 'height').and.returnValue(0);
    getSVGSpy.withArgs('', 'width').and.returnValue(0);
    getSVGSpy.withArgs('', 'href').and.returnValue('');
    const stamp = service.createStampFromSVGElement(fakeTextElement);
    expect(stamp.origin).toEqual(fakeStamp.origin);
    expect(stamp.height).toEqual(fakeStamp.height);
    expect(stamp.width).toEqual(fakeStamp.width);
    expect(stamp.scale).toEqual(fakeStamp.scale);
    expect(stamp.rotate).toEqual(fakeStamp.rotate);
    expect(getSVGSpy).toHaveBeenCalledTimes(5);

  });

  it('createStamp should getRelativeCoordinates and return stamp', () => {
    const drawingService = DrawingService.getInstance();
    const genSpy = spyOn(drawingService, 'getRelativeCoordinates').and.returnValue(FAKE_STAMP.origin);
    spyOn(service, 'getStampUrl').and.returnValue(FAKE_STAMP.link);
    const mockMouseEvent = {} as MouseEvent;
    service.storage.set(STAMP_OPTION_SCALE, FAKE_STAMP.scale.toString());
    service.storage.set(STAMP_OPTION_ROTATE, FAKE_STAMP.rotate.toString());
    const fakeStamp = service.createStamp(new MockElementRef(), mockMouseEvent);
    expect(genSpy).toHaveBeenCalled();
    expect(fakeStamp).toBeTruthy();
  });

  it('getStampUrl should return appropriate url', () => {
    expect(service.getStampUrl()).toEqual('');
    service.storage.set(STAMP_OPTION_IMAGE, StampType.Chrome);
    expect(service.getStampUrl()).toEqual(STAMP_URL_1);
    service.storage.set(STAMP_OPTION_IMAGE, StampType.Sonic);
    expect(service.getStampUrl()).toEqual(STAMP_URL_2);
    service.storage.set(STAMP_OPTION_IMAGE, StampType.GOD_1);
    expect(service.getStampUrl()).toEqual(STAMP_URL_3);
    service.storage.set(STAMP_OPTION_IMAGE, StampType.GOD_2);
    expect(service.getStampUrl()).toEqual(STAMP_URL_4);
    service.storage.set(STAMP_OPTION_IMAGE, StampType.Deer);
    expect(service.getStampUrl()).toEqual(STAMP_URL_5);
  });

  it('editStamp should call setSVGAttribute 6 times', () => {
    const setSpy = spyOn(DrawingService.getInstance(), 'setSVGattribute');
    const fakeStamp = FAKE_STAMP;
    fakeStamp.ref = {children: [123], nativeElement: 'asd', getBoundingClientRect() { return 'a'; }} as MockElementRef;
    service.editStamp(fakeStamp);
    expect(setSpy).toHaveBeenCalledTimes(6);
  });

  it('modifierRotateStamp should call setSVGattribute', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeStamp: Stamp = FAKE_STAMP;
    fakeStamp.ref = new MockElementRef();
    (fakeStamp.ref as any).children = [''];
    service.modifierRotateStamp(0, fakeStamp);
    expect(setSpy).toHaveBeenCalled();
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const fakeStamp: Stamp = FAKE_STAMP;
    service.removeElement(fakeStamp);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef and appendObject', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const fakeStamp: Stamp = FAKE_STAMP;
    service.reAddElement(fakeStamp);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });
});
