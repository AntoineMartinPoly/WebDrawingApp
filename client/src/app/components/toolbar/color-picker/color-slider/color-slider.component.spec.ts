import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorSliderService } from 'src/app/services/toolbar/color-picker/color-slider/color-slider.service';
import { MIN_Y_CANVAS_POSITION } from 'src/constant/color-picker/constant';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../../constant/constant';
import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
  let component: ColorSliderComponent;
  let fixture: ComponentFixture<ColorSliderComponent>;
  let canvas: DebugElement;
  let service: ColorSliderService;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSliderComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvas = fixture.debugElement.query(By.css('#canvas'));
    service = component.colorSliderService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit color when clicked and also when moved', () => {
    const spy = spyOn(component.colorRGBChange, 'emit');
    expect((component as any).mouseDown).toBe(false);

    canvas.triggerEventHandler('mousedown', {offsetX: 10, offsetY: 40});
    expect((component as any).mouseDown).toBe(true);

    const color = service.getColorFromPosition(10, 40);
    expect(component.colorRGBChange.emit).toHaveBeenCalledWith(color);
    spy.calls.reset();

    canvas.triggerEventHandler('mousemove', {offsetX: 10, offsetY: 120});

    const newColor = service.getColorFromPosition(10, 120);
    expect(component.colorRGBChange.emit).toHaveBeenCalledWith(newColor);
  });

  it('should not update color when unclicked and moved', () => {
    const spy = spyOn(component.colorRGBChange, 'emit');
    canvas.triggerEventHandler('mousemove', {offsetX: 10, offsetY: 20});

    expect((component as any).mouseDown).toBe(false);
    expect(component.colorRGBChange.emit).toHaveBeenCalledTimes(0);

    canvas.triggerEventHandler('mousedown', {offsetX: 0, offsetY: 0});
    expect((component as any).mouseDown).toBe(true);
    spy.calls.reset();

    canvas.triggerEventHandler('mouseup', {offsetX: 0, offsetY: 0});
    canvas.triggerEventHandler('mousemove',  {offsetX: 10, offsetY: 70});

    expect((component as any).mouseDown).toBe(false);
    expect(component.colorRGBChange.emit).toHaveBeenCalledTimes(0);
  });

  it('should change mouseDown to false when leaving canvas', () => {
    (component as any).mouseDown = true;
    canvas.triggerEventHandler('mouseleave', {offsetX: 20, offsetY: 40});
    expect((component as any).mouseDown).toBe(false);
  });

  it('OnMouseMove should use constant MIN_Y_CANVA_POSITION when offset.y is less than minimum', () => {
    (component as any).mouseDown = true;
    canvas.triggerEventHandler('mousemove', {offsetX: 20, offsetY: 185});
    expect(component.colorSliderService.position).toBe(MIN_Y_CANVAS_POSITION);
  });
});
