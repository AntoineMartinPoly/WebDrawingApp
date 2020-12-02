import { TestBed } from '@angular/core/testing';
import { PRIMARY_COLOR, SECONDARY_COLOR } from 'src/constant/constant';
import { MockElementRef } from 'src/constant/shape/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { ColorizerService } from './colorizer.service';

describe('ColorizerService', () => {

  let service: ColorizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('colorize should call getAttributeValueFromSVG and either colorizeShape or colorizeTrace depending on the element type', () => {
    const getAttributeSpy: jasmine.Spy = spyOn(service.drawingService, 'getAttributeValueFromSVG');
    const colorizeShapeSpy: jasmine.Spy = spyOn(service, 'colorizeShape');
    const colorizeTraceSpy: jasmine.Spy = spyOn(service, 'colorizeTrace');
    getAttributeSpy.and.returnValue('rectangle');
    service.colorize(new MockElementRef(), {leftKey: false});
    expect(colorizeShapeSpy).toHaveBeenCalled();
    colorizeShapeSpy.calls.reset();
    getAttributeSpy.and.returnValue('polygon');
    service.colorize(new MockElementRef(), {leftKey: false});
    expect(colorizeShapeSpy).toHaveBeenCalled();
    colorizeShapeSpy.calls.reset();
    getAttributeSpy.and.returnValue('ellipse');
    service.colorize(new MockElementRef(), {leftKey: false});
    expect(colorizeShapeSpy).toHaveBeenCalled();
    colorizeShapeSpy.calls.reset();
    getAttributeSpy.and.returnValue('pencil');
    service.colorize(new MockElementRef(), {leftKey: false});
    expect(colorizeTraceSpy).toHaveBeenCalled();
    colorizeTraceSpy.calls.reset();
    getAttributeSpy.and.returnValue('brush');
    service.colorize(new MockElementRef(), {leftKey: false});
    expect(colorizeTraceSpy).toHaveBeenCalled();
    colorizeTraceSpy.calls.reset();
    getAttributeSpy.and.returnValue('pen');
    service.colorize(new MockElementRef(), {leftKey: false});
    expect(colorizeTraceSpy).toHaveBeenCalled();
    colorizeTraceSpy.calls.reset();
    getAttributeSpy.and.returnValue('');
    service.colorize(new MockElementRef(), {leftKey: false});
    expect(colorizeTraceSpy).not.toHaveBeenCalled();
    expect(colorizeShapeSpy).not.toHaveBeenCalled();
  });

  it('shape should call storage function get, setSVGattribute and set color depending on click side', () => {
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'get').and.returnValue(PRIMARY_COLOR);
    const setSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeObjectRef: any = { ref: {}, color: { fill: '' } };
    const fakeKeyModifier: KeyModifier = { leftKey: true, rightKey: false };
    service.colorizeShape(fakeObjectRef, fakeKeyModifier);
    expect(storageSpy).toHaveBeenCalled();
    expect(setSVGSpy).toHaveBeenCalled();
  });

  it('shape should call storage function get, setSVGattribute and set color depending on click side', () => {
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'get').and.returnValue(SECONDARY_COLOR);
    const setSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeObjectRef: any = { ref: {}, color: { contour: '' } };
    const fakeKeyModifier: KeyModifier = { leftKey: false, rightKey: true };
    service.colorizeShape(fakeObjectRef, fakeKeyModifier);
    expect(storageSpy).toHaveBeenCalled();
    expect(setSVGSpy).toHaveBeenCalled();
  });

  it('trace should call storage function get, setSVGattribute and set color depending on click side', () => {
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'get').and.returnValue(PRIMARY_COLOR);
    const setSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeObjectRef: any = { ref: {}, color: '' };
    const fakeKeyModifier: KeyModifier = { leftKey: true, rightKey: false };
    service.colorizeTrace(fakeObjectRef, fakeKeyModifier);
    expect(storageSpy).toHaveBeenCalled();
    expect(setSVGSpy).toHaveBeenCalled();
    expect(fakeObjectRef.color).toMatch(service.storage.get(PRIMARY_COLOR));
  });

  it('trace should call storage function get, setSVGattribute and set color depending on click side', () => {
    const storageSpy: jasmine.Spy = spyOn(service.storage, 'get').and.returnValue(SECONDARY_COLOR);
    const setSVGSpy: jasmine.Spy = spyOn(service.drawingService, 'setSVGattribute');
    const fakeObjectRef: any = { ref: {}, color: '' };
    const fakeKeyModifier: KeyModifier = { leftKey: false, rightKey: true };
    service.colorizeTrace(fakeObjectRef, fakeKeyModifier);
    expect(storageSpy).toHaveBeenCalled();
    expect(setSVGSpy).toHaveBeenCalled();
    expect(fakeObjectRef.color).toMatch(service.storage.get(SECONDARY_COLOR));
  });

});
