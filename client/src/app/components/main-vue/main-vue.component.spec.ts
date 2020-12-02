import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';
import { DEACTIVATED } from 'src/constant/storage/constant';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../constant/constant';
import { MainVueComponent } from './main-vue.component';

describe('MainVueComponent', () => {
  let component: MainVueComponent;
  let fixture: ComponentFixture<MainVueComponent>;

  @NgModule({
    imports: [
      AppModule,
    ],
  })
  class DialogTestModule { }

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogTestModule,
      ],
      providers: [ TutorialService, MatDialog, StorageService, ReactiveFormsModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainVueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('After the page is loaded, a dialog should popup if the tutorial is active, and should not otherwise', () => {
      const dialogSpy: jasmine.Spy = spyOn(component.dialog, 'open');
      const storage: StorageService = TestBed.get(StorageService);
      const tutorial: TutorialService = TestBed.get(TutorialService);
      storage.deleteAll();
      component.ngOnInit();
      expect(dialogSpy).toHaveBeenCalled();
      dialogSpy.calls.reset();
      tutorial.saveIsTutorialActive(DEACTIVATED);
      component.ngOnInit();
      expect(dialogSpy).not.toHaveBeenCalled();
  });

});
