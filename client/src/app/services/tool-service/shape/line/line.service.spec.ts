import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { LINE_OPTION_DIAMETER, LINE_OPTION_JUNCTION, LINE_OPTION_STYLE, LINE_OPTION_THICKNESS } from 'src/constant/storage/constant';
import { CONTINUOUS, DOTED_WITH_LINE, DOTED_WITH_POINTS, FAKE_LINE, FAKE_LINE_OPTIONS,
  FAKE_POINT, POINT, ROUNDED } from 'src/constant/toolbar/shape/constant';
import { Line } from 'src/interface/shape/line';
import { DrawingService } from '../../../drawing/drawing.service';
import { LineService } from './line.service';

describe('LineService', () => {

  let service: LineService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(LineService);
  });

  afterEach(() => {
   sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateLineElement should call generateSVGElement / addSVGElementFromRef / setSVGattribute / addSVGToSVG', () => {
    const genSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'generateSVGElement');
    const addSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'addSVGElementFromRef');
    const setSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'setSVGattribute');
    const SVGSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'addSVGToSVG');
    service.generateLineElement();
    expect(genSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(SVGSpy).toHaveBeenCalled();
  });

  it('createLine should get coordinates and add LineOptions to current Line', () => {
    const addLineOptionSpy: jasmine.Spy = spyOn(service, 'addLineOption');
    service.createLine(MockElementRef, {x: 0, y: 0});
    expect(addLineOptionSpy).toHaveBeenCalled();
  });

  it('getLineOptions should return line options defined in storage', () => {
    service.storage.set(LINE_OPTION_JUNCTION, FAKE_LINE_OPTIONS.junctionType);
    service.storage.set(LINE_OPTION_STYLE, FAKE_LINE_OPTIONS.lineStyle);
    service.storage.set(LINE_OPTION_THICKNESS, FAKE_LINE_OPTIONS.lineThickness.toString());
    service.storage.set(LINE_OPTION_DIAMETER, FAKE_LINE_OPTIONS.pointDiameter.toString());
    expect(service.getLineOptions().junctionType).toBe(FAKE_LINE_OPTIONS.junctionType);
    expect(service.getLineOptions().lineStyle).toBe(FAKE_LINE_OPTIONS.lineStyle);
    expect(service.getLineOptions().lineThickness).toBe(FAKE_LINE_OPTIONS.lineThickness);
    expect(service.getLineOptions().pointDiameter).toBe(FAKE_LINE_OPTIONS.pointDiameter);
  });

  it('addLineOption should setSVGattribute x amount of type depending on the option', () => {
    const setSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeLine: Line = Object.assign({}, FAKE_LINE);
    fakeLine.option.lineStyle = CONTINUOUS;
    fakeLine.ref = {children: [123, 'asd']};
    service.addLineOption(fakeLine);
    expect(setSVGSpy).toHaveBeenCalledTimes(6);
    setSVGSpy.calls.reset();
    fakeLine.option.lineStyle = DOTED_WITH_LINE;
    service.addLineOption(fakeLine);
    expect(setSVGSpy).toHaveBeenCalledTimes(6);
    setSVGSpy.calls.reset();
    fakeLine.option.lineStyle = DOTED_WITH_POINTS;
    service.addLineOption(fakeLine);
    expect(setSVGSpy).toHaveBeenCalledTimes(6);
    setSVGSpy.calls.reset();
    fakeLine.option.lineStyle = 'NOT_AN_OPTION';
    service.addLineOption(fakeLine);
    expect(setSVGSpy).toHaveBeenCalledTimes(4);
  });

  it('updateEndPointValue should update value of line with new point', () => {
    const fakeLine = Object.assign({}, FAKE_LINE);
    service.updateEndPointValue(fakeLine, {x: 10, y: 10});
    expect(fakeLine.value.endPoint.x).toBe(10);
    expect(fakeLine.value.endPoint.y).toBe(10);
  });

  it('editLineEndPoint should setAttribute of line with new end point', () => {
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeLine = Object.assign({}, FAKE_LINE);
    fakeLine.ref = {children: [123, 'asd']};
    service.editLineEndPoint(fakeLine);
    expect(setSpy).toHaveBeenCalled();
  });

  it('addLine should setAttribute of line with new end point and circle with point line', () => {
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const circleSpy: jasmine.Spy = spyOn(service, 'generateSVGCircle');
    const fakeLine = Object.assign({}, FAKE_LINE);
    fakeLine.ref = {children: [123, 'asd']};
    fakeLine.option.junctionType = POINT;
    service.addLine(fakeLine, {x: 10, y: 10});
    expect(setSpy).toHaveBeenCalled();
    expect(circleSpy).toHaveBeenCalled();
  });

  it('addLine should setAttribute of line with new end point and not circle with not point line', () => {
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const circleSpy: jasmine.Spy = spyOn(service, 'generateSVGCircle');
    const fakeLine = Object.assign({}, FAKE_LINE);
    fakeLine.ref = {children: [123, 'asd']};
    fakeLine.option.junctionType = 'not point';
    service.addLine(fakeLine, {x: 10, y: 10});
    expect(setSpy).toHaveBeenCalled();
    expect(circleSpy).not.toHaveBeenCalled();
  });

  it('addLine should setAttribute of line with new curve point and not circle with not point line', () => {
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const circleSpy: jasmine.Spy = spyOn(service, 'generateSVGCircle');
    const getNewPointSpy: jasmine.Spy = spyOn(service.converter, 'getNewPointFromStraightLine').and.returnValue({x: 20, y: 20});
    const fakeLine = Object.assign({}, FAKE_LINE);
    fakeLine.ref = {children: [123, 'asd']};
    fakeLine.option.junctionType = ROUNDED;
    service.addLine(fakeLine, {x: 10, y: 10});
    expect(setSpy).toHaveBeenCalled();
    expect(getNewPointSpy).toHaveBeenCalled();
    expect(circleSpy).not.toHaveBeenCalled();
  });

  it('removeLastLine should remove line and circle with line with point', () => {
    const removeSpy: jasmine.Spy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const shiftSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'removeFirstDrawingElement');
    shiftSpy.and.returnValue({ref: new MockElementRef()});
    const fakeLine = Object.assign({}, FAKE_LINE);
    fakeLine.ref = {children: [123, 'asd']};
    fakeLine.option.junctionType = POINT;
    fakeLine.path = 'M M M M';
    service.removeLastLine(fakeLine);
    expect(removeSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(shiftSpy).toHaveBeenCalled();
  });

  it('removeLastLine should remove line and not circle with not a line with point', () => {
    const removeSpy: jasmine.Spy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const shiftSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'removeFirstDrawingElement');
    shiftSpy.and.returnValue({ref: new MockElementRef()});
    const fakeLine = Object.assign({}, FAKE_LINE);
    fakeLine.ref = {children: [123, 'asd']};
    fakeLine.option.junctionType = 'not point';
    service.removeLastLine(fakeLine);
    expect(removeSpy).not.toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
    expect(shiftSpy).not.toHaveBeenCalled();
  });

  it('generateSVGCircle should call setSVGattribute generateSVGElement addSVGElementFromRef and unshift', () => {
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const genSpy: jasmine.Spy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy: jasmine.Spy = spyOn(service.drawingService, 'insertSVGBeforeSVG');
    const unshiftSpy = spyOn(service.drawingElementManager, 'pushDrawingElementAtFirstPosition');
    service.groupLine = {children: [123, 'asd']};
    service.generateSVGCircle(FAKE_POINT);
    expect(setSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(unshiftSpy).toHaveBeenCalled();
  });

  it('connectLastLineToFirstLine should call setSVGattribute and set first line and last line path', () => {
    const genSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeLine = Object.assign({}, FAKE_LINE);
    fakeLine.ref = {children: [123, 'asd']};
    service.connectLastLineToFirstLine(fakeLine);
    expect(genSpy).toHaveBeenCalled();
    fakeLine.option.junctionType = POINT;
    service.connectLastLineToFirstLine(fakeLine);
    fakeLine.option.junctionType = '...';
    service.connectLastLineToFirstLine(fakeLine);
  });

  it('removeElement should remove line ref from svg', () => {
    const removeSpy: jasmine.Spy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const removeManagerSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'removeDrawingElement');
    service.removeElement(FAKE_LINE);
    expect(removeSpy).toHaveBeenCalled();
    expect(removeManagerSpy).toHaveBeenCalled();
  });

  it('reAddElement should add line ref again to svg', () => {
    const addSpy: jasmine.Spy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy: jasmine.Spy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    service.reAddElement(FAKE_LINE);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });
});
