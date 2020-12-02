import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {NgModule} from '@angular/core';
import {AppModule} from '../../../../app.module';
import { FeatherComponent } from './feather.component';

@NgModule({
  imports: [
    AppModule,
  ],
})
class DialogTestModule { }

describe('FeatherComponent', () => {
  let component: FeatherComponent;
  let fixture: ComponentFixture<FeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DialogTestModule ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherComponent);
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

  // it('ngOnInit get rotation Angle', () => {
  //   component.ngOnInit();
  // });
});
