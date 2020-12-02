import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Shortcut } from 'src/interface/shortcut';
import {FAKE_NAME} from '../../../constant/tool-service/save/constant';
import {SHAPE_COMPONENT, TEXT_COMPONENT, TRACE_COMPONENT} from '../../../constant/toolbar/constant';
import {StorageService} from '../storage/storage.service';
import { ShortcutService } from './shortcut.service';

describe('ShortcutService', () => {

  let service: ShortcutService;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ShortcutService);
    storage = TestBed.get(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('giveToolShortcut', () => {
    [
      {shortcutKey: '2', expected: 1},
      {shortcutKey: '4', expected: undefined},
      {shortcutKey: 'c', expected: 0},
      {shortcutKey: 'h', expected: undefined},
    ].forEach((testCase: {shortcutKey: string, expected: number | undefined}) => {
      it(`should return ${testCase.expected} when the shortcut key ${testCase.shortcutKey} is passed in`, () => {
        expect(service.giveToolShortcut({key: testCase.shortcutKey} as Shortcut)).toBe(testCase.expected);
      });
    });
  });

  describe('handleToolShortcut', () => {
    let shapeSpy: jasmine.Spy;
    let traceSpy: jasmine.Spy;

    beforeEach(() => {
      traceSpy = spyOn(service, 'handleTraceShortcut');
      shapeSpy = spyOn(service, 'handleShapeShortcut');
    });

    it(`should call handleTraceShortcut when a trace shortcut is used`, () => {
      const fakeShortcut = {key: FAKE_NAME};
      service.handleToolShortcut(fakeShortcut as unknown as Shortcut, TRACE_COMPONENT);
      expect(traceSpy).toHaveBeenCalledWith(fakeShortcut);
    });

    it(`should call handleShapeShortcut when a shape shortcut is used`, () => {
      const fakeShortcut = {key: FAKE_NAME};
      service.handleToolShortcut(fakeShortcut as unknown as Shortcut, SHAPE_COMPONENT);
      expect(shapeSpy).toHaveBeenCalledWith(fakeShortcut);
    });

    it(`should call nothing when neither a shape nor trace shortcut is used`, () => {
      const fakeShortcut = {key: FAKE_NAME};
      service.handleToolShortcut(fakeShortcut as unknown as Shortcut, TEXT_COMPONENT);
      expect(shapeSpy).not.toHaveBeenCalled();
      expect(traceSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleTraceShortcut', () => {
    [
      {shortcutKey: 'c', isFromToolbar: true, expected: undefined},
      {shortcutKey: 'c', isFromToolbar: false, expected: 'trace_pencil'},
    ].forEach((testCase: {shortcutKey: string, isFromToolbar: boolean, expected: string | void}) => {
      it(`should return ${testCase.expected} when the shortcut key is ${testCase.shortcutKey}
      and isFromToolbar is ${testCase.isFromToolbar}`, () => {
        spyOn(service, 'handleTraceShortcut').and.callThrough();
        spyOn(storage, 'set');
        expect(service.handleTraceShortcut({key: testCase.shortcutKey} as unknown as Shortcut, testCase.isFromToolbar))
          .toBe(testCase.expected);
      });
    });
  });

  describe('handleShapeShortcut', () => {
    [
      {shortcutKey: '1', isFromToolbar: true, expected: undefined},
      {shortcutKey: '1', isFromToolbar: false, expected: 'shape_rectangle'},
    ].forEach((testCase: {shortcutKey: string, isFromToolbar: boolean, expected: string | void}) => {
      it(`should return ${testCase.expected} when the shortcut key is ${testCase.shortcutKey}
      and isFromToolbar is ${testCase.isFromToolbar}`, () => {
        spyOn(service, 'handleShapeShortcut').and.callThrough();
        spyOn(service, 'getShapeRequested').and.returnValue('shape_rectangle');
        expect(service.handleShapeShortcut({key: testCase.shortcutKey} as unknown as Shortcut, testCase.isFromToolbar))
          .toBe(testCase.expected);
      });
    });
  });

  it('createShortcutObject should return Shortcut object with right value', () => {
    const mockEvent: any = {
      key: 'c',
      ctrlKey: true,
    };
    const shortcut: Shortcut = service.createShortcutObject(mockEvent);
    expect(shortcut.key).toMatch('c');
    expect(shortcut.isCtrl).toBe(true);
  });

  it('getShortcut should return a instance of observable', () => {
    expect(service.getShortcut() instanceof Observable).toBe(true);
  });

  it('createShortcutObject should return Shortcut object with right value', () => {
    const mockEvent: any = {
      key: 'c',
      ctrlKey: true,
    };
    const shortcut: Shortcut = service.createShortcutObject(mockEvent);
    expect(shortcut.key).toMatch('c');
    expect(shortcut.isCtrl).toBe(true);
  });

  it('applyShortcutAccess should return a instance of observable', () => {
    expect(service.applyShortcutAccess() instanceof Observable).toBe(true);
  });

  it('changeShortcutAccess should return boolean to dictate shortcut avaibilities', (done) => {
    const isEnable = false;
    service.applyShortcutAccess().subscribe((enable: boolean) => {
      expect(enable).toBe(isEnable);
      done();
    });
    service.changeShortcutAccess(isEnable);
  });

});
