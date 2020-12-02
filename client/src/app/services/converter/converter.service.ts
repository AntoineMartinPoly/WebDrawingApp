import { Injectable } from '@angular/core';
import { DECIMAL, FIVE, HEXADECIMAL, MINUS_EIGHT, ONE, SEVEN, THREE, TWO, ZERO } from 'src/constant/constant';
import { SPACE } from 'src/constant/svg/constant';
import { EIGHT_ZEROS, HASHTAG, L, MAX_EIGHT_BIT_NUMBER } from 'src/constant/toolbar/service/constant';
import { ColorRGBA } from 'src/interface/colors';
import { Point } from 'src/interface/Point';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {

  getNewPointFromStraightLine(points: Point[], distance: number): Point {
    const lineVector = this.getLineVectorFromPoints(points);
    const lineHypotenus = Math.sqrt(lineVector.x * lineVector.x + lineVector.y * lineVector.y);
    const newPoint = { x: points[ONE].x + ( lineVector.x * distance) / lineHypotenus,
                       y: points[ONE].y + ( lineVector.y * distance) / lineHypotenus};
    return newPoint;
  }

  getLineVectorFromPoints(points: Point[]): Point {
    return {x: points[ZERO].x - points[ONE].x, y: points[ZERO].y - points[ONE].y};
  }

  getEndPointFromPath(path: string): Point {
    path = path.slice(path.indexOf(L) + TWO);
    const xCoord = parseInt(path.substr(ZERO, path.indexOf(SPACE)), DECIMAL);
    const yCoord = parseInt(path.slice(path.indexOf(SPACE) + ONE), DECIMAL);
    const point = {x: xCoord, y: yCoord};
    return point as Point;
  }

  ColorRGBAToHexString(color: ColorRGBA): string {
    return HASHTAG + ( EIGHT_ZEROS +
      (MAX_EIGHT_BIT_NUMBER * MAX_EIGHT_BIT_NUMBER * MAX_EIGHT_BIT_NUMBER * color.red +
      MAX_EIGHT_BIT_NUMBER * MAX_EIGHT_BIT_NUMBER * color.green +
      MAX_EIGHT_BIT_NUMBER * color.blue +
      color.opacity).toString(HEXADECIMAL)).slice(MINUS_EIGHT);
  }

  HexStringToColorRGBA(color: string): ColorRGBA {
    // format : #ffaaffaa
    const redS = parseInt(color.substr(ONE, TWO), HEXADECIMAL);
    const greenS = parseInt(color.substr(THREE, TWO), HEXADECIMAL);
    const blueS = parseInt(color.substr(FIVE, TWO), HEXADECIMAL);
    const opacityS = parseInt(color.substr(SEVEN, TWO), HEXADECIMAL);
    return {red: redS, green: greenS, blue: blueS, opacity: opacityS};
  }

}
