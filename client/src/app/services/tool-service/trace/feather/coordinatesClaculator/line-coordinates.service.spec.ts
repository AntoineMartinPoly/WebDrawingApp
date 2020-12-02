import { TestBed } from '@angular/core/testing';

import {ONE_HUNDRED_EIGHTY} from '../../../../../../constant/shape/constant';
import { LineCoordinatesService } from './line-coordinates.service';

describe('LineCoordinatesService', () => {
  let service: LineCoordinatesService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = new LineCoordinatesService(45, 10);
  });

  it('should be created', () => {

    expect(service).toBeTruthy();
  });

  it('getX1(offset) return offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / 180) ',
    () => {
    service.rotationAngle = 45;
    service.sizeOfLine = 10;
    const coords = service.getX1(10);
    expect(coords).toEqual(10 + (service.sizeOfLine / 2)
      * Math.cos(-service.rotationAngle * Math.PI / ONE_HUNDRED_EIGHTY));
    });

  it('getY1(offset) return offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / 180) ',
    () => {
      service.rotationAngle = 45;
      service.sizeOfLine = 10;
      const coords = service.getY1(10);
      expect(coords).toEqual(10 + (service.sizeOfLine / 2)
        * Math.sin(-service.rotationAngle * Math.PI / ONE_HUNDRED_EIGHTY));
    });

  it('getX2(offset) return offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / 180) ',
    () => {
      service.rotationAngle = 45;
      service.sizeOfLine = 10;
      service = new LineCoordinatesService(45, 10);
      const coords = service.getX2(10);
      expect(coords).toEqual(10 - (service.sizeOfLine / 2)
        * Math.cos(-service.rotationAngle * Math.PI / ONE_HUNDRED_EIGHTY));
    });

  it('getY2(offset) return offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / 180) ',
    () => {
      service.rotationAngle = 45;
      service.sizeOfLine = 10;
      const coords = service.getY2(10);
      expect(coords).toEqual(10 - (service.sizeOfLine / 2)
        * Math.sin(-service.rotationAngle * Math.PI / ONE_HUNDRED_EIGHTY));
    });

});
