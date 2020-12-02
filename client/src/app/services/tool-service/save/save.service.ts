import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AES } from 'crypto-ts';
import { Observable } from 'rxjs';
import { ZERO } from 'src/constant/constant';
import { DEFAULT_NAME_IMG, IMG_TYPE } from 'src/constant/tool-service/save/constant';
import { Drawing } from 'src/interface/drawing';
import { DrawingElement } from 'src/interface/drawing-element';
import { SAVE_DRAWING_PATH, SAVE_ID_TAG_PATH } from '../../../../../../common/route';
import {LOCAL_SAVE_SECRET} from '../../../../constant/do/not/open/or/feel/GOD_1/s/fury/this-is-your-final-warning';
import { DrawingService } from '../../drawing/drawing.service';

@Injectable({
  providedIn: 'root',
})
export class SaveService {

  drawingService: DrawingService;

  constructor(private http: HttpClient, public firebaseStorage: AngularFireStorage) {
    this.drawingService = DrawingService.getInstance();
  }

  generateDrawingObject(theName: string, theDrawing: DrawingElement[], tagTable?: string[]): Drawing {
    return {
      name: theName,
      drawing: theDrawing,
      tags: tagTable,
    };
  }

  saveDrawing(drawing: Drawing): Observable<string> {
    return this.http.post<string>(SAVE_DRAWING_PATH, drawing);
  }

  isTagDuplicated(tagTable: string[], aTag: string): boolean {
    for (const tag of tagTable) {
      if (tag === aTag) {
        return true;
      }
    }
    return false;
  }

  createImageSrc(): string {
    return btoa(new XMLSerializer().serializeToString(this.drawingService.svg));
  }

  createProprietaryImageSrc(xmlSerializer: XMLSerializer = new XMLSerializer()): string {
    const imageSrc = xmlSerializer.serializeToString(this.drawingService.svg);
    return btoa(AES.encrypt(imageSrc, LOCAL_SAVE_SECRET).toString());
  }

  convertImageSrcToFile(src: string): File {
    const byte = window.atob(src);
    const array = new Uint8Array(new ArrayBuffer(byte.length));
    for (let i = ZERO; i < byte.length; i++) {
      array[i] = byte.charCodeAt(i);
    }
    const blob = new Blob([array], { type: IMG_TYPE });
    return new File([blob], DEFAULT_NAME_IMG, { type: IMG_TYPE });
  }

  sendImage(id: string, src: string) {
    const image: File = this.convertImageSrcToFile(src);
    this.firebaseStorage.upload(id, image);
  }

  saveIdTagRelation(id: string, theName: string, tagTable: string[]): Observable<string> {
    return this.http.post<string>(SAVE_ID_TAG_PATH, { _id: id, name: theName, tags: tagTable });
  }

}
