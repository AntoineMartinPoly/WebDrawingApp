import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { EraserService } from 'src/app/services/tool-service/eraser/eraser.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../constant/constant';
import { EraserComponent } from './eraser.component';

@NgModule({
  imports: [
    AppModule,
  ],
})
class DialogTestModule { }

describe('EraserComponent', () => {
  let component: EraserComponent;
  let fixture: ComponentFixture<EraserComponent>;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DialogTestModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const toolbarService: ToolbarService = TestBed.get(ToolbarService);
    const eraserService: EraserService = TestBed.get(EraserService);
    spyOn(toolbarService, 'initiateHandlerUpdate');
    spyOn(toolbarService, 'sendCursorUpdate');
    spyOn(eraserService, 'generateCursor');
    fixture = TestBed.createComponent(EraserComponent);
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
