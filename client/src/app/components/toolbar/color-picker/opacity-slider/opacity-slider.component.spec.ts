import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MIN_Y_CANVAS_POSITION } from 'src/constant/color-picker/constant';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../../constant/constant';
import { OpacitySliderComponent } from './opacity-slider.component';

describe('OpacitySliderComponent', () => {
  let component: OpacitySliderComponent;
  let fixture: ComponentFixture<OpacitySliderComponent>;
  let canvas: DebugElement;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpacitySliderComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpacitySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvas = fixture.debugElement.query(By.css('#canvas'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeShortcutAccess should changeShortcutAccess of shortcut service', () => {
    const changeSpy: jasmine.Spy = spyOn(component.shortcutService, 'changeShortcutAccess');
    component.changeShortcutAccess(false);
    expect(changeSpy).toHaveBeenCalled();
  });

  // it('should update opacity when clicked elsewhere', () => {
  //   const spy = spyOn(component.opacityChange, 'emit');
  //   expect(component.mouseDown).toBe(false);
  //   expect(component.opacityChange.emit).toHaveBeenCalledTimes(0);
  //   spy.calls.reset();

  //   canvas.triggerEventHandler('mousedown', {offsetX: 10, offsetY: 20});
  //   expect(component.mouseDown).toBe(true);
  //   expect(component.opacityChange.emit).toHaveBeenCalledWith(Math.round(160 * 255 / 180));
  // });

  it('should not update opacity when click is released', () => {
    canvas.triggerEventHandler('mousedown', {offsetX: 0, offsetY: 0});
    canvas.triggerEventHandler('mouseup', {});

    spyOn(component.opacityChange, 'emit');
    canvas.triggerEventHandler('mousemove', {offsetX: 10, offsetY: 20});
    expect((component as any).mouseDown).toBe(false);

    expect(component.opacityChange.emit).toHaveBeenCalledTimes(0);
  });

  // test is broken
  // it('should emit opacity with mouse mouvement', () => {
  //   spyOn(component.opacityChange, 'emit');

  //   canvas.triggerEventHandler('mousedown', {offsetX: 0, offsetY: 0});
  //   canvas.triggerEventHandler('mousemove', {offsetX: 10, offsetY: 20});

  //   expect(component.opacityChange.emit).toHaveBeenCalledWith(Math.round(160 * 255 / 180));
  // });

  it('should update background color if color changes', () => {
    const color = {
      red: 10,
      green: 10,
      blue: 10,
      opacity: 10,
    };
    const initialCanvasBackground = component.canvas.nativeElement.getContext('2d').getImageData(10, 10, 1, 1).data;
    component.updateGradientColor(color);
    const canvasBackground = component.canvas.nativeElement.getContext('2d').getImageData(10, 10, 1, 1).data;
    expect(canvasBackground).not.toEqual(initialCanvasBackground);
  });

  it('should change mouseDown to false when leaving canvas', () => {
    (component as any).mouseDown = true;
    canvas.triggerEventHandler('mouseleave', {offsetX: 20, offsetY: 40});
    expect((component as any).mouseDown).toBe(false);
  });

  it('OnMouseMove should use constant MIN_Y_CANVA_POSITION when offset.y is less than minimum', () => {
    (component as any).mouseDown = true;
    canvas.triggerEventHandler('mousemove', {offsetX: 20, offsetY: 185});
    expect(component.opacityService.position).toBe(MIN_Y_CANVAS_POSITION);
  });
});
