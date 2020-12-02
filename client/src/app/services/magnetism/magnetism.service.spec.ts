import { TestBed } from '@angular/core/testing';
import { DRAWING_WIDTH, MAGNETISM_STATE, OPTION_GRID_SIZE } from 'src/constant/storage/constant';
import { TRUE } from 'src/constant/svg/constant';
import { MagnetismService } from './magnetism.service';

describe('MagnetismService', () => {

  let service: MagnetismService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(MagnetismService);
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updateCoordinate should return magnetic coordinante if magnetism is on', () => {
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'get').withArgs(MAGNETISM_STATE);
    const normalCoordinateSpy: jasmine.Spy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({
      x: 2,
      y: 4,
    });
    const magneticCoordinateSpy: jasmine.Spy = spyOn(service, 'getMagneticCoordinate').and.callThrough();
    const cornerSpy: jasmine.Spy = spyOn(service, 'findClosestCorner').and.returnValue(10);
    storageSpy.and.returnValue(TRUE);
    expect(service.updateCoordinate({} as any)).toEqual({
      x: 10,
      y: 10,
    });
    expect(normalCoordinateSpy).toHaveBeenCalled();
    expect(magneticCoordinateSpy).toHaveBeenCalled();
    expect(cornerSpy).toHaveBeenCalledTimes(2);
    normalCoordinateSpy.calls.reset();
    magneticCoordinateSpy.calls.reset();
    cornerSpy.calls.reset();
    storageSpy.and.returnValue('');
    expect(service.updateCoordinate({} as any)).toEqual({
      x: 2,
      y: 4,
    });
    expect(normalCoordinateSpy).toHaveBeenCalled();
    expect(magneticCoordinateSpy).not.toHaveBeenCalled();
    expect(cornerSpy).not.toHaveBeenCalled();
  });

  it('updateCoordinate should return normal coordinante if magnetism is off', () => {
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'get').withArgs(MAGNETISM_STATE);
    const normalCoordinateSpy: jasmine.Spy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({
      x: 2,
      y: 4,
    });
    const magneticCoordinateSpy: jasmine.Spy = spyOn(service, 'getMagneticCoordinate').and.callThrough();
    const cornerSpy: jasmine.Spy = spyOn(service, 'findClosestCorner').and.returnValue(10);
    storageSpy.and.returnValue('');
    expect(service.updateCoordinate({} as any)).toEqual({
      x: 2,
      y: 4,
    });
    expect(normalCoordinateSpy).toHaveBeenCalled();
    expect(magneticCoordinateSpy).not.toHaveBeenCalled();
    expect(cornerSpy).not.toHaveBeenCalled();
  });

  it('findClosestCorner should get the closest corner in one axis depending on your grid size', () => {
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'get');
    storageSpy.withArgs(OPTION_GRID_SIZE).and.returnValue('10');
    storageSpy.withArgs(DRAWING_WIDTH, true).and.returnValue('100');
    expect(service.findClosestCorner(10)).toBe(0);
    expect(service.findClosestCorner(20)).toBe(25);
    expect(storageSpy).toHaveBeenCalled();
  });

  it('getMagneticCoordinate should call findClosestCorner twice', () => {
    const closestSpy: jasmine.Spy = spyOn(service, 'findClosestCorner').and.returnValue(5);
    expect(service.getMagneticCoordinate({x: 1, y: 1})).toEqual({
      x: 5,
      y: 5,
    });
    expect(closestSpy).toHaveBeenCalledTimes(2);
  });

});
