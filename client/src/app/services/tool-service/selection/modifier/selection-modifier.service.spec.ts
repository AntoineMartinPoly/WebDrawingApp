import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { SelectionModifierService } from './selection-modifier.service';

describe('SelectionModifierService', () => {
  let service: SelectionModifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionModifierService],
    });
    service = TestBed.get(SelectionModifierService);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('getTransformationsFromDrawingElement should return the attribute found by the drawingService', () => {
    const getSpy = spyOn(service.drawingService, 'getAttributeValueFromSVG').and.returnValue('Value returned');
    expect(service.getTransformationsFromDrawingElement({ref: new MockElementRef()})).toBe('Value returned');
    expect(getSpy).toHaveBeenCalled();
  });

  it('setTransformAttribute should call setSVGattribute of drawingService', () => {
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    service.setTransformAttribute(new MockElementRef(), 'fake value');
    expect(setSpy).toHaveBeenCalled();
  });

  it('resetFirstAction should reset all attribute to default value and call resetAdditionnalAttribute', () => {
    const resetSpy = spyOn(service, 'resetAdditionnalAttribute');
    service.initialTransformValues = ['asd', '123'];
    service.transformIterator = 42;
    service.resetFirstAction();
    expect(resetSpy).toHaveBeenCalled();
    expect(service.initialTransformValues).toEqual([]);
    expect(service.transformIterator).toEqual(0);
  });
});
