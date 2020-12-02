import { DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import {COMPONENT_TEST_DEFAULT_TIMEOUT, PRIMARY_COLOR} from 'src/constant/constant';
import { ColorRGBA } from 'src/interface/colors';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let canvasPrimary: DebugElement;
  let canvasSecondary: DebugElement;

  @NgModule({
    imports: [
      AppModule,
    ],
  })
  class DialogTestModule { }

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvasPrimary = fixture.debugElement.query(By.css('#primary'));
    canvasSecondary = fixture.debugElement.query(By.css('#secondary'));
    component.colorService.isPrimaryCanvasSelected = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeShortcutAccess should changeShortcutAccess of shortcut service', () => {
    const changeSpy: jasmine.Spy = spyOn(component.shortcutService, 'changeShortcutAccess');
    component.changeShortcutAccess(false);
    expect(changeSpy).toHaveBeenCalled();
  });

  it('should an update color when a useColor is clicked', (done) => {
    const usedColorUpdateSpy: jasmine.Spy = spyOn(component, 'usedColorUpdate');
    canvasSecondary.triggerEventHandler('click', {offsetX: 0, offsetY: 0});
    expect(usedColorUpdateSpy).toHaveBeenCalledTimes(0);
    const oldColor = fixture.debugElement.query(By.css('.oldColor'));
    oldColor.triggerEventHandler('click', {offsetX: 0, offsetY: 0});

    fixture.whenStable().then(() => {
      expect(usedColorUpdateSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should update both color when switchColor() is called', () => {
    const fillSpy: jasmine.Spy = spyOn(component.colorService, 'fillCanvas');
    component.switchColor();
    expect(fillSpy).toHaveBeenCalledTimes(3);
  });

  it('should update primary color when one of the ten old colors is clicked', (done) => {
    const oldColor = fixture.debugElement.query(By.css('.oldColor'));
    component.colorService.isPrimaryCanvasSelected = true;
    oldColor.triggerEventHandler('click', {offsetX: 10, offsetY: 10});
    fixture.whenStable().then(() => {
      const primaryColor = component.colorService.primaryColor;
      const primaryColorString = 'rgb(' + primaryColor.red + ', ' + primaryColor.green + ', ' + primaryColor.blue + ')';
      expect(primaryColorString).toBe(oldColor.nativeElement.style.backgroundColor);
      done();
    });
  });

  it('should update gradient color with secondary color if secondary color is clicked', (done) => {
    const updateSpy: jasmine.Spy = spyOn(component, 'updateRGB');
    component.showColorOptions('secondaryCanvas');
    fixture.whenStable().then(() => {
      expect(updateSpy).toHaveBeenCalled();
      expect(component.colorService.isPrimaryCanvasSelected).toBe(false);
      done();
    });
  });

  it('should not change the color with a wrong hex value', () => {
    const fillCanvasSpy: jasmine.Spy = spyOn(component.colorService, 'fillCanvas');
    canvasPrimary.triggerEventHandler('click', {offsetX: 199, offsetY: 0});
    fillCanvasSpy.calls.reset();
    component.colorService.hexColor = '#01FW';
    component.updateUsedColor();
    expect(fillCanvasSpy).toHaveBeenCalledTimes(0);
  });

  it('should be able to recover color from storage', (done) => {
    const colorP = {red: 10, green: 6, blue: 58, opacity: 123} as ColorRGBA;
    const colorPString = component.colorService.converter.ColorRGBAToHexString(colorP);
    component.colorService.storage.set(PRIMARY_COLOR, colorPString);
    component.colorService.setUpPrimaryColor();
    fixture.whenStable().then(() => {
      expect(component.colorService.primaryColor).toEqual(colorP);
      done();
    });
  });
});
