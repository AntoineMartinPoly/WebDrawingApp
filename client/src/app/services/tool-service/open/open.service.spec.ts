import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppModule } from 'src/app/app.module';
import { FAKE_ID_TAG_TABLE, FAKE_URL } from 'src/constant/tool-service/constant';
import { FAKE_ID, FAKE_TAGS } from 'src/constant/tool-service/save/constant';
import { INDEX_BEGIN } from 'src/constant/toolbar/view-drawing/constant';
import { GET_DRAWING_PATH, GET_IDS_BY_TAGS_PATH, GET_IS_NEXT_PATH } from '../../../../../../common/route';
import { OpenService } from './open.service';

@NgModule({
  imports: [
    AppModule,
  ],
})
class DialogTestModule { }

describe('OpenService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [DialogTestModule, HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: OpenService = TestBed.get(OpenService);
    expect(service).toBeTruthy();
  });

  it('getDrawings should request drawings and execute a POST request', () => {
    const service: OpenService = TestBed.get(OpenService);
    const MOCK_HTTP: HttpTestingController = TestBed.get(HttpTestingController);
    service.getDrawings(INDEX_BEGIN, FAKE_TAGS).pipe(take(1)).subscribe();
    const REQUEST: TestRequest = MOCK_HTTP.expectOne(GET_IDS_BY_TAGS_PATH + INDEX_BEGIN.toString());
    expect(REQUEST.request.method).toEqual('POST');
    REQUEST.flush({});
    MOCK_HTTP.verify();
  });

  it('isNext should request boolean and execute a POST request', () => {
    const service: OpenService = TestBed.get(OpenService);
    const MOCK_HTTP: HttpTestingController = TestBed.get(HttpTestingController);
    service.isNext(INDEX_BEGIN, FAKE_TAGS).pipe(take(1)).subscribe();
    const REQUEST: TestRequest = MOCK_HTTP.expectOne(GET_IS_NEXT_PATH + INDEX_BEGIN.toString());
    expect(REQUEST.request.method).toEqual('POST');
    REQUEST.flush({});
    MOCK_HTTP.verify();
  });

  it('getDrawingInfo should request drawing and execute a GET request', () => {
    const service: OpenService = TestBed.get(OpenService);
    const MOCK_HTTP: HttpTestingController = TestBed.get(HttpTestingController);
    service.getDrawingInfo(FAKE_ID).pipe(take(1)).subscribe();
    const REQUEST: TestRequest = MOCK_HTTP.expectOne(GET_DRAWING_PATH + FAKE_ID);
    expect(REQUEST.request.method).toEqual('GET');
    REQUEST.flush({});
    MOCK_HTTP.verify();
  });

  it('getImageUrl should request image url by calling function getDownloadURL', () => {
    const mockFct: any = {
      // tslint:disable-next-line: no-empty
      getDownloadURL(): any {},
    };
    const service: OpenService = TestBed.get(OpenService);
    spyOn(service.firebaseStorage, 'ref').and.returnValue(mockFct);
    spyOn(mockFct, 'getDownloadURL').and.returnValue(of({}));
    service.getImageUrl(FAKE_ID);
    expect(service.getImageUrl(FAKE_ID) instanceof Observable).toBe(true);
  });

  it('stringifyTagList should create a string that reflects the tagTable of element', () => {
    const service: OpenService = TestBed.get(OpenService);
    service.stringifyTagList(FAKE_ID_TAG_TABLE);
    expect(FAKE_ID_TAG_TABLE[0].tagsOnString).toMatch('a, b, c');
    expect(FAKE_ID_TAG_TABLE[1].tagsOnString).toMatch('');
  });

  it('getDrawingImageUrl should call getImageUrl for each drawing thats it pulling', () => {
    const service: OpenService = TestBed.get(OpenService);
    const getImgSpy: jasmine.Spy = spyOn(service, 'getImageUrl').and.returnValue(of(FAKE_URL));
    service.getDrawingImageUrl(FAKE_ID_TAG_TABLE);
    expect(FAKE_ID_TAG_TABLE[0].link).toMatch(FAKE_URL);
    expect(FAKE_ID_TAG_TABLE[1].link).toMatch(FAKE_URL);
    expect(getImgSpy).toHaveBeenCalledTimes(FAKE_ID_TAG_TABLE.length);
  });

});
