import { TestBed } from '@angular/core/testing';
import { MAX_X_CANVAS_POSITION, MAX_Y_CANVAS_POSITION,
  MIN_X_CANVAS_POSITION, MIN_Y_CANVAS_POSITION } from 'src/constant/color-picker/constant';
import { BwSelectorService } from './bw-selector.service';

describe('BwSelectorService', () => {

  let service: BwSelectorService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(BwSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updatePosition should use constant MAX_X_CANVAS_POSITION when x exceed maximum', () => {
    (service as any).position = {x: 0, y: 0};
    service.updatePosition(200, 100);
    expect((service as any).position).toEqual( {x: MAX_X_CANVAS_POSITION, y: 100} );
  });

  it('updatePosition should use constant MAX_Y_CANVAS_POSITION when y exceed maximum', () => {
    (service as any).position = {x: 0, y: 0};
    service.updatePosition(100, -10);
    expect((service as any).position).toEqual( {x: 100, y: MAX_Y_CANVAS_POSITION} );
  });

  it('updatePosition should use constant MIN_X_CANVAS_POSITION when x is lesser than minimum', () => {
    (service as any).position = {x: 0, y: 0};
    service.updatePosition(-10, 100);
    expect((service as any).position).toEqual( {x: MIN_X_CANVAS_POSITION, y: 100} );
  });

  it('updatePosition should use constant MIN_Y_CANVAS_POSITION when y is lesser than minimum', () => {
    (service as any).position = {x: 0, y: 0};
    service.updatePosition(100, 200);
    expect((service as any).position).toEqual( {x: 100, y: MIN_Y_CANVAS_POSITION} );
  });

  it('updatePosition should use constant MAX_X_CANVAS_POSITION and MIN_Y_CANVAS_POSITION when x and y are out of bound', () => {
    (service as any).position = {x: 0, y: 0};
    service.updatePosition(200, 200);
    expect((service as any).position).toEqual( {x: MAX_X_CANVAS_POSITION, y: MIN_Y_CANVAS_POSITION} );
  });

  it('updatePosition should use constant MIN_X_CANVAS_POSITION and MAX_Y_CANVAS_POSITION when x and y are out of bound', () => {
    (service as any).position = {x: 0, y: 0};
    service.updatePosition(-10, -10);
    expect((service as any).position).toEqual( {x: MIN_X_CANVAS_POSITION, y: MAX_Y_CANVAS_POSITION} );
  });
});
