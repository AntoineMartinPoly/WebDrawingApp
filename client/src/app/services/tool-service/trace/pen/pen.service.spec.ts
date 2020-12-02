import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MockElementRef, PRIMARY_COLOR, SEVEN } from 'src/constant/constant';
import { PEN_OPTION_THICKNESS_MAX, PEN_OPTION_THICKNESS_MIN } from 'src/constant/storage/constant';
import { DEFAULT_POINT } from 'src/constant/tool-service/constant';
import { FAKE_POINT } from 'src/constant/toolbar/shape/constant';
import { Pen } from 'src/interface/trace/pen';
import { PenService } from './pen.service';

describe('PenService', () => {
  let service: PenService;
  let storage: StorageService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(PenService);
    storage = TestBed.get(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generatePenElement should call drawing service addSVGElementFromRef / setSVGattribute / generateSVGElement / addSVGToSVG', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const SVGSpy = spyOn(service.drawingService, 'addSVGToSVG');
    service.generatePenElement();
    expect(setSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalled();
    expect(SVGSpy).toHaveBeenCalled();
  });

  it('createPenFromSVGElement should should should create a Brush object and call getSVGElementAttributes', () => {
    const fakePenElement = new MockElementRef();
    const fakePen: Pen = {
      ref: fakePenElement,
      start_point_paths: [{x: 0, y: 0}],
      path_refs: [],
      path: '',
      thicknessMax: 0,
      thicknessMin: 0,
      color: 'black',
    };
    const setSpy = spyOn(service.drawingService, 'getSVGElementAttributes').and.returnValue('black');
    const pen = service.createPenFromSVGElement(fakePenElement);
    expect(pen).toEqual(fakePen);
    expect(setSpy).toHaveBeenCalled();
  });

  it('createPen should call drawing service addSVGElementFromRef / setSVGattribute / generateSVGElement', () => {
    const coordSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({ x: 10, y: 7 });
    const addOptionsSpy = spyOn(service, 'addPenOptions');
    const mockMouseClick = DEFAULT_POINT as MouseEvent;
    storage.set(PEN_OPTION_THICKNESS_MAX, '22');
    storage.set(PEN_OPTION_THICKNESS_MIN, '2');
    const pen = service.createPen(new MockElementRef(), mockMouseClick);
    expect(coordSpy).toHaveBeenCalled();
    expect(addOptionsSpy).toHaveBeenCalled();
    expect(pen.path).toBe('M 10 7');
    expect(pen.thicknessMax).toBe(22);
    expect(pen.thicknessMin).toBe(2);
    expect(pen.color).toBe(storage.get(PRIMARY_COLOR));
  });

  it('addPenOptions should call setSVGattribute twice', () => {
    const setSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const FAKE_PEN: Pen = { path: '', thicknessMax: 10, thicknessMin: 0, color: 'black', ref: new MockElementRef() } as Pen;
    service.addPenOptions(FAKE_PEN);
    expect(setSpy).toHaveBeenCalledTimes(2);
  });

  it('updatePath should call getSpeedFromEvent and editPathsByInterpolation', () => {
    const updateSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({ x: 10, y: 7 });
    const mouseSpeedSpy = spyOn(service, 'getSpeedFromEvent');
    const editSpy = spyOn(service, 'editPathsByInterpolation');
    const mockMouseClick = DEFAULT_POINT as MouseEvent;
    const fakePen = { path: '', start_point_paths: [{}],
      thicknessMax: 22, thicknessMin: 2, color: 'black', ref: new MockElementRef(),
    } as Pen;
    service.updatePath(fakePen, mockMouseClick);
    expect(updateSpy).toHaveBeenCalled();
    expect(mouseSpeedSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('editPathsByInterpolation should call generatePenElement, getThicknessFromSpeed, editSVGpath', () => {
    const generateSpy = spyOn(service, 'generatePenElement');
    const getThicknessSpy = spyOn(service, 'getThicknessFromSpeed');
    const editSpy = spyOn(service, 'editSVGpath');
    const FAKE_PEN = { path: '', start_point_paths: [{x: 0, y: 0}],
      thicknessMax: 22, thicknessMin: 2, color: 'black', ref: new MockElementRef(),
    } as Pen;
    service.editPathsByInterpolation(FAKE_PEN, FAKE_POINT, FAKE_POINT);
    expect(generateSpy).toHaveBeenCalled();
    expect(getThicknessSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
  });

  it('editPen should call setSVGattribute to modify pencil line element 5 times', () => {
    const updateSpy = spyOn(service.drawingService, 'setSVGattribute');
    const FAKE_PEN = { path: '', thicknessMax: 2, color: 'black', ref: new MockElementRef() } as Pen;
    service.editSVGpath({nativeElement: {}} , FAKE_PEN, SEVEN);
    expect(updateSpy).toHaveBeenCalledTimes(5);
  });

  it('getThicknessFromSpeed should return thickness', () => {
    const FAKE_PEN = { path: '', thicknessMax: 10, thicknessMin: 0, color: 'black', ref: new MockElementRef() } as Pen;
    const thickness = service.getThicknessFromSpeed(3.5, FAKE_PEN);
    expect(thickness).toBe(5);
  });

  it('generateGpenTag should call generateSVGElement, addSVGElementFromRef, setSVGattribute and return group ref', () => {
    const genSpy = spyOn(service.drawingService, 'generateSVGElement').and.returnValue(new MockElementRef());
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const groupRef = service.generateGpenTag();
    expect(groupRef).toEqual(new MockElementRef());
    expect(genSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
  });

  it('getSpeedFromEvent should not do anything if event timestamp is undefined', () => {
    const event = {} as MouseEvent;
    service.previousMouseSpeed = 0;
    service.mouseSpeed = 3;
    service.lastMouseEvent = {} as MouseEvent;
    service.getSpeedFromEvent(event);
    expect(service.previousMouseSpeed).toEqual(0);
    expect(service.mouseSpeed).toEqual(3);
    expect(service.lastMouseEvent).toEqual({} as MouseEvent);
  });

  it('getSpeedFromEvent should change previousMouseSpeed for currentMouseSpeed and update lastMouseEvent', () => {
    const event = new MouseEvent('click');
    service.previousMouseSpeed = 0;
    service.mouseSpeed = 3;
    service.getSpeedFromEvent(event);
    expect(service.previousMouseSpeed).toEqual(3);
    expect(service.lastMouseEvent).toEqual(event);
  });

  it('getSpeedFromEvent should change previousMouseSpeed for currentMouseSpeed and update lastMouseEvent', () => {
    const event = new MouseEvent('click');
    service.previousMouseSpeed = 0;
    service.mouseSpeed = 3;
    service.lastMouseEvent = {} as MouseEvent;
    service.getSpeedFromEvent(event);
    expect(service.previousMouseSpeed).toEqual(3);
    expect(service.lastMouseEvent).toEqual(event);
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    service.removeElement({ref: new MockElementRef()} as Pen);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    service.reAddElement({ref: new MockElementRef()} as Pen);
    expect(addSpy).toHaveBeenCalled();
  });
});
