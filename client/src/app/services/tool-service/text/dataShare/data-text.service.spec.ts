import { TestBed } from '@angular/core/testing';

import {Observable} from 'rxjs';
import { DataTextService } from './data-text.service';

describe('DataTextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    expect(service).toBeTruthy();
  });

  it('sendPolicySize should send policySize', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getPolicySize().subscribe((size) => {
      if (size === 10) {
        test = true;
      }
    });
    service.sendPolicySize(10);
    expect(test).toBe(true);
  });

  it('getPolicySize should return a instance of observable', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    expect(service.getPolicySize() instanceof Observable).toBe(true);
  });

  it('sendPolicy should send policy', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getPolicy().subscribe((option) => {
      if (option === 'normal') {
        test = true;
      }
    });
    service.sendPolicy('normal');
    expect(test).toBe(true);
  });

  it('getPolicy should return a instance of observable', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    expect(service.getPolicy() instanceof Observable).toBe(true);
  });

  it('sendBold should send boldStatus', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getBold().subscribe((status) => {
      if (status) {
        test = true;
      }
    });
    service.sendBold(true);
    expect(test).toBe(true);
  });

  it('getBold should return a instance of observable', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    expect(service.getBold() instanceof Observable).toBe(true);
  });

  it('sendItalic should send italic status', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getItalic().subscribe((status) => {
      if (!status) {
        test = true;
      }
    });
    service.sendItalic(false);
    expect(test).toBe(true);
  });

  it('getItalic should return a instance of observable', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    expect(service.getItalic() instanceof Observable).toBe(true);
  });

  it('sendAnchor should send anchor option', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getAnchor().subscribe((option) => {
      if (option === 'middle') {
        test = true;
      }
    });
    service.sendAnchor('middle');
    expect(test).toBe(true);
  });

  it('getAnchor should return a instance of observable', () => {
    const service: DataTextService = TestBed.get(DataTextService);
    expect(service.getAnchor() instanceof Observable).toBe(true);
  });
});
