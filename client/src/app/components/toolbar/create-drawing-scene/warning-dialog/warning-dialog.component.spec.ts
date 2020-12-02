import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { AppModule } from 'src/app/app.module';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../../constant/constant';
// import { ColorPickerComponent } from '../../color-picker/color-picker.component';
import { WarningDialogComponent } from './warning-dialog.component';

describe('WarningDialogComponent', () => {
  let component: WarningDialogComponent;
  let fixture: ComponentFixture<WarningDialogComponent>;
// tslint:disable-next-line: no-empty
  // const colorPicker = {ngAfterViewInit: () => {}} as ColorPickerComponent;

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
      providers: [ MatDialog,
        // tslint:disable-next-line: no-empty
        { provide: MatDialogRef, useValue: {close: () => {}}},
// tslint:disable-next-line: no-empty
        { provide: MatDialog, useValue: {open: () => ({componentInstance: {colorPicker: {ngAfterViewInit: () => {}}}})}},
        { provide: MAT_DIALOG_DATA },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningDialogComponent);
    component = fixture.componentInstance;
    // component.colorPicker = colorPicker;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
