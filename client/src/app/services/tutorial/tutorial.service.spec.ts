import { TestBed } from '@angular/core/testing';
import { TUTORIAL } from 'src/constant/storage/constant';
import { StorageService } from '../storage/storage.service';
import { TutorialService } from './tutorial.service';

describe('TutorialService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
      ],
    });
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    const service: TutorialService = TestBed.get(TutorialService);
    expect(service).toBeTruthy();
  });

  it('isDeactivated should true if tutorial is deactivated or else false', () => {
    const service: TutorialService = TestBed.get(TutorialService);
    expect(service.isDeactivated()).toBe(false);
    service.saveIsTutorialActive(true);
    expect(service.isDeactivated()).toBe(true);
    service.saveIsTutorialActive(false);
    expect(service.isDeactivated()).toBe(false);
  });

  it('saveIsTutorialActive should call the state function ', () => {
    const service: TutorialService = TestBed.get(TutorialService);
    service.saveIsTutorialActive(true);
    expect(localStorage.getItem(TUTORIAL)).toMatch(JSON.stringify(false));
    service.saveIsTutorialActive(false);
    expect(localStorage.getItem(TUTORIAL)).toMatch(JSON.stringify(true));
  });

});
