import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MockElementRef, PRIMARY_COLOR } from 'src/constant/constant';
import { PENCIL_OPTION_THICKNESS } from 'src/constant/storage/constant';
import { PATH_ATTRIBUTE, STROKE, STROKE_WIDTH } from 'src/constant/svg/constant';
import { DEFAULT_POINT } from 'src/constant/tool-service/constant';
import { Pencil } from 'src/interface/trace/pencil';
import { PencilService } from './pencil.service';

describe('PencilService', () => {

  let service: PencilService;
  let storage: StorageService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [StorageService, Renderer2],
  }));

  beforeEach(() => {
    service = TestBed.get(PencilService);
    storage = TestBed.get(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generatePencilElement should call drawing service addSVGElementFromRef / setSVGattribute / generateSVGElement / addSVGToSVG', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const genSpy = spyOn(service.drawingService, 'generateSVGElement');
    const SVGSpy = spyOn(service.drawingService, 'addSVGToSVG');
    service.generatePencilElement();
    expect(setSpy).toHaveBeenCalledTimes(2);
    expect(addSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalledTimes(2);
    expect(SVGSpy).toHaveBeenCalled();
  });

  it('createPencil should call drawing service addSVGElementFromRef / setSVGattribute / generateSVGElement', () => {
    const coordSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({ x: 10, y: 7 });
    const addOptionsSpy = spyOn(service, 'addPencilOptions');
    const mockMouseClick = DEFAULT_POINT as MouseEvent;
    storage.set(PENCIL_OPTION_THICKNESS, '22');
    const pencil = service.createPencil(new MockElementRef(), mockMouseClick);
    expect(coordSpy).toHaveBeenCalled();
    expect(addOptionsSpy).toHaveBeenCalled();
    expect(pencil.path).toBe('M 10 7');
    expect(pencil.thickness).toBe(22);
    expect(pencil.color).toBe(storage.get(PRIMARY_COLOR));
  });

  it('addPencilOptions should call setSVGattribute 3 times', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const FAKE_PENCIL: Pencil = { path: '', thickness: 2, color: 'black', ref: {children: ['asd']} };
    service.addPencilOptions(FAKE_PENCIL);
    expect(setSpy).toHaveBeenCalledTimes(3);
  });

  it('createPencilFromSVGElement should create a Pencil object or return null if element is not for pencil', () => {
    const fakePencilElement: ElementRef = new MockElementRef();
    (fakePencilElement as any).children = [''];
    const getSVGAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getSVGElementAttributes');
    getSVGAttributeSpy.withArgs('', PATH_ATTRIBUTE, false).and.returnValue('P');
    getSVGAttributeSpy.withArgs(fakePencilElement, STROKE_WIDTH).and.returnValue('2');
    getSVGAttributeSpy.withArgs(fakePencilElement, STROKE).and.returnValue('black');
    const pencil = service.createPencilFromSVGElement(fakePencilElement);
    expect(pencil.path).toMatch('P');
    expect(pencil.thickness).toBe(2);
    expect(pencil.color).toMatch('black');
    expect(getSVGAttributeSpy).toHaveBeenCalledTimes(3);
  });

  it('updatePath should update path', () => {
    const updateSpy = spyOn(service.drawingService, 'getRelativeCoordinates').and.returnValue({ x: 10, y: 7 });
    const mockMouseClick = DEFAULT_POINT as MouseEvent;
    const fakePencil = { path: '', thickness: 2, color: 'black', ref: new MockElementRef() };
    service.updatePath(fakePencil, mockMouseClick);
    expect(updateSpy).toHaveBeenCalled();
    expect(fakePencil.path).toBe(' L 10 7');
    expect(fakePencil.thickness).toBe(2);
    expect(fakePencil.color).toBe('black');
  });

  it('editPencil should call setSVGattribute to modify pencil line element 6 times', () => {
    const updateSpy = spyOn(service.drawingService, 'setSVGattribute');
    const FAKE_PENCIL = { path: '', thickness: 2, color: 'black', ref: {children: ['asd']} };
    service.editSVGpath(FAKE_PENCIL);
    expect(updateSpy).toHaveBeenCalledTimes(3);
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const fakeRectangle: Pencil = { path: '', thickness: 2, color: 'black', ref: {children: ['asd']} };
    service.removeElement(fakeRectangle);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef and appendObject', () => {
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const fakeRectangle: Pencil = { path: '', thickness: 2, color: 'black', ref: {children: ['asd']} };
    service.reAddElement(fakeRectangle);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });
});
