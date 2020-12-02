import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef} from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import {COMPONENT_TEST_DEFAULT_TIMEOUT, MockElementRef, SEVEN} from 'src/constant/constant';
import {FAKE_ELLIPSE} from '../../../constant/shape/constant';
import {
  CREATE,
  CREATE_DRAWING,
  GALLERY,
  SAVE,
  TUTORIAL,
  VIEW_DRAWING
} from '../../../constant/toolbar/constant';
import {WarningDialogComponent} from './create-drawing-scene/warning-dialog/warning-dialog.component';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  @NgModule({
    imports: [
      AppModule,
    ],
  })
  class DialogTestModule { }

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DialogTestModule ],
      providers: [  { provide: MatDialogRef, useValue: {open: () => true} },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    DrawingService.getInstance().svg = new MockElementRef();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selectTool should set tool index and call setModifierTool', () => {
    component.selectTool(SEVEN);
    expect(component.toolSelector).toEqual(SEVEN);
  });

  it('openComponentDialog should call dialog.open when component equal SAVE', () => {
    const dialogSpy: jasmine.Spy = spyOn(component.dialog, 'open');
    component.openComponentDialog(SAVE);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openComponentDialog should call dialog.open when component equal Tutorial', () => {
    const dialogSpy: jasmine.Spy = spyOn(component.dialog, 'open');
    component.openComponentDialog(TUTORIAL);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openComponentDialog should call dialog.open when component equal Create and SVGobjectList is not empty', () => {
    const dialogSpy: jasmine.Spy = spyOn(component.dialog, 'open');
    component.drawingElementManager.appendDrawingElement(FAKE_ELLIPSE);
    component.openComponentDialog(CREATE);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openComponentDialog should call dialog.open when component equal GALLERY and SVGobjectList is empty', () => {
    const dialogSpy: jasmine.Spy = spyOn(component.dialog, 'open');
    component.drawingElementManager.drawingElementsOnDrawing = [];
    component.openComponentDialog(GALLERY);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('openComponentDialog should call dialog.open when component equal GALLERY and SVGobjectList is not empty', () => {
    component.drawingElementManager.appendDrawingElement(FAKE_ELLIPSE);
    component.openComponentDialog(GALLERY);
    expect(component.dialog.open(WarningDialogComponent, {
      data: VIEW_DRAWING,
    }));
  });

  it('ngOnInit get Window and set dialog.open(CreateDrawingSceneComponent) to colorPicker' +
    'when window equal CreateDrawingSceneComponent', () => {
    const shortcutSpy: jasmine.Spy = spyOn(component, 'shortcutSubscription');
    const toolSpy: jasmine.Spy = spyOn(component, 'toolInUseSubscription');
    component.toolbarService.sendWindow(CREATE_DRAWING);
    component.ngOnInit();
    expect(toolSpy).toHaveBeenCalled();
    expect(shortcutSpy).toHaveBeenCalled();
  });

  it('@hHostListner should call createShortCutObject and set shortcutEnable to false ', () => {
    const event = new KeyboardEvent('window:keypress');
    component.shortcutEnable = true;
    component.isToolInUse = false;
    component.shortcutService.createShortcutObject(event).isCtrl = true;
    component.shortcut(event);
    expect(component.shortcutEnable).toEqual(true);
  });

  it('shortcutSubscription should apply shortcut Access', () => {
    component.shortcutService.changeShortcutAccess(true);
    component.shortcutSubscription();
    expect(component.shortcutEnable).toEqual(true);
  });

  it('toolInUseSubscription should get tool in use state', () => {
    component.shortcutService.changeShortcutAccess(true, false);
    component.toolInUseSubscription();
    expect(component.isToolInUse).toEqual(true);
  });

});
