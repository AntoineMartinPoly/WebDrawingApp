import { Injectable } from '@angular/core';
import { ONE_HUNDRED_EIGHTY } from 'src/constant/shape/constant';

@Injectable({
  providedIn: 'root',
})

export class LineCoordinatesService {

  rotationAngle: number;
  sizeOfLine: number;

  constructor( rotationAngle: number, sizeOfLine: number) {
    this.rotationAngle = rotationAngle;
    this.sizeOfLine = sizeOfLine;
  }

  getX1(offset: number) {
    return  offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / ONE_HUNDRED_EIGHTY);
  }

  getY1(offset: number) {
    return  offset + (this.sizeOfLine / 2) * Math.sin(-this.rotationAngle * Math.PI / ONE_HUNDRED_EIGHTY);
  }

  getX2(offset: number) {
    return  offset - (this.sizeOfLine / 2) * Math.cos(-this.rotationAngle * Math.PI / ONE_HUNDRED_EIGHTY);
  }

  getY2(offset: number) {
    return  offset  - (this.sizeOfLine / 2) * Math.sin(-this.rotationAngle * Math.PI / ONE_HUNDRED_EIGHTY);
  }

}
