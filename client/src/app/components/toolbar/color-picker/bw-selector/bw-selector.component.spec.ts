import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BwSelectorService } from 'src/app/services/toolbar/color-picker/bw-selector/bw-selector.service';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../../constant/constant';
import { BwSelectorComponent } from './bw-selector.component';

describe('BwSelectorComponent', () => {
  let component: BwSelectorComponent;
  let fixture: ComponentFixture<BwSelectorComponent>;
  let canvas: DebugElement;
  let service: BwSelectorService;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BwSelectorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BwSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvas = fixture.debugElement.query(By.css('#canvas'));
    service = component.bwService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit color when clicked and also when moved', () => {
    const spy = spyOn(component.hueChange, 'emit');
    expect((component as any).mouseDown).toBe(false);

    canvas.triggerEventHandler('mousedown', {offsetX: 10, offsetY: 50});
    expect((component as any).mouseDown).toBe(true);

    expect(component.hueChange.emit).toHaveBeenCalled();
    spy.calls.reset();

    canvas.triggerEventHandler('mousemove', {offsetX: 8, offsetY: 150});

    expect(component.hueChange.emit).toHaveBeenCalled();
  });

  it('should update background when color changes', () => {
    const color = {
      red: 23,
      green: 45,
      blue: 43,
      opacity: 1,
    };

    const bgColor = service.gradientColorRGBA;
    component.updateGradientColor(color);
    const newBgColor = service.gradientColorRGBA;

    expect(bgColor).not.toEqual(newBgColor);
  });

  it('should not emit when unclicked', () => {
    const spy = spyOn(component.hueChange, 'emit');
    canvas.triggerEventHandler('mousemove', {offsetX: 10, offsetY: 20});

    expect((component as any).mouseDown).toBe(false);
    expect(component.hueChange.emit).toHaveBeenCalledTimes(0);

    canvas.triggerEventHandler('mousedown', {offsetX: 0, offsetY: 0});
    expect((component as any).mouseDown).toBe(true);
    spy.calls.reset();

    canvas.triggerEventHandler('mouseup', {});
    canvas.triggerEventHandler('mousemove',  {offsetX: 10, offsetY: 70});

    expect((component as any).mouseDown).toBe(false);
    expect(component.hueChange.emit).toHaveBeenCalledTimes(0);
  });

  it('should change mouseDown to false when leaving canvas', () => {
    (component as any).mouseDown = true;
    canvas.triggerEventHandler('mouseleave', {offsetX: 20, offsetY: 40});
    expect((component as any).mouseDown).toBe(false);
  });

  it('OnMouseMove should updatePosition from service and updateDrawingColor if mouse is down', () => {
    const updatePositionSpy = spyOn(component.bwService, 'updatePosition');
    const updateDrawingSpy = spyOn(component, 'updateDrawingColor');
    (component as any).mouseDown = true;
    canvas.triggerEventHandler('mousemove', {offsetX: 20, offsetY: 185});
    expect(updatePositionSpy).toHaveBeenCalled();
    expect(updateDrawingSpy).toHaveBeenCalled();
  });

  it('OnMouseMove should not updatePosition from service and not updateDrawingColor if mouse is up', () => {
    const updatePositionSpy = spyOn(component.bwService, 'updatePosition');
    const updateDrawingSpy = spyOn(component, 'updateDrawingColor');
    (component as any).mouseDown = false;
    canvas.triggerEventHandler('mousemove', {offsetX: 20, offsetY: 185});
    expect(updatePositionSpy).not.toHaveBeenCalled();
    expect(updateDrawingSpy).not.toHaveBeenCalled();
  });
});
