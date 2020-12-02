import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { ToolbarService } from './toolbar.service';

describe('ToolbarService', () => {

  let service: ToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getWindowToOpen should return a instance of observable', () => {
    expect(service.getWindowToOpen() instanceof Observable).toBe(true);
  });

  it('sendWindow should send the windows name', (done) => {
    service.getWindowToOpen().subscribe((window: string) => {
      expect(window).toMatch('test');
      done();
    });
    service.sendWindow('test');
  });

  it('executeHandlerUpdate should return a instance of observable', () => {
    expect(service.executeHandlerUpdate() instanceof Observable).toBe(true);
  });

  it('initiateHandlerUpdate should trigger updateToolHandler subscribtion', (done) => {
    service.executeHandlerUpdate().subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });
    service.initiateHandlerUpdate();
  });
});
