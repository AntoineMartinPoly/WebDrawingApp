import { Injectable } from '@angular/core';
import { NO_VALUE, ZERO } from 'src/constant/constant';
import { ALL_STORAGE_ELEMENT, DEFAULT_STORAGE_VALUE, ERROR } from 'src/constant/storage/constant';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  set(name: string, value: string, type: boolean = false): void {
    (type ? sessionStorage : localStorage).setItem(name, value);
  }

  delete(name: string, type: boolean = false): void {
    (type ? sessionStorage : localStorage).removeItem(name);
  }

  deleteAll(type: boolean = false): void {
    (type ? sessionStorage : localStorage).clear();
  }

  get(name: string, type: boolean = false): string {
    const info: string | null = (type ? sessionStorage : localStorage).getItem(name);
    return info ? info : ERROR;
  }

  exist(name: string, type: boolean = false): boolean {
    return this.get(name, type) !== ERROR;
  }

  init(): void {
    for (let i: number = ZERO; i < ALL_STORAGE_ELEMENT.length; i++) {
      if (!this.exist(ALL_STORAGE_ELEMENT[i]) || this.get(ALL_STORAGE_ELEMENT[i]) === NO_VALUE) {
        this.set(ALL_STORAGE_ELEMENT[i], DEFAULT_STORAGE_VALUE[i]);
      }
    }
  }

}
