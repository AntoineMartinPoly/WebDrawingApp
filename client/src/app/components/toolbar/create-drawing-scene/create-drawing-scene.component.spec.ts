import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { ColorRGBA } from 'src/interface/colors';
import { NewDrawing } from 'src/interface/new-drawing';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../constant/constant';
import { CreateDrawingSceneComponent } from './create-drawing-scene.component';

describe('CreateDrawingSceneComponent', () => {
  let component: CreateDrawingSceneComponent;
  let fixture: ComponentFixture<CreateDrawingSceneComponent>;

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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrawingSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with 7 controls', () => {
    expect(component.form.contains('height')).toBe(true);
    expect(component.form.contains('width')).toBe(true);
    expect(component.form.contains('red')).toBe(true);
    expect(component.form.contains('green')).toBe(true);
    expect(component.form.contains('blue')).toBe(true);
  });

  it('height field validity', () => {
    const heightControl = component.form.controls.height;
    heightControl.setValue('');
    expect(heightControl.hasError('required')).toBe(true);
  });

  it('height positive validity', () => {
    const heightControl = component.form.controls.height;
    heightControl.setValue('-1');
    expect(heightControl.hasError('min')).toBe(true);
  });
  it('height positive validity', () => {
    const heightControl = component.form.controls.height;
    heightControl.setValue('1');
    expect(heightControl.hasError('min')).toBe(false);
  });

  it('Width field validity', () => {
    const widthtControl = component.form.controls.width;
    widthtControl.setValue('');
    expect(widthtControl.hasError('required')).toBe(true);
  });

  it('Width positive validity', () => {
    const widthtControl = component.form.controls.width;
    widthtControl.setValue('-1');
    expect(widthtControl.hasError('min')).toBe(true);
  });

  it('Width positive validity', () => {
    const widthtControl = component.form.controls.width;
    widthtControl.setValue('1');
    expect(widthtControl.hasError('min')).toBe(false);
  });

  it('RED field validity', () => {
    const RedControl = component.form.controls.red;
    RedControl.setValue('');
    expect(RedControl.hasError('required')).toBe(true);
  });

  it('RED minimum 0 validity', () => {
    const RedControl = component.form.controls.red;
    RedControl.setValue('120');
    expect(RedControl.hasError('min')).toBe(false);
  });

  it('RED minimum 0 validity', () => {
    const RedControl = component.form.controls.red;
    RedControl.setValue('-1');
    expect(RedControl.hasError('min')).toBe(true);
  });

  it('RED maximum 255 validity', () => {
    const RedControl = component.form.controls.red;
    RedControl.setValue('300');
    expect(RedControl.hasError('max')).toBe(true);
  });

  it('RED maximum 255 validity', () => {
    const RedControl = component.form.controls.red;
    RedControl.setValue('200');
    expect(RedControl.hasError('max')).toBe(false);
  });

  it('Green field validity', () => {
    const greenControl = component.form.controls.green;
    greenControl.setValue('');
    expect(greenControl.hasError('required')).toBe(true);
  });

  it('Green minimum 0 validity', () => {
    const greenControl = component.form.controls.green;
    greenControl.setValue('120');
    expect(greenControl.hasError('min')).toBe(false);
  });

  it('Green minimum 0 validity', () => {
    const greenControl = component.form.controls.green;
    greenControl.setValue('-1');
    expect(greenControl.hasError('min')).toBe(true);
  });

  it('Green maximum 255 validity', () => {
    const greenControl = component.form.controls.green;
    greenControl.setValue('300');
    expect(greenControl.hasError('max')).toBe(true);
  });

  it('Green maximum 255 validity', () => {
    const greenControl = component.form.controls.green;
    greenControl.setValue('200');
    expect(greenControl.hasError('max')).toBe(false);
  });

  it('Blue field validity', () => {
    const blueControl = component.form.controls.blue;
    blueControl.setValue('');
    expect(blueControl.hasError('required')).toBe(true);
  });

  it('Blue minimum 0 validity', () => {
    const blueControl = component.form.controls.blue;
    blueControl.setValue('120');
    expect(blueControl.hasError('min')).toBe(false);
  });

  it('Blue minimum 0 validity', () => {
    const blueControl = component.form.controls.blue;
    blueControl.setValue('-1');
    expect(blueControl.hasError('min')).toBe(true);
  });

  it('Blue maximum 255 validity', () => {
    const blueControl = component.form.controls.blue;
    blueControl.setValue('300');
    expect(blueControl.hasError('max')).toBe(true);
  });

  it('Blue maximum 255 validity', () => {
    const blueControl = component.form.controls.blue;
    blueControl.setValue('200');
    expect(blueControl.hasError('max')).toBe(false);
  });

  it('Opacity field validity', () => {
    const opacityControl = component.form.controls.opacity;
    opacityControl.setValue('');
    expect(opacityControl.hasError('required')).toBe(true);
  });

  it('Opacity minimum 0 validity', () => {
    const opacityControl = component.form.controls.opacity;
    opacityControl.setValue('1');
    expect(opacityControl.hasError('min')).toBe(false);
  });

  it('Opacity minimum 0 validity', () => {
    const opacityControl = component.form.controls.opacity;
    opacityControl.setValue('-1');
    expect(opacityControl.hasError('min')).toBe(true);
  });

  it('Opacity maximum 1 validity', () => {
    const opacityControl = component.form.controls.opacity;
    opacityControl.setValue('2');
    expect(opacityControl.hasError('max')).toBe(true);
  });

  it('Opacity maximum 1 validity', () => {
    const opacityControl = component.form.controls.opacity;
    opacityControl.setValue('1');
    expect(opacityControl.hasError('max')).toBe(false);
  });

  it('setRadio shoud change selectedLink to the option parameter', () => {
    component.setRadio('hello');
    expect(component.selectedLink).toMatch('hello');
  });

  it('isSelected should return true if palette choose by default', () => {
    expect(component.isSelected('palette')).toBe(true);
  });

  it('isSelected should return false if default button different to palette', () => {
    component.setRadio('');
    expect(component.isSelected('palette')).toBe(false);
  });

  it('onSubmit should send data when is called', (done) => {
    const service: ToolbarService = TestBed.get(ToolbarService);
    spyOn(component, 'colorChoose').and.returnValue('black');
    component.form.controls.height.setValue(2);
    component.form.controls.width.setValue(3);
    service.getNewDrawingInfo().subscribe((info: NewDrawing) => {
      expect(info.height).toBe(component.form.controls.height.value);
      expect(info.width).toBe(component.form.controls.width.value);
      expect(info.color).toBe('black');
      done();
    });
    component.onSubmit();
  });

  it('rgbaToHex should return a hexadecimal of rgb input', () => {
    const color = { red: 255, green: 0, blue: 0, opacity: 255 } as ColorRGBA;
    expect(component.palette.converter.ColorRGBAToHexString(color)).toMatch('#ff0000ff');
  });

  it('colorChoose should return a ColorRGBA instance when rgba isSelected', () => {
    component.colorChoose();
    const option = 'rgb';
    component.setRadio(option);
    const rgbHexa = component.palette.converter.ColorRGBAToHexString({
      red: component.form.controls.red.value,
      green: component.form.controls.green.value,
      blue: component.form.controls.blue.value,
      opacity: Math.trunc(component.form.controls.opacity.value * 255),
    } as ColorRGBA);

    const expectedColor: string = component.colorChoose();
    expect(expectedColor ===  rgbHexa).toBe(true);
  });

});
