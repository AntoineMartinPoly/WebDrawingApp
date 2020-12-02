import { TestBed } from '@angular/core/testing';
import { ColorRGBA } from 'src/interface/colors';
import { ColorPickerService } from './color-picker.service';

describe('ColorPickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorPickerService = TestBed.get(ColorPickerService);
    expect(service).toBeTruthy();
  });

  it('should be able transform ColorRGBA to string with colorRGBAToString', () => {
    const service: ColorPickerService = TestBed.get(ColorPickerService);
    const color = { red: 123, green: 52, blue: 255, opacity: 89 } as ColorRGBA;
    const colorString = service.converter.ColorRGBAToHexString(color);
    expect(colorString).toBe('#7b34ff59');
  });

  it('should be able transform string to ColorRGBA with RGBAStringToColorRGBA', () => {
    const service: ColorPickerService = TestBed.get(ColorPickerService);
    const colorRGBA = { red: 123, green: 52, blue: 255, opacity: 89 } as ColorRGBA;
    const colorString = '#7b34ff59';
    const result = service.converter.HexStringToColorRGBA(colorString);
    expect(result).toEqual(colorRGBA);
  });

  it('updateColorFromHexInput should not update color with wrong hex input', () => {
    const service: ColorPickerService = TestBed.get(ColorPickerService);
    const fillCanvasSpy: jasmine.Spy = spyOn(service, 'fillCanvas');
    const colorString = '#7b3Q';
    service.hexColor = colorString;
    service.updateColorFromHexInput();
    expect(fillCanvasSpy).toHaveBeenCalledTimes(0);
  });
});
