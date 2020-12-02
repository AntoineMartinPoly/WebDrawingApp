import { AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MockElementRef } from 'src/constant/constant';
import { Drawing } from 'src/interface/drawing';

export const ID_BEGIN = 0;
export const ID_END = 9;
export const LETTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const FAKE_NAME = 'BOB';
export const FAKE_TAGS: string[] = ['a', 'b', 'c'];
export const IMG_TYPE = 'image/svg+xml';
export const PROPRIETARY_IMG_TYPE = 'text/pdd';
export const DEFAULT_NAME_IMG = 'img';

export const FAKE_ID = 'bingbong';
export const FAKE_SRC = 'hellohello';
export const FAKE_VALUE = 'success';

export const FAKE_TAG_DUP = 'a';
export const FAKE_TAG_NOT_DUP = 'd';

export const FAKE_DRAWING: Drawing = {
    name: FAKE_NAME,
    drawing: [{
        ref: new MockElementRef(),
    }],
    tags: FAKE_TAGS,
};

export const MOCK_SRC = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNzc'
+ '1cHgiIHdpZHRoPSI4MDNweCI+PHJlY3QgZmlsbD0id2hpdGUiIGhlaWdodD0iNzc1cHgiIHdpZHRoPSI4MDNweCIvPjxkZWZzPjxmaWx0ZXIgaWQ9ImJsd'
+ 'XIiIHg9Ii0yMDAiIHk9Ii0yMDAiIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgcHJpbWl0aXZ'
+ 'lVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9ImxpbmVhclJHQiI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhd'
+ 'Glvbj0iMyAzIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJTb3VyY2VHcmFwaGljIiBlZGdlTW9kZT0ibm9uZSIgcmV'
+ 'zdWx0PSJibHVyMiIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9InNrZXRjaCIgeD0iLTIwMCIgeT0iLTIwMCIgd2lkdGg9IjEwMDAiIGhlaWdodD0iMTAwMCIgZ'
+ 'mlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBwcmltaXRpdmVVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGV'
+ 'ycz0ibGluZWFyUkdCIj48ZmVUdXJidWxlbmNlIHR5cGU9InR1cmJ1bGVuY2UiIGJhc2VGcmVxdWVuY3k9IjAuMDEgMC4wMTQiIG51bU9jdGF2ZXM9IjIiI'
+ 'HNlZWQ9IjIiIHN0aXRjaFRpbGVzPSJub1N0aXRjaCIgcmVzdWx0PSJ0dXJidWxlbmNlIi8+PGZlRGlzcGxhY2VtZW50TWFwIGluPSJTb3VyY2VHcmFwaGl'
+ 'jIiBpbjI9InR1cmJ1bGVuY2UiIHNjYWxlPSIyMCIgeENoYW5uZWxTZWxlY3Rvcj0iRyIgeUNoYW5uZWxTZWxlY3Rvcj0iQSIgcmVzdWx0PSJkaXNwbGFjZ'
+ 'W1lbnRNYXAiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJhZXJvc29sIiB4PSItMjAwIiB5PSItMjAwIiB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIxMDAwIiBmaWx'
+ '0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzP'
+ 'SJsaW5lYXJSR0IiPjxmZVR1cmJ1bGVuY2UgdHlwZT0idHVyYnVsZW5jZSIgYmFzZUZyZXF1ZW5jeT0iMC42IDAuNiIgbnVtT2N0YXZlcz0iNCIgc2VlZD0'
+ 'iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIgcmVzdWx0PSJ0dXJidWxlbmNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwI'
+ 'DAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIC0zMCAxMCIgaW49InR1cmJ1bGVuY2UiIHJlc3VsdD0iY29sb3JtYXRyaXgiLz48ZmVDb21wb3NpdGU'
+ 'gaW49ImNvbG9ybWF0cml4IiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0iaW4iIHJlc3VsdD0iY29tcG9zaXRlIi8+PGZlQ29tcG9zaXRlIGluPSJjb'
+ '21wb3NpdGUiIGluMj0iU291cmNlR3JhcGhpYyIgb3BlcmF0b3I9InhvciIgcmVzdWx0PSJjb21wb3NpdGUxIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0ibWF'
+ 'naWMiIHg9Ii0yMDAiIHk9Ii0yMDAiIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgcHJpbWl0a'
+ 'XZlVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9ImxpbmVhclJHQiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJ'
+ 'idWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjEyIDAuMDYiIGludW1PY3RhdmVzbj0iMSIgc2VlZD0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIgcmVzdWx0P'
+ 'SJ0dXJidWxlbmNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIC0'
+ '3MCAxMCIgaW49InR1cmJ1bGVuY2UiIHJlc3VsdD0iY29sb3JtYXRyaXgiLz48ZmVDb21wb3NpdGUgaW49ImNvbG9ybWF0cml4IiBpbjI9IlNvdXJjZUFsc'
+ 'GhhIiBvcGVyYXRvcj0iaW4iIHJlc3VsdD0iY29tcG9zaXRlIi8+PGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImNvbXBvc2l0ZSIgb3B'
+ 'lcmF0b3I9InhvciIgcmVzdWx0PSJjb21wb3NpdGUxIi8+PC9maWx0ZXI+PGZpbHRlciBpZD0iZmlsYW1lbnQiIHg9Ii0yMDAiIHk9Ii0yMDAiIHdpZHRoP'
+ 'SIxMDAwIiBoZWlnaHQ9IjEwMDAiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgcHJpbWl0aXZlVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2x'
+ 'vci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9ImxpbmVhclJHQiI+PGZlTW9ycGhvbG9neSBvcGVyYXRvcj0iZXJvZGUiIHJhZGl1cz0iMyAzIiB4PSIwJSIge'
+ 'T0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJTb3VyY2VHcmFwaGljIiByZXN1bHQ9Im1vcnBob2xvZ3kxIi8+PGZlTW9ycGhvbG9neSB'
+ 'vcGVyYXRvcj0iZXJvZGUiIHJhZGl1cz0iMSAxIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJTb3VyY2VHcmFwaGljI'
+ 'iByZXN1bHQ9Im1vcnBob2xvZ3kyIi8+PGZlTW9ycGhvbG9neSBvcGVyYXRvcj0iZXJvZGUiIHJhZGl1cz0iMiAyIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSI'
+ 'xMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJTb3VyY2VHcmFwaGljIiByZXN1bHQ9Im1vcnBob2xvZ3kzIi8+PGZlT2Zmc2V0IGR4PSI4IiBkeT0iLTEwIiB4P'
+ 'SIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJtb3JwaG9sb2d5MSIgcmVzdWx0PSJvZmZzZXQxIi8+PGZlT2Zmc2V0IGR4PSI'
+ 'xMCIgZHk9IjE1IiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJtb3JwaG9sb2d5MiIgcmVzdWx0PSJvZmZzZXQyIi8+P'
+ 'GZlTWVyZ2UgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiByZXN1bHQ9Im1lcmdlIj48ZmVNZXJnZU5vZGUgaW49Im9mZnNldDE'
+ 'iLz48ZmVNZXJnZU5vZGUgaW49Im9mZnNldDIiLz48L2ZlTWVyZ2U+PGZlTWVyZ2UgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlI'
+ 'iByZXN1bHQ9Im1lcmdlIj48ZmVNZXJnZU5vZGUgaW49Im1lcmdlIi8+PGZlTWVyZ2VOb2RlIGluPSJtb3JwaG9sb2d5MyIvPjwvZmVNZXJnZT48L2ZpbHR'
+ 'lcj48L2RlZnM+PHBhdGggZD0iTSAxNDIgMjAyIEwgMTQ0IDIwNCIgc3Ryb2tlLXdpZHRoPSIxMiIgZmlsbC1vcGFjaXR5PSIwIiBzdHJva2UtbGluZWNhc'
+ 'D0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZT0iIzU5ZmYwMGZmIi8+PHBhdGggcG9pbnRlci1ldmVudHM9InZpc2libGVTdHJva2U'
+ 'iIGQ9Ik0gMjA2IDM2NiBMIDIwNiAzNjIgTCAyMDYgMzU3IEwgMjA2IDM1MCBMIDIwNiAzMzIgTCAyMDYgMzEzIEwgMjA2IDI5MiBMIDIwOSAyNjUgTCAyM'
+ 'TYgMjM3IEwgMjIzIDIxMiBMIDIyNyAyMDEgTCAyMzUgMTgwIEwgMjQ0IDE2MSBMIDI1MiAxNDUgTCAyNjEgMTMwIEwgMjY0IDEyNiBMIDI2OSAxMTcgTCA'
+ 'yNzIgMTE1IEwgMjc2IDExMCBMIDI3OSAxMDYgTCAyODIgMTAzIEwgMjgzIDEwMiBMIDI4NCAxMDEgTCAyODUgMTAxIEwgMjg1IDEwMCBMIDI4NiAxMDAgT'
+ 'CAyODYgMTAwIEwgMjg2IDEwMSBMIDI4NiAxMDIgTCAyODcgMTA0IEwgMjg4IDEwNyBMIDI5MSAxMTMgTCAyOTMgMTIwIEwgMjk1IDEyOSBMIDI5OSAxMzk'
+ 'gTCAzMDUgMTYyIEwgMzA4IDE3MSBMIDMxMiAxODggTCAzMTcgMjA3IEwgMzIyIDIyNCBMIDMyNiAyNDEgTCAzMzEgMjU3IEwgMzM2IDI3MCBMIDM0MSAyO'
+ 'DMgTCAzNDMgMjg4IEwgMzQ2IDI5NyBMIDM0OSAzMDUgTCAzNTIgMzEyIEwgMzUzIDMxNSBMIDM1NSAzMTggTCAzNTYgMzIxIEwgMzU2IDMyMyBMIDM1NyA'
+ 'zMjQgTCAzNTcgMzI1IEwgMzU3IDMyNSBMIDM1NyAzMjUgTCAzNTcgMzI1IEwgMzUzIDMyMyBMIDM0OSAzMTkgTCAzNDIgMzE0IEwgMzI3IDMwMSBMIDMwO'
+ 'SAyODcgTCAyNzYgMjU2IEwgMjY0IDI0MyBMIDIzOSAyMTYgTCAyMTIgMTg3IEwgMjAyIDE3NSBMIDE4MiAxNTIgTCAxNjYgMTMzIEwgMTYwIDEyNiBMIDE'
+ '1MCAxMTQgTCAxNDcgMTExIEwgMTQxIDEwMyBMIDEzNiA5OCBMIDEzMyA5NCBMIDEzMiA5MiBMIDEzMCA5MSBMIDEzMCA5MCBMIDEyOSA4OSIgc3Ryb2tlL'
+ 'XdpZHRoPSIxMiIgZmlsbC1vcGFjaXR5PSIwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZT0iIzU5ZmY'
+ 'wMGZmIi8+PC9zdmc+';

export const MOCK_STORAGE_REF: AngularFireStorageReference = {
    getDownloadURL: () => {
      return new Observable<any>();
    },
    getMetadata: () => {
      return new Observable<any>();
    },
    delete: () => {
      return new Observable<any>();
    },
    child: () => {
      return new Observable<any>();
    },
    updateMetadata: () => {
      return new Observable<any>();
    },
    updateMetatdata: () => {
      return new Observable<any>();
    },
    put: (data: any) => {
      return '' as any;
    },
    putString: () => {
      return '' as any;
    },
  };
