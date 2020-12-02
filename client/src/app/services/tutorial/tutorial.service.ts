import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DISABLE, ENABLE, NOT_DEACTIVATED, TUTORIAL } from 'src/constant/storage/constant';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {

  constructor(public storage: StorageService) { }

  isDeactivated(): boolean {
    return this.storage.exist(TUTORIAL) ?
      (this.storage.get(TUTORIAL) === DISABLE) :
      NOT_DEACTIVATED;
  }

  saveIsTutorialActive(isTutorialActive: boolean): void {
    this.storage.set(TUTORIAL, isTutorialActive ? DISABLE : ENABLE);
  }

}
