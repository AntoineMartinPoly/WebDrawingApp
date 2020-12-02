import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { TWO } from 'src/constant/constant';
import { A_COMMA, EMPTY_STRING } from 'src/constant/toolbar/view-drawing/constant';
import { Drawing } from 'src/interface/drawing';
import { IdTag } from 'src/interface/id-tag';
import { GET_DRAWING_PATH, GET_IDS_BY_TAGS_PATH, GET_IS_NEXT_PATH } from '../.../../../../../../../common/route';

@Injectable({
  providedIn: 'root',
})
export class OpenService {

  constructor(private http: HttpClient, public firebaseStorage: AngularFireStorage) { }

  getDrawings(index: number, tags: string[]): Observable<IdTag[]> {
    return this.http.post<IdTag[]>(GET_IDS_BY_TAGS_PATH + index.toString(), tags);
  }

  isNext(index: number, tags: string[]): Observable<boolean> {
    return this.http.post<boolean>(GET_IS_NEXT_PATH + index.toString(), tags);
  }

  getDrawingInfo(id: string): Observable<Drawing> {
    return this.http.get<Drawing>(GET_DRAWING_PATH + id);
  }

  getImageUrl(id: string): Observable<string> {
    return this.firebaseStorage.ref(id).getDownloadURL();
  }

  stringifyTagList(idTagTable: IdTag[]) {
    let stringify = EMPTY_STRING;
    for (const element of idTagTable) {
      for (const tag of element.tags) {
        stringify += tag + A_COMMA;
      }
      element.tagsOnString = stringify.slice(0, stringify.length - TWO);
      stringify = EMPTY_STRING;
    }
  }

  getDrawingImageUrl(idTagTable: IdTag[]): void {
    for (const element of idTagTable) {
      this.getImageUrl(element._id).subscribe((url: string) => {
        element.link = url;
      });
    }
  }

}
