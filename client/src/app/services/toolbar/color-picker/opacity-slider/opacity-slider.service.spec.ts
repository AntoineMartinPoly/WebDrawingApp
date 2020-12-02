import { TestBed } from '@angular/core/testing';

import { OpacitySliderService } from './opacity-slider.service';

describe('OpacitySliderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpacitySliderService = TestBed.get(OpacitySliderService);
    expect(service).toBeTruthy();
  });
});
