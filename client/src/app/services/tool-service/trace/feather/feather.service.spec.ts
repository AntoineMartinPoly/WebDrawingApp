import { TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import { FEATHER_OPTION_LINE_LENGTH, FEATHER_OPTION_ORIENTATION_ANGLE } from 'src/constant/storage/constant';
import {MockElementRef, NO_VALUE, PRIMARY_COLOR, SPACE} from '../../../../../constant/constant';
import {FAKE_FEATHER} from '../../../../../constant/shape/constant';
import {LINE_TAG, ORIGIN_TAG, WHITE} from '../../../../../constant/svg/constant';
import {DEFAULT_POINT} from '../../../../../constant/tool-service/constant';
import {LineCoordinatesService} from './coordinatesClaculator/line-coordinates.service';
import { FeatherService } from './feather.service';

describe('FeatherService', () => {
  let service: FeatherService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(FeatherService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateFeatherElement should call generateSVGElement, addSVGElementFromRef, setSVGAttributes' +
    ' and addSVGToSVG', () => {
    const addFromRefSpy  = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setSvgSpy = spyOn(service.drawingService, 'setSVGattribute');
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy = spyOn(service.drawingService, 'addSVGToSVG');
    service.generateFeatherElement();
    expect(genSpy).toHaveBeenCalled();
    expect(addFromRefSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(setSvgSpy).toHaveBeenCalled();
  });

  it('createFeather should create feather', () => {
    const mouseEvent = DEFAULT_POINT as MouseEvent;
    service.lastMouseEvent = DEFAULT_POINT as MouseEvent;
    const coordSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({x: 10, y: 7});
    service.storage.set(PRIMARY_COLOR, WHITE);
    service.rotationAngle = 0;
    service.sizeOfLine = 10;
    service.lineCoordinates = new LineCoordinatesService(service.rotationAngle, service.sizeOfLine);
    const path = ORIGIN_TAG +  service.lineCoordinates.getX1(service.lastMouseEvent.x).toString() + SPACE
      + service.lineCoordinates.getY1(service.lastMouseEvent.y).toString()
      + LINE_TAG + service.lineCoordinates.getX2(service.lastMouseEvent.x).toString() + SPACE
      + service.lineCoordinates.getY2(service.lastMouseEvent.y).toString() + LINE_TAG
      + service.lineCoordinates.getX2(10).toString() + SPACE
      + service.lineCoordinates.getY2(7).toString() + LINE_TAG
      + service.lineCoordinates.getX1(10).toString() + SPACE
      + service.lineCoordinates.getY1(7).toString();
    const mockElementRef = new MockElementRef();
    const feather = service.createFeather(mockElementRef, mouseEvent);
    expect(feather.color).toEqual(WHITE);
    expect(feather.ref).toEqual(mockElementRef);
    expect(feather.Path).toEqual(path);
    expect(coordSpy).toHaveBeenCalled();
  });

  it('generateFirstLine call generateSVGElement, addSVGTOSVG and editFirstLine methodes', () => {
    const editSpy = spyOn(service, 'editFirstLine');
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy = spyOn(service.drawingService, 'addSVGToSVG');
    const mouseEvent = {layerX: 10 , layerY: 10} as MouseEvent;
    service.generateFirstLine(mouseEvent);
    expect(addSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('editFirstLine should call setSVGAttributes 2 times', () => {
    const setSvgSpy = spyOn(service.drawingService, 'setSVGattribute');
    const coordSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({x: 7, y: 10});
    const mouseEvent = {x: 10 , y: 10} as MouseEvent;
    service.editFirstLine(mouseEvent, new MockElementRef());
    expect(setSvgSpy).toHaveBeenCalledTimes(1);
    expect(coordSpy).toHaveBeenCalled();

  });

  it('setFeatherOption set rotationAngle and sizeOfLine ', () => {
    service.storage.set(FEATHER_OPTION_LINE_LENGTH, '10');
    service.storage.set(FEATHER_OPTION_ORIENTATION_ANGLE, '40');
    service.setFeatherOption();
    expect(service.rotationAngle).toEqual(40);
    expect(service.sizeOfLine).toEqual(10);
  });

  it('setLastEvent set lastMouseEvent', () => {
    const coordSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({x: 10, y: 7});
    const mouseEvent = {x: 10 , y: 10} as MouseEvent;
    service.setLastEvent(mouseEvent);
    expect(service.lastMouseEvent).toEqual({x: 10, y: 7} as MouseEvent);
    expect(coordSpy).toHaveBeenCalled();
  });

  it('setPath should call setSVGAttributes 2 times', () => {
    const feather = FAKE_FEATHER ;
    const setSvgSpy = spyOn(service.drawingService, 'setSVGattribute');
    service.setPath(feather);
    expect(setSvgSpy).toHaveBeenCalledTimes(1);
  });

  it('updateFeatherPath call generateSVGElement, createFeather, setPath and addSVGToSVG', () => {
    const mouseEvent = {x: 10 , y: 10} as MouseEvent;
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy = spyOn(service.drawingService, 'addSVGToSVG');
    const createSpy = spyOn(service, 'createFeather').and.returnValue(FAKE_FEATHER);
    const setPathSpy = spyOn(service, 'setPath');
    service.updateFeatherPath(mouseEvent);
    expect(genSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(setPathSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
  });

  it('createFeatherFromSVGElement return a feather', () => {
    const mockElementRef = new MockElementRef();
    const getSVGSpy = spyOn(service.drawingService, 'getSVGElementAttributes');
    const feather = service.createFeatherFromSVGElement(mockElementRef);
    expect(feather.ref).toEqual(mockElementRef);
    expect(feather.Path).toEqual(NO_VALUE);
    expect(getSVGSpy).toHaveBeenCalled();
  });

  it('sendRotationAngle should send rotationAngle', () => {
    let test = false;
    service.getAngle().subscribe((angle) => {
      if (angle === 10) {
        test = true;
      }
    });
    service.sendRotationAngle(10);
    expect(test).toBe(true);
  });

  it('getAngle should get rotationAngle', () => {
    expect(service.getAngle() instanceof Observable).toBe(true);
  });

  it('generateGroupTag call generateSVGElement addSVGElement and setSVGAttributes', () => {
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    service.generateGroupTag();
    expect(genSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
  });

  it('removeElement call removeSVGElementFromRef and removeDrawingElement', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const removeManagerSpy = spyOn(service.drawingElementManager, 'removeDrawingElement');
    const  feather = FAKE_FEATHER;
    service.removeElement(feather);
    expect(removeSpy).toHaveBeenCalled();
    expect(removeManagerSpy).toHaveBeenCalled();
  });

  it('reAddElement call addSVGElementFromRef and appendDrawingElement ', () => {
    const feather = FAKE_FEATHER;
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    service.reAddElement(feather);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });

});
