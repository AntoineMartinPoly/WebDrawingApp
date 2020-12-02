import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as crypto from 'crypto-ts';
import {WordArray} from 'crypto-ts/src/lib/WordArray';
import { take } from 'rxjs/operators';
import {OPEN_ERROR_MESSAGE} from '../../../../constant/drawing/constant';
import {FAKE_NAME} from '../../../../constant/tool-service/save/constant';
import {SVG_FILE_BEGIN} from '../../../../constant/toolbar/view-drawing/constant';
import { ImageHandlerService } from './image-handler.service';
import {OpenError} from './open-error';

let service: ImageHandlerService;

describe('ImageHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.get(ImageHandlerService);
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDrawingData should send data of drawing and execute a GET request', (done) => {
    const MOCK_HTTP: HttpTestingController = TestBed.get(HttpTestingController);
    service.getDrawingData('FAKE_URL').pipe(take(1)).subscribe();
    const REQUEST: TestRequest = MOCK_HTTP.expectOne('FAKE_URL');
    expect(REQUEST.request.method).toEqual('GET');
    REQUEST.flush({});
    MOCK_HTTP.verify();
    done();
  });

  it('openDrawing should call setSVGSize, createObjectReferences and sendResetDrawingNotification', () => {
    const setSpy: jasmine.Spy = spyOn(service, 'setSVGSize');
    const createSpy: jasmine.Spy = spyOn(service, 'createObjectReferences');
    const sendResetSpy: jasmine.Spy = spyOn(service, 'sendResetDrawingNotification');
    service.openDrawing('fakeLink');
    expect(setSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(sendResetSpy).toHaveBeenCalled();
  });

  it('openDrawing should call setSVGSize, createObjectReferences and sendResetDrawingNotification', () => {
    const setSpy: jasmine.Spy = spyOn(service, 'setSVGSize');
    const createSpy: jasmine.Spy = spyOn(service, 'createObjectReferences');
    const sendResetSpy: jasmine.Spy = spyOn(service, 'sendResetDrawingNotification');
    service.openDrawing('fakeLink');
    expect(setSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(sendResetSpy).toHaveBeenCalled();
  });

  describe('openProprietaryDrawing', () => {
    let toStringSpy: jasmine.Spy;
    let decryptSpy: jasmine.Spy;
    let mockDecryptedMessage: {toString: jasmine.Spy};

    beforeEach(() => {
      toStringSpy = jasmine.createSpy();
      mockDecryptedMessage = {toString: toStringSpy};
      decryptSpy = spyOn(crypto.AES, 'decrypt').and.returnValue(mockDecryptedMessage as unknown as WordArray);
      spyOn(service, 'openDrawing');
    });

    it('should openDrawing if decryption was successful', () => {
      toStringSpy.and.returnValue(SVG_FILE_BEGIN);
      service.openProprietaryDrawing(FAKE_NAME);
      expect(decryptSpy).toHaveBeenCalled();
      expect(service.openDrawing).toHaveBeenCalled();
    });

    it('should not openDrawing if decryption was unsuccessful throw', () => {
      toStringSpy.and.returnValue(FAKE_NAME);
      expect(() => service.openProprietaryDrawing(FAKE_NAME)).toThrow(new OpenError(OPEN_ERROR_MESSAGE));
      expect(decryptSpy).toHaveBeenCalled();
      expect(service.openDrawing).not.toHaveBeenCalled();
    });
  });

});
