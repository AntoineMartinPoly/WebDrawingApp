import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MockElementRef, PRIMARY_COLOR, SECONDARY_COLOR } from 'src/constant/constant';
import { ELLIPSE_OPTION_CONTOUR, ELLIPSE_OPTION_TRACE } from 'src/constant/storage/constant';
import { CONTOUR, FULL, FULL_WITH_CONTOUR } from 'src/constant/toolbar/shape/constant';
import { FAKE_ELLIPSE, FAKE_ELLIPSE_HARDSHAPECOL,
  FAKE_ELLIPSE_OPTION, FAKE_ELLIPSE_PARAMS } from 'src/constant/toolbar/shape/ellipse/constant';
import { Point } from 'src/interface/Point';
import { Ellipse, EllipseOptions, EllispeParams } from 'src/interface/shape/ellipse';
import { EllipseService } from './ellipse.service';

describe('EllipseService', () => {

  let service: EllipseService;
  let storage: StorageService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [StorageService, Renderer2],
  }));

  beforeEach(() => {
    service = TestBed.get(EllipseService);
    storage = TestBed.get(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateEllipseElement should call addSVGElementFromRef / generateSVGElement/ setSVGattribute / addSVGToSVG', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const SVGSpy = spyOn(service.drawingService, 'addSVGToSVG');
    service.generateEllipseElement();
    expect(addSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenCalled();
    expect(SVGSpy).toHaveBeenCalled();
  });

  it('createEllipseFromSVGElement should create ellipse element, call getSVGElementAttributes and defineEllipseOption', () => {
    const fakeEllipseElement: ElementRef = new MockElementRef();
    (fakeEllipseElement as any).children = [''];
    const fakeEllipse: Ellipse = FAKE_ELLIPSE;
    fakeEllipse.param.origin = {x: 0, y: 0};
    const optionSpy: jasmine.Spy = spyOn(service, 'defineEllipseOption').and.returnValue(fakeEllipse.option);
    const getSVGAtributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    getSVGAtributeSpy.withArgs('', 'rx').and.returnValue(fakeEllipse.param.horizontalRadius.toString());
    getSVGAtributeSpy.withArgs('', 'ry').and.returnValue(fakeEllipse.param.verticalRadius.toString());
    getSVGAtributeSpy.withArgs('', 'cx').and.returnValue(fakeEllipse.param.horizontalCenter.toString());
    getSVGAtributeSpy.withArgs('', 'cy').and.returnValue(fakeEllipse.param.verticalCenter.toString());
    getSVGAtributeSpy.withArgs(fakeEllipseElement, 'fill', false).and.returnValue(true);
    getSVGAtributeSpy.withArgs(fakeEllipseElement, 'stroke', false).and.returnValue(true);
    getSVGAtributeSpy.withArgs(fakeEllipseElement, 'fill').and.returnValue(fakeEllipse.color.fill);
    getSVGAtributeSpy.withArgs(fakeEllipseElement, 'stroke').and.returnValue(fakeEllipse.color.contour);
    let ellipse: Ellipse = service.createEllipseFromSVGElement(fakeEllipseElement);
    expect(optionSpy).toHaveBeenCalled();
    expect(getSVGAtributeSpy).toHaveBeenCalledTimes(8);
    getSVGAtributeSpy.calls.reset();
    getSVGAtributeSpy.withArgs(fakeEllipseElement, 'fill', false).and.returnValue(false);
    getSVGAtributeSpy.withArgs(fakeEllipseElement, 'stroke', false).and.returnValue(false);
    ellipse = service.createEllipseFromSVGElement(fakeEllipseElement);
    expect(ellipse.color.fill).toMatch('');
    expect(ellipse.color.contour).toMatch('');
    expect(getSVGAtributeSpy).toHaveBeenCalledTimes(6);
  });

  it('defineEllipseOption should return proper ellipse options', () => {
    const fakeEllipseElement: ElementRef = new MockElementRef();
    let fakeEllipseOption: EllipseOptions = {
      traceType: CONTOUR,
      contourThickness: 4,
    };
    const getSVGAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    getSVGAttributeSpy.withArgs(fakeEllipseElement, 'fill-opacity', false).and.returnValue(true);
    getSVGAttributeSpy.withArgs(fakeEllipseElement, 'stroke-width').and.returnValue('4');
    let ellipseOptions: EllipseOptions = service.defineEllipseOption(fakeEllipseElement);
    expect(ellipseOptions).toEqual(fakeEllipseOption);
    getSVGAttributeSpy.withArgs(fakeEllipseElement, 'fill-opacity', false).and.returnValue(false);
    getSVGAttributeSpy.withArgs(fakeEllipseElement, 'stroke-opacity', false).and.returnValue(true);
    fakeEllipseOption = {
      traceType: FULL,
      contourThickness: 0,
    };
    ellipseOptions = service.defineEllipseOption(fakeEllipseElement);
    expect(ellipseOptions).toEqual(fakeEllipseOption);
    getSVGAttributeSpy.withArgs(fakeEllipseElement, 'stroke-opacity', false).and.returnValue(false);
    fakeEllipseOption = {
      traceType: FULL_WITH_CONTOUR,
      contourThickness: 4,
    };
    ellipseOptions = service.defineEllipseOption(fakeEllipseElement);
    expect(ellipseOptions).toEqual(fakeEllipseOption);
  });

  it('getEllipseOptions should return proper ellipse options', () => {
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'get');
    const fakeEllipseOptions: EllipseOptions = FAKE_ELLIPSE_OPTION;
    storageSpy.withArgs(ELLIPSE_OPTION_CONTOUR).and.returnValue(fakeEllipseOptions.traceType);
    storageSpy.withArgs(ELLIPSE_OPTION_TRACE).and.returnValue(fakeEllipseOptions.contourThickness);
    expect(service.getEllipseOptions()).toEqual(fakeEllipseOptions);
  });

  it('setDefaultEllipseParams should set parameters of the ellipse', () => {
    const options = service.setDefaultEllipseParams(FAKE_ELLIPSE_PARAMS.origin);
    expect(options).toEqual(FAKE_ELLIPSE_PARAMS);
  });

  it('getEllipseColors should return correct colors', () => {
    storage.set(PRIMARY_COLOR, FAKE_ELLIPSE_HARDSHAPECOL.fill);
    storage.set(SECONDARY_COLOR, FAKE_ELLIPSE_HARDSHAPECOL.contour);
    const colors = service.getEllipseColors();
    expect(colors).toEqual(FAKE_ELLIPSE_HARDSHAPECOL);
  });

  it('createEllipse should call addEllipseOption and return correct ellipse', () => {
    const setDefSpy = spyOn(service, 'setDefaultEllipseParams').and.returnValue(FAKE_ELLIPSE.param);
    const setColSpy = spyOn(service, 'getEllipseColors').and.returnValue(FAKE_ELLIPSE.color);
    const setOptSpy = spyOn(service, 'getEllipseOptions').and.returnValue(FAKE_ELLIPSE.option);
    const addOptSpy = spyOn(service, 'addEllipseOption');
    service.createEllipse(new MockElementRef(), {x: 0, y: 0});
    expect(setDefSpy).toHaveBeenCalled();
    expect(setColSpy).toHaveBeenCalled();
    expect(setOptSpy).toHaveBeenCalled();
    expect(addOptSpy).toHaveBeenCalled();
  });

  it('updateValue should change ellipse size according to click event', () => {
    const fakePoint: Point = { x: 10, y: 7 };
    const ASYMMETRIC = { shift: false };
    const fakeParams: EllispeParams = Object.assign({}, FAKE_ELLIPSE_PARAMS);
    service.updateValue(fakeParams, fakePoint, ASYMMETRIC);
    expect(fakeParams).not.toEqual(FAKE_ELLIPSE_PARAMS);
  });

  it('updateValue should respond to shift', () => {
    const fakePoint: Point = { x: 10, y: 7 };
    const ASYMMETRIC = { shift: false };
    const SYMMETRIC = { shift: true };
    const symParams = Object.assign({}, FAKE_ELLIPSE_PARAMS);
    const asymParams = Object.assign({}, FAKE_ELLIPSE_PARAMS);
    service.updateValue(symParams, fakePoint, ASYMMETRIC);
    service.updateValue(asymParams, fakePoint, SYMMETRIC);
    expect(symParams).not.toEqual(asymParams);
  });

  it('addEllipseOption should call setSVGattribute 4 times for CONTOUR', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeEllipse = FAKE_ELLIPSE;
    fakeEllipse.option.traceType = CONTOUR;
    service.addEllipseOption(FAKE_ELLIPSE);
    expect(setSpy).toHaveBeenCalledTimes(4);
  });

  it('addEllipseOption should call setSVGattribute 2 times for FULL', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeEllipse = FAKE_ELLIPSE;
    fakeEllipse.option.traceType = FULL;
    service.addEllipseOption(FAKE_ELLIPSE);
    expect(setSpy).toHaveBeenCalledTimes(2);
  });

  it('addEllipseOption should call setSVGattribute 3 times for FULL_WITH_CONTOUR', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeEllipse = FAKE_ELLIPSE;
    fakeEllipse.option.traceType = FULL_WITH_CONTOUR;
    service.addEllipseOption(FAKE_ELLIPSE);
    expect(setSpy).toHaveBeenCalledTimes(3);
  });

  it('addEllipseOption should nothing if the option is wrong', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeEllipse = FAKE_ELLIPSE;
    fakeEllipse.option.traceType = '';
    service.addEllipseOption(FAKE_ELLIPSE);
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('editEllipse should call setSVGattribute 4 times', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeEllipse = FAKE_ELLIPSE;
    fakeEllipse.ref = {children: ['asd']};
    service.editEllipse(fakeEllipse);
    expect(setSpy).toHaveBeenCalledTimes(4);
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const fakeRectangle: Ellipse = FAKE_ELLIPSE;
    service.removeElement(fakeRectangle);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef and appendObject', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const fakeRectangle: Ellipse = FAKE_ELLIPSE;
    service.reAddElement(fakeRectangle);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });
});
