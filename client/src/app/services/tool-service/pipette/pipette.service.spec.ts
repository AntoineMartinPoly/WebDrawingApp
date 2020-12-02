import { TestBed } from '@angular/core/testing';
import { ELLIPSE, LINE, PENCIL, POLYGON, RECTANGLE } from 'src/constant/svg/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { FAKE_RECTANGLE } from 'src/constant/toolbar/shape/rectangle/constant';
import { Point } from 'src/interface/Point';
import { Rectangle } from 'src/interface/shape/rectangle';
import { DrawingService } from '../../drawing/drawing.service';
import { PipetteService } from './pipette.service';

describe('PipetteService', () => {

  let service: PipetteService;
  let fakeRectangle: Rectangle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fakeRectangle = FAKE_RECTANGLE;
    fakeRectangle.ref = { localName: '' };
    service = TestBed.get(PipetteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getColor call getRectangleColor when a rectangle element is passed in argument', () => {
    const serviceRectSpy: jasmine.Spy = spyOn(service, 'getRectangleColor');
    const getcoordinateSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG').and.returnValue(RECTANGLE);
    service.getColor({localName: 'rect'}, FAKE_KEY_MODIFIER, new MouseEvent('click'));
    expect(serviceRectSpy).toHaveBeenCalled();
    expect(getcoordinateSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getColor call getTraceColor when a path element is passed in argument', () => {
    const serviceRectSpy: jasmine.Spy = spyOn(service, 'getTraceColor');
    const getcoordinateSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG').and.returnValue(PENCIL);
    service.getColor({localName: 'path'}, FAKE_KEY_MODIFIER, new MouseEvent('click'));
    expect(serviceRectSpy).toHaveBeenCalled();
    expect(getcoordinateSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getColor call getTraceColor when a line element is passed in argument', () => {
    const serviceRectSpy: jasmine.Spy = spyOn(service, 'getTraceColor');
    const getcoordinateSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG').and.returnValue(LINE);
    service.getColor({localName: 'path'}, FAKE_KEY_MODIFIER, new MouseEvent('click'));
    expect(serviceRectSpy).toHaveBeenCalled();
    expect(getcoordinateSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });
  it('getColor call getEllipseColor when a ellipse element is passed in argument', () => {
    const serviceRectSpy: jasmine.Spy = spyOn(service, 'getEllipseColor');
    const getcoordinateSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG').and.returnValue(ELLIPSE);
    service.getColor({localName: 'ellipse'}, FAKE_KEY_MODIFIER, new MouseEvent('click'));
    expect(serviceRectSpy).toHaveBeenCalled();
    expect(getcoordinateSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getColor call getPolygonColor when a polygon element is passed in argument', () => {
    const serviceRectSpy: jasmine.Spy = spyOn(service, 'getPolygonColor');
    const getcoordinateSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG').and.returnValue(POLYGON);
    service.getColor({localName: 'polygon'}, FAKE_KEY_MODIFIER, new MouseEvent('click'));
    expect(serviceRectSpy).toHaveBeenCalled();
    expect(getcoordinateSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getColor call getTraceColor when a pen element is passed in argument', () => {
    const getTraceSpy: jasmine.Spy = spyOn(service, 'getTraceColor');
    const getcoordinateSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG').and.returnValue('pen');
    service.getColor({localName: 'pen'}, FAKE_KEY_MODIFIER, new MouseEvent('click'));
    expect(getTraceSpy).toHaveBeenCalled();
    expect(getcoordinateSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getColor call getTraceColor when a brush element is passed in argument', () => {
    const getTraceSpy: jasmine.Spy = spyOn(service, 'getTraceColor');
    const getcoordinateSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG').and.returnValue('brush');
    service.getColor({localName: 'brush'}, FAKE_KEY_MODIFIER, new MouseEvent('click'));
    expect(getTraceSpy).toHaveBeenCalled();
    expect(getcoordinateSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getColor call nothing when a no element is passed in argument', () => {
    const getcoordinateSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG').and.returnValue('');
    service.getColor({localName: ''}, FAKE_KEY_MODIFIER, new MouseEvent('click'));
    expect(getcoordinateSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getRectangleColor should set primary color with stroke on left click rectangle contour', () => {
    const setUpPrimarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpPrimaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    spyOn(service, 'isRectangleContourClicked').and.returnValue(true);
    const fakeKey = { shift: false, leftKey: true, rightKey: false };
    const aFakeRectangle = { children: ['a', 'a'] };
    service.getRectangleColor(aFakeRectangle, fakeKey, new MouseEvent('click'));
    expect(setUpPrimarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getRectangleColor should set secondary color with stroke on right click rectangle contour', () => {
    const setUpSecondarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpSecondaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    spyOn(service, 'isRectangleContourClicked').and.returnValue(true);
    const fakeKey = { shift: false, leftKey: false, rightKey: true };
    const aFakeRectangle = { children: ['a', 'a'] };
    service.getRectangleColor(aFakeRectangle, fakeKey, new MouseEvent('click'));
    expect(setUpSecondarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getRectangleColor should set primary color with fill on left click inside rectangle', () => {
    const setUpPrimarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpPrimaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    spyOn(service, 'isRectangleContourClicked').and.returnValue(false);
    const fakeKey = { shift: false, leftKey: true, rightKey: false };
    const aFakeRectangle = { children: ['a', 'a'] };
    service.getRectangleColor(aFakeRectangle, fakeKey, new MouseEvent('click'));
    expect(setUpPrimarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getRectangleColor should set secondary color with fill on right click inside rectangle', () => {
    const setUpSecondarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpSecondaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    spyOn(service, 'isRectangleContourClicked').and.returnValue(false);
    const fakeKey = { shift: false, leftKey: false, rightKey: true };
    const aFakeRectangle = { children: ['a', 'a'] };
    service.getRectangleColor(aFakeRectangle, fakeKey, new MouseEvent('click'));
    expect(setUpSecondarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getTraceColor should set primary color with fill on left click on path', () => {
    const setUpPrimarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpPrimaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    const fakeKey = { shift: false, leftKey: true, rightKey: false };
    const fakePath = { children: ['a', 'a'] };
    service.getTraceColor(fakePath, fakeKey);
    expect(setUpPrimarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getTraceColor should set secondary color with fill on right click on path', () => {
    const setUpSecondarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpSecondaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    const fakeKey = { shift: false, leftKey: false, rightKey: true };
    const fakePath = { children: ['a', 'a'] };
    service.getTraceColor(fakePath, fakeKey);
    expect(setUpSecondarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getEllipseColor should set primary color with fill on left click inside ellipse', () => {
    const setUpPrimarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpPrimaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    const fakeKey = { shift: false, leftKey: true, rightKey: false };
    const fakeEllipse = { children: ['a', 'a'] };
    spyOn(service, 'isEllipseContourClicked').and.returnValue(false);
    service.getEllipseColor(fakeEllipse, fakeKey, new MouseEvent('click'));
    expect(setUpPrimarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getEllipseColor should set secondary color with fill on right click inside ellipse', () => {
    const setUpSecondarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpSecondaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    const fakeKey = { shift: false, leftKey: false, rightKey: true };
    const fakeEllipse = { children: ['a', 'a'] };
    spyOn(service, 'isEllipseContourClicked').and.returnValue(false);
    service.getEllipseColor(fakeEllipse, fakeKey, new MouseEvent('click'));
    expect(setUpSecondarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getEllipseColor should set primary color with fill on left click on contour of ellipse', () => {
    const setUpPrimarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpPrimaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    const fakeKey = { shift: false, leftKey: true, rightKey: false };
    const fakeEllipse = { children: ['a', 'a'] };
    spyOn(service, 'isEllipseContourClicked').and.returnValue(true);
    service.getEllipseColor(fakeEllipse, fakeKey, new MouseEvent('click'));
    expect(setUpPrimarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getEllipseColor should set secondary color with fill on right click on contour of ellipse', () => {
    const setUpSecondarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpSecondaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const getAttrSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getAttributeValueFromSVG');
    const fakeKey = { shift: false, leftKey: false, rightKey: true };
    const fakeEllipse = { children: ['a', 'a'] };
    spyOn(service, 'isEllipseContourClicked').and.returnValue(true);
    service.getEllipseColor(fakeEllipse, fakeKey, new MouseEvent('click'));
    expect(setUpSecondarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(getAttrSpy).toHaveBeenCalled();
  });

  it('getPolygonColor should set primary color with fill on left click on polygon', () => {
    const setUpPrimarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpPrimaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const fakeKey = { shift: false, leftKey: true, rightKey: false };
    const fakePolygon = { attributes: { fill: { nodeValue: 10 } } };
    service.getPolygonColor(fakePolygon, fakeKey);
    expect(setUpPrimarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
  });

  it('getPolygonColor should set secondary color with fill on right click on polygon', () => {
    const setUpSecondarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpSecondaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const fakeKey = { shift: false, leftKey: false, rightKey: true };
    const fakePolygon = { attributes: { fill: { nodeValue: 10 } } };
    service.getPolygonColor(fakePolygon, fakeKey);
    expect(setUpSecondarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
  });

  it('getPolygonColor should set primary color with stroke on left click on polygon contour', () => {
    const setUpPrimarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpPrimaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const fakeKey = { shift: false, leftKey: true, rightKey: false };
    const fakePolygon = { attributes: { stroke: { nodeValue: 10 } } };
    service.getPolygonColor(fakePolygon, fakeKey);
    expect(setUpPrimarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
  });

  it('getPolygonColor should set secondary color with stroke on right click on polygon contour', () => {
    const setUpSecondarySpy: jasmine.Spy = spyOn(service.colorService, 'setUpSecondaryColor');
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'set');
    const fakeKey = { shift: false, leftKey: false, rightKey: true };
    const fakePolygon = { attributes: { stroke: { nodeValue: 10 } } };
    service.getPolygonColor(fakePolygon, fakeKey);
    expect(setUpSecondarySpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
  });

  it('isRectangleContourClicked should return true if contour is clicked or false otherwise', () => {
    const object: any = {
      attributes: {
        height: {
          nodeValue: '2',
        },
        width: {
          nodeValue: '2',
        },
        x: {
          nodeValue: '1.5',
        },
        y: {
          nodeValue: '1.5',
        },
      },
    };
    let fakePoint: Point = {x: 1, y: 1};
    const getSpy: jasmine.Spy = spyOn(service.drawingService, 'getAttributeValueFromSVG').and.returnValue('2');
    const getParentSpy: jasmine.Spy = spyOn(service.drawingService, 'getParentSVG');
    expect(service.isRectangleContourClicked(object, fakePoint)).toBe(true);
    expect(getSpy).toHaveBeenCalled();
    expect(getParentSpy);
    getSpy.calls.reset();
    getParentSpy.calls.reset();
    object.attributes.x.nodeValue = '1';
    fakePoint.x = 10000;
    expect(service.isRectangleContourClicked(object, fakePoint)).toBe(true);
    expect(getSpy).toHaveBeenCalled();
    expect(getParentSpy);
    getSpy.calls.reset();
    getParentSpy.calls.reset();
    fakePoint = {x: 0, y: 0};
    expect(service.isRectangleContourClicked(object, fakePoint)).toBe(false);
    expect(getParentSpy);
    expect(getSpy).toHaveBeenCalled();
  });

  it('isEllipseContourClicked should return true if contour is clicked or false otherwise', () => {
    const object: any = {
      attributes: {
        rx: {
          nodeValue: '2',
        },
        ry: {
          nodeValue: '2',
        },
        cx: {
          nodeValue: '0',
        },
        cy: {
          nodeValue: '0',
        },
      },
    };
    let fakePoint: Point = {x: 1, y: 1};
    const getSpy: jasmine.Spy = spyOn(service.drawingService, 'getAttributeValueFromSVG').and.returnValue('2');
    const getParentSpy: jasmine.Spy = spyOn(service.drawingService, 'getParentSVG');
    expect(service.isEllipseContourClicked(object, fakePoint)).toBe(true);
    expect(getSpy).toHaveBeenCalled();
    expect(getParentSpy);
    getSpy.calls.reset();
    getParentSpy.calls.reset();
    fakePoint = {x: 0, y: 0};
    expect(service.isEllipseContourClicked(object, fakePoint)).toBe(false);
    expect(getParentSpy);
    expect(getSpy).toHaveBeenCalled();
  });
});
