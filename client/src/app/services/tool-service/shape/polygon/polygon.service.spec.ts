import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MockElementRef, PRIMARY_COLOR, SECONDARY_COLOR, TWO } from 'src/constant/constant';
import { POLYGON_OPTION_CONTOUR, POLYGON_OPTION_SIDES, POLYGON_OPTION_TRACE } from 'src/constant/storage/constant';
import { DEFAULT_VALUE } from 'src/constant/svg/constant';
import { CONTOUR, FULL, FULL_WITH_CONTOUR, RAYON } from 'src/constant/toolbar/shape/constant';
import { FAKE_ELLIPSE_HARDSHAPECOL } from 'src/constant/toolbar/shape/ellipse/constant';
import { FAKE_POLYGON, FAKE_POLYGON_OPTION } from 'src/constant/toolbar/shape/polygon/constant';
import { Polygon, PolygonOptions } from 'src/interface/shape/polygon';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
  let service: PolygonService;
  let storage: StorageService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [StorageService, Renderer2],
  }));

  beforeEach(() => {
    service = TestBed.get(PolygonService);
    storage = TestBed.get(StorageService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generatePolygonElement should call generateSVGElement / addSVGElementFromRef / setSVGattribute / addSVGToSVG', () => {
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const SVGSpy = spyOn(service.drawingService, 'addSVGToSVG');
    service.generatePolygonElement();
    expect(genSpy).toHaveBeenCalledTimes(2);
    expect(addSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(SVGSpy).toHaveBeenCalled();
  });

  it('createPolygonFromSVGElement should create polygon object, call getSVGElementAttributes and definePolygonOption', () => {
    const fakePolygonElement: ElementRef = new MockElementRef();
    (fakePolygonElement as any).children = [''];
    const fakePolygon: Polygon = FAKE_POLYGON;
    fakePolygon.origin = {x: 0, y: 0};
    const getSVGAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    const optionSpy: jasmine.Spy = spyOn(service, 'definePolygonOption').and.returnValue(fakePolygon.option);
    getSVGAttributeSpy.withArgs('', 'points').and.returnValue(fakePolygon.points);
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'fill', false).and.returnValue(true);
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'fill').and.returnValue(fakePolygon.color.fill);
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'stroke', false).and.returnValue(true);
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'stroke').and.returnValue(fakePolygon.color.contour);
    let polygon = service.createPolygonFromSVGElement(fakePolygonElement);
    expect(fakePolygon.color).toEqual(polygon.color);
    expect(fakePolygon.option).toEqual(polygon.option);
    expect(fakePolygon.origin).toEqual(polygon.origin);
    expect(fakePolygon.points).toEqual(polygon.points);
    expect(optionSpy).toHaveBeenCalled();
    expect(getSVGAttributeSpy).toHaveBeenCalledTimes(5);
    getSVGAttributeSpy.calls.reset();
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'fill', false).and.returnValue(false);
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'stroke', false).and.returnValue(false);
    polygon = service.createPolygonFromSVGElement(fakePolygonElement);
    expect(polygon.color.fill).toMatch('');
    expect(polygon.color.contour).toMatch('');
    expect(getSVGAttributeSpy).toHaveBeenCalledTimes(3);
  });

  it('definePolygonOption should return proper polygon options', () => {
    const fakePolygonElement: ElementRef = new MockElementRef();
    let fakePolygonOption: PolygonOptions = {
      traceType: CONTOUR,
      contourThickness: 5,
      nbOfSides: DEFAULT_VALUE,
    };
    const getSVGAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'fill-opacity', false).and.returnValue(true);
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'stroke-width').and.returnValue('5');
    expect(service.definePolygonOption(fakePolygonElement)).toEqual(fakePolygonOption);
    fakePolygonOption = {
      traceType: FULL,
      contourThickness: 0,
      nbOfSides: DEFAULT_VALUE,
    };
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'stroke-opacity', false).and.returnValue(true);
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'fill-opacity', false).and.returnValue(false);
    expect(service.definePolygonOption(fakePolygonElement)).toEqual(fakePolygonOption);
    fakePolygonOption = {
      traceType: FULL_WITH_CONTOUR,
      contourThickness: 5,
      nbOfSides: DEFAULT_VALUE,
    };
    getSVGAttributeSpy.withArgs(fakePolygonElement, 'stroke-opacity', false).and.returnValue(false);
    expect(service.definePolygonOption(fakePolygonElement)).toEqual(fakePolygonOption);
  });

  it('getPolygonOptions should return proper polygon options', () => {
    storage.set(POLYGON_OPTION_TRACE, FAKE_POLYGON_OPTION.traceType);
    storage.set(POLYGON_OPTION_CONTOUR, FAKE_POLYGON_OPTION.contourThickness.toString());
    storage.set(POLYGON_OPTION_SIDES, FAKE_POLYGON_OPTION.nbOfSides.toString());
    expect(service.getPolygonOptions()).toEqual(FAKE_POLYGON_OPTION);
  });

  it('getPolygonColors should return color options', () => {
    storage.set(PRIMARY_COLOR, FAKE_ELLIPSE_HARDSHAPECOL.fill);
    storage.set(SECONDARY_COLOR, FAKE_ELLIPSE_HARDSHAPECOL.contour);
    expect(service.getPolygonColors()).toEqual(FAKE_ELLIPSE_HARDSHAPECOL);
  });

  it('createPolygon should call addPolygonOption and return correct Polygon', () => {
    const setColSpy = spyOn(service, 'getPolygonColors').and.returnValue(FAKE_POLYGON.color);
    const getOptSpy = spyOn(service, 'getPolygonOptions').and.returnValue(FAKE_POLYGON.option);
    const setOptSpy = spyOn(service, 'setPolygonOption');
    const polygon = service.createPolygon(new MockElementRef(), {x: 0, y: 0});
    expect(setColSpy).toHaveBeenCalled();
    expect(setOptSpy).toHaveBeenCalled();
    expect(getOptSpy).toHaveBeenCalled();
    expect(polygon).toEqual(FAKE_POLYGON);
  });

  it(' updateValue should update the value of a polygon, such as its points', () => {
    const fakePolygon = Object.assign({}, FAKE_POLYGON);
    fakePolygon.origin = { x: 0, y: 0 };
    const rayon = RAYON;
    expect(rayon).toBe(Math.sqrt((25 - fakePolygon.origin.y)
      * (25 - fakePolygon.origin.y) + (25 - fakePolygon.origin.x)
      * (25 - fakePolygon.origin.x)) / TWO);
    service.updateValue(fakePolygon, { x: 0, y: 0 });
  });
  it('setPolygonOption should call setSVGattribute 4 times for CONTOUR', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakePolygon = FAKE_POLYGON;
    fakePolygon.option.traceType = CONTOUR;
    service.setPolygonOption(FAKE_POLYGON);
    expect(setSpy).toHaveBeenCalledTimes(4);
  });

  it('setPolygonOption should call setSVGattribute 2 times for FULL', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakePolygon = FAKE_POLYGON;
    fakePolygon.option.traceType = FULL;
    service.setPolygonOption(FAKE_POLYGON);
    expect(setSpy).toHaveBeenCalledTimes(2);
  });

  it('setPolygonOption should call setSVGattribute 3 times for FULL_WITH_CONTOUR', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakePolygon = FAKE_POLYGON;
    fakePolygon.option.traceType = FULL_WITH_CONTOUR;
    service.setPolygonOption(FAKE_POLYGON);
    expect(setSpy).toHaveBeenCalledTimes(3);
  });

  it('setPolygonOption should do nothing if the option is wrong', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakePolygon = FAKE_POLYGON;
    fakePolygon.option.traceType = '';
    service.setPolygonOption(FAKE_POLYGON);
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('editPolygon should call setSVGattribute 1 times', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakePolygon = {
      ref: FAKE_POLYGON.ref,
      points: FAKE_POLYGON.points,
    } as Polygon;
    fakePolygon.ref = {children: ['asd']};
    service.editPolygon(fakePolygon);
    expect(setSpy).toHaveBeenCalledTimes(1);
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const fakeRectangle: Polygon = FAKE_POLYGON;
    service.removeElement(fakeRectangle);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef and appendObject', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const fakeRectangle: Polygon = FAKE_POLYGON;
    service.reAddElement(fakeRectangle);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });

});
