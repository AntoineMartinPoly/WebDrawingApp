import { TestBed } from '@angular/core/testing';
import { ColorRGBA } from 'src/interface/colors';
import { ColorSliderService } from './color-slider.service';

describe('ColorSliderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorSliderService = TestBed.get(ColorSliderService);
    expect(service).toBeTruthy();
  });

  it('should return a strin of the appropriate ColorRGBA', () => {
    const service: ColorSliderService = TestBed.get(ColorSliderService);
    const color = { red: 123, green: 52, blue: 255, opacity: 1 } as ColorRGBA;
    const colorString = service.colorRGBAToString(color);
    expect(colorString).toBe('rgba(123,52,255,1)');
  });
});
