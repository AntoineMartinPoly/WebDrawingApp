import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../constant/constant';
import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
  let component: SelectionComponent;
  let fixture: ComponentFixture<SelectionComponent>;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isADrawingSelected when selectionService update his isADrawingSelected', () => {
    component.isADrawingSelected = false;
    // tslint:disable-next-line: no-string-literal
    component.selectionService['aDrawingElementIsSelected'].next(true);
    expect(component.isADrawingSelected).toBe(true);
  });
});
