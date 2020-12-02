import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { FAKE_ID_TAG_TABLE } from 'src/constant/tool-service/constant';
import { DOWN_INDEX, NO_DRAWING_SELECTED, NO_NEXT, UP_INDEX } from 'src/constant/toolbar/view-drawing/constant';
import { ViewDrawingComponent } from './view-drawing.component';

describe('ViewDrawingsComponent', () => {
  let component: ViewDrawingComponent;
  let fixture: ComponentFixture<ViewDrawingComponent>;

  @NgModule({
    imports: [
      AppModule,
    ],
  })
  class DialogTestModule { }

  const mockClose = {
    close: () => false,
  };

  const mockSnackBar = {
    // Open cannot have just any return type.
    // tslint:disable-next-line: no-empty
    open: () => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: mockClose },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ]})
      .compileComponents();
    fixture = TestBed.createComponent(ViewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call loadDrawing', () => {
    const loadSpy: jasmine.Spy = spyOn(component, 'loadDrawing');
    loadSpy.calls.reset();
    component.ngOnInit();
    expect(loadSpy).toHaveBeenCalled();
  });

  it('loadDrawing should call getDrawings, stringifyTagList, getDrawingImageUrl, isThereNexPage, set isNext and isReady value', () => {
    const getIdSpy: jasmine.Spy = spyOn(component.open, 'getDrawings').and.returnValue(of(FAKE_ID_TAG_TABLE));
    const stringifySpy: jasmine.Spy = spyOn(component.open, 'stringifyTagList');
    const getImgUrlSpy: jasmine.Spy = spyOn(component.open, 'getDrawingImageUrl');
    const isNextSpy: jasmine.Spy = spyOn(component.open, 'isNext').and.returnValue(of(NO_NEXT));
    component.loadDrawing();
    expect(getIdSpy).toHaveBeenCalled();
    expect(stringifySpy).toHaveBeenCalled();
    expect(getImgUrlSpy).toHaveBeenCalled();
    expect(isNextSpy).toHaveBeenCalled();
    expect(component.isNext).toBe(NO_NEXT);
    expect(component.isReady).toBe(true);
  });

  it('openSelectedImage should call getDrawingData and openDrawing from imageHandler service', () => {
    const getIdSpy: jasmine.Spy = spyOn(component.imageHandler, 'getDrawingData').and.returnValue(of(''));
    const stringifySpy: jasmine.Spy = spyOn(component.imageHandler, 'openDrawing');
    component.drawingsTable = FAKE_ID_TAG_TABLE;
    component.drawingsTable[0].link = 'FAKE_LINK';
    component.selectedDrawing = 0;
    component.openSelectedImage();
    expect(getIdSpy).toHaveBeenCalled();
    expect(stringifySpy).toHaveBeenCalled();
  });

  it('upIndex should increase or decrease index value depending on boolean value', () => {
    component.upIndex(UP_INDEX);
    expect(component.imgIndex).toBe(1);
    component.upIndex(DOWN_INDEX);
    expect(component.imgIndex).toBe(0);
    expect(component.selectedDrawing).toBe(NO_DRAWING_SELECTED);
  });

  it('removeTag should remove tag from selectedTags, reset imgIndex to 0, isReady to false and call loadDrawing()', () => {
    const loadSpy: jasmine.Spy = spyOn(component, 'loadDrawing');
    loadSpy.calls.reset();
    component.selectedTags = ['a', 'b', 'c'];
    component.imgIndex = 32;
    component.isReady = true;
    component.removeTag(component.selectedTags[1]);
    expect(component.selectedTags.length).toBe(2);
    expect(component.selectedTags[0]).toMatch('a');
    expect(component.selectedTags[1]).toMatch('c');
    expect(component.imgIndex).toBe(0);
    expect(component.isReady).toBe(false);
    expect(loadSpy).toHaveBeenCalled();
  });

  it('removeTag should do nothing if the object doesnt exist', () => {
    const loadSpy: jasmine.Spy = spyOn(component, 'loadDrawing');
    loadSpy.calls.reset();
    component.selectedTags = ['a', 'b', 'c'];
    component.imgIndex = 32;
    component.isReady = true;
    component.removeTag('d');
    expect(component.selectedTags.length).toBe(3);
    expect(component.imgIndex).toBe(32);
    expect(component.isReady).toBe(true);
    expect(loadSpy).not.toHaveBeenCalled();
  });

  it('addTag should add tag to selectedTags, reset imgIndex to 0, isReady to false and call loadDrawing()', () => {
    const mockTag = 'bob';
    const loadSpy: jasmine.Spy = spyOn(component, 'loadDrawing');
    loadSpy.calls.reset();
    component.selectedTags = [];
    component.imgIndex = 32;
    component.isReady = true;
    component.addTag(mockTag);
    expect(component.selectedTags.length).toBe(1);
    expect(component.selectedTags[0]).toMatch('bob');
    expect(component.imgIndex).toBe(0);
    expect(component.isReady).toBe(false);
    expect(loadSpy).toHaveBeenCalled();
  });

  it('addTag should do nothing if tag is empty or already exist in selectedTags', () => {
    const loadSpy: jasmine.Spy = spyOn(component, 'loadDrawing');
    loadSpy.calls.reset();
    component.selectedTags = ['a'];
    component.imgIndex = 32;
    component.isReady = true;
    component.addTag('');
    expect(component.selectedTags.length).toBe(1);
    expect(component.imgIndex).toBe(32);
    expect(component.isReady).toBe(true);
    expect(loadSpy).not.toHaveBeenCalled();
    component.addTag('a');
    expect(component.selectedTags.length).toBe(1);
    expect(component.imgIndex).toBe(32);
    expect(component.isReady).toBe(true);
    expect(loadSpy).not.toHaveBeenCalled();
  });

  it('isTagDuplicate should return true if tag is duplicate and false otherwise', () => {
    component.selectedTags = ['a'];
    expect(component.isTagDuplicate('a')).toBe(true);
    expect(component.isTagDuplicate('b')).toBe(false);
  });

});
