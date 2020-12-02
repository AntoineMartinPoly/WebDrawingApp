import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import * as crypto from 'crypto-ts';
import {CipherParams} from 'crypto-ts/src/lib/CipherParams';
import { take } from 'rxjs/operators';
import { DEFAULT_NAME_IMG, FAKE_DRAWING, FAKE_ID, FAKE_NAME, FAKE_SRC, FAKE_TAG_DUP,
  FAKE_TAG_NOT_DUP, FAKE_TAGS, MOCK_SRC } from 'src/constant/tool-service/save/constant';
import { environment } from 'src/environments/environment';
import { Drawing } from 'src/interface/drawing';
import { SAVE_DRAWING_PATH, SAVE_ID_TAG_PATH } from '../../../../../../common/route';
import { SaveService } from './save.service';

describe('SaveService', () => {
  let service: SaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularFireModule.initializeApp(environment.firebase), AngularFireStorageModule],
      providers: [Renderer2],
    });
    service = TestBed.get(SaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateDrawingObject should generate a drawing object and call generateId and DrawingInfo', () => {
    const fakeDrawing: Drawing = service.generateDrawingObject(FAKE_NAME, [{ref: ''}], FAKE_TAGS);
    expect(fakeDrawing.name).toMatch(FAKE_NAME);
    expect(fakeDrawing.tags).toEqual(FAKE_TAGS);
    expect(fakeDrawing.drawing).toEqual([{ref: ''}]);
  });

  // it('sendDrawing should send an ObjectData to the observable', (done) => {
  //   service.getDrawingSubscription().subscribe((fakeList: ObjectData[]) => {
  //     expect(fakeList).toEqual([FAKE_RECTANGLE_OBJECT]);
  //     done();
  //   });
  //   service.sendDrawing([FAKE_RECTANGLE_OBJECT]);
  // });

  it('sendImage should call convertImageSrcToFile and upload', () => {
    const convertSpy: jasmine.Spy = spyOn(service, 'convertImageSrcToFile');
    const uploadSpy: jasmine.Spy = spyOn(service.firebaseStorage, 'upload');
    service.sendImage(FAKE_ID, FAKE_SRC);
    expect(convertSpy).toHaveBeenCalled();
    expect(uploadSpy).toHaveBeenCalled();
  });

  it('convertImageSrcToFile should return a file with a default name', () => {
    const mockFile: File = service.convertImageSrcToFile(MOCK_SRC);
    expect(mockFile.name).toMatch(DEFAULT_NAME_IMG);
  });

  it('isTagDuplicated should return a file with a default name', () => {
    expect(service.isTagDuplicated(FAKE_TAGS, FAKE_TAG_DUP)).toBe(true);
    expect(service.isTagDuplicated(FAKE_TAGS, FAKE_TAG_NOT_DUP)).toBe(false);
  });

  it('saveDrawing should send drawing object, call sendImage and execute a POST request', (done) => {
    const MOCK_HTTP: HttpTestingController = TestBed.get(HttpTestingController);
    service.saveDrawing(FAKE_DRAWING).pipe(take(1)).subscribe();
    const REQUEST: TestRequest = MOCK_HTTP.expectOne(SAVE_DRAWING_PATH);
    expect(REQUEST.request.method).toEqual('POST');
    REQUEST.flush({});
    MOCK_HTTP.verify();
    done();
  });

  // it('createImageSrc should return a string in base64', () => {
  //   const service: SaveService = TestBed.get(SaveService);
  //   expect(service.createImageSrc()).not.toBeNull();
  // });

  it('createProprietaryImgSrc should return an encrypted base64 string', () => {
    const toStringSpy = jasmine.createSpy();
    const mockEncryptedMessage = {toString: toStringSpy};
    const encryptSpy = spyOn(crypto.AES, 'encrypt').and.returnValue(mockEncryptedMessage as unknown as CipherParams);
    const mockXmlSerializer = {serializeToString: jasmine.createSpy()};
    service.createProprietaryImageSrc(mockXmlSerializer);
    expect(encryptSpy).toHaveBeenCalled();
  });

  it('saveIdTagRelation should send drawing info and execute a POST request', (done) => {
    const MOCK_HTTP: HttpTestingController = TestBed.get(HttpTestingController);
    service.saveIdTagRelation('', '', ['']).pipe(take(1)).subscribe();
    const REQUEST: TestRequest = MOCK_HTTP.expectOne(SAVE_ID_TAG_PATH);
    expect(REQUEST.request.method).toEqual('POST');
    REQUEST.flush({});
    MOCK_HTTP.verify();
    done();
  });

});
