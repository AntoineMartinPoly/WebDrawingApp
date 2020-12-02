import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataTextService {

  // tslint:disable-next-line:no-empty
  constructor() { }

  private policySizeSubject = new Subject<number>();
  private boldSubject =  new Subject<boolean>();
  private italicSubject = new Subject<boolean>();
  private anchorSubject = new Subject<string>();
  private policySubject = new Subject<string>();

  sendPolicySize(policy: number) {
    this.policySizeSubject.next(policy);
  }

  getPolicySize(): Observable<number> {
    return this.policySizeSubject.asObservable();
  }

  sendBold(isBold: boolean) {
    this.boldSubject.next(isBold);
  }

  getBold(): Observable<boolean> {
    return this.boldSubject.asObservable();
  }

  sendItalic(isItalic: boolean) {
    this.italicSubject.next(isItalic);
  }

  getItalic(): Observable<boolean> {
    return this.italicSubject.asObservable();
  }

  sendAnchor(option: string) {
    this.anchorSubject.next(option);
  }

  getAnchor(): Observable<string> {
    return this.anchorSubject.asObservable();
  }

  sendPolicy(option: string) {
    this.policySubject.next(option);
  }

  getPolicy(): Observable<string> {
    return this.policySubject.asObservable();
  }
}
