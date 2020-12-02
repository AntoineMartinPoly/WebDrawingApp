import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { FAKE_LENGTH } from 'src/constant/toolbar/constant';
import { DrawingService } from '../drawing/drawing.service';
import { GridService } from './grid.service';

import {Observable} from 'rxjs';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('linesGenerator should generate verticals and horizontals lines, by calling create element,set attribute' +
    'and appendChild', () => {
    let drawingService: DrawingService = TestBed.get(DrawingService);
    drawingService = DrawingService.getInstance();
    const drawSpyGenerate: jasmine.Spy = spyOn(drawingService, 'generateSVGElement');
    const drawSpySet: jasmine.Spy = spyOn(drawingService, 'setSVGattribute');
    const drawSpyAdd: jasmine.Spy = spyOn(drawingService, 'addSVGElementFromRef');
    const drawSpyAppend: jasmine.Spy = spyOn(drawingService, 'addSVGToSVG');
    service.linesGenerator(10, FAKE_LENGTH, FAKE_LENGTH);
    expect(drawSpyGenerate).toHaveBeenCalled();
    expect(drawSpySet).toHaveBeenCalled();
    expect(drawSpyAppend).toHaveBeenCalled();
    expect(drawSpyAdd).toHaveBeenCalled();
  });

  it('generateGrid should call linesGenerator and setSVGAttribute', () => {
    const genSpy = spyOn(service, 'linesGenerator');
    const drawSpySet: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    service.generateGrid();
    expect(genSpy).toHaveBeenCalled();
    expect(drawSpySet).toHaveBeenCalled();
  });

  it('toggleGrid should toggle grid depending on value passed', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    service.gridRef = new MockElementRef();
    service.toggleGrid(true);
    expect(addSpy).toHaveBeenCalled();
    service.toggleGrid(false);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('updateSize should call removeSVGElementFromRef and linesGenerator', () => {
    const drawSpySet = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const lineSpy = spyOn(service, 'linesGenerator');
    service.updateSize();
    expect(drawSpySet).toHaveBeenCalled();
    expect(lineSpy).toHaveBeenCalled();
  });

  it('updateOpacity should call setSVGattribute', () => {
    const drawSpySet = spyOn(service.drawingService, 'setSVGattribute');
    service.updateOpacity();
    expect(drawSpySet).toHaveBeenCalled();
  });

  it('getGridsize should return a instance of observable', () => {
    expect(service.getGridsize() instanceof Observable).toBe(true);
  });

  it('sendGridsize should send size value', () => {
    let test = false;
    service.getGridsize().subscribe((size) => {
      if (size === 10) {
        test = true;
      }
    });
    service.sendGridsize(10);
    expect(test).toBe(true);
  });

  it('getGridOpacity should return a instance of observable', () => {
    expect(service.getGridOpacity() instanceof Observable).toBe(true);
  });

  it('sendGridOpacity should send opacity value', () => {
    let test = false;
    service.getGridOpacity().subscribe((opacity) => {
      if (opacity === 1) {
        test = true;
      }
    });
    service.sendGridOpacity(1);
    expect(test).toBe(true);
  });

});
