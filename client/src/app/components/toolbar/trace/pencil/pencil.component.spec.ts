import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../../constant/constant';
import { PencilComponent } from './pencil.component';

@NgModule({
  imports: [
    AppModule,
  ],
})
class DialogTestModule { }

describe('PencilComponent', () => {
  let component: PencilComponent;
  let fixture: ComponentFixture<PencilComponent>;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeShortcutAccess should changeShortcutAccess of shortcut service', () => {
    const changeSpy: jasmine.Spy = spyOn(component.shortcutService, 'changeShortcutAccess');
    component.changeShortcutAccess(false);
    expect(changeSpy).toHaveBeenCalled();
  });
});
