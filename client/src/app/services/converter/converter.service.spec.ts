import { TestBed } from '@angular/core/testing';
import { DECIMAL } from 'src/constant/constant';
import { EIGHT_ZEROS, HASHTAG, MAX_EIGHT_BIT_NUMBER } from 'src/constant/toolbar/service/constant';
import { FAKE_TABLE } from 'src/constant/toolbar/shape/constant';
import { ConverterService } from './converter.service';

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(ConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(' getLineVectorFromPoints should return the difference between two point', () => {
    const resultOne = FAKE_TABLE[0].x - FAKE_TABLE[1].x;
    const resultTwo = FAKE_TABLE[0].y - FAKE_TABLE[1].y;
    expect(service.getLineVectorFromPoints(FAKE_TABLE).x).toEqual(resultOne);
    expect(service.getLineVectorFromPoints(FAKE_TABLE).y).toEqual(resultTwo);
  });

  it('getNewPointFromStraightLine should call getLineVectorFromPoints and return new point converted', () => {
    const table = FAKE_TABLE;
    const lineVector = service.getLineVectorFromPoints(table);
    const lineHypotenus = Math.sqrt(lineVector.x * lineVector.x + lineVector.y * lineVector.y);
    const distance = 5;
    const newPoint = {
      x: table[1].x + (lineVector.x * distance) / lineHypotenus,
      y: table[1].y + (lineVector.y * distance) / lineHypotenus,
    };
    expect(service.getNewPointFromStraightLine(table, distance)).toEqual(newPoint);
  });

  it('getEndPointFromPath should return the end point coordinate of path', () => {
    let path = 'M 10 10 L 45 50';
    const pathEnd = path;
    path = path.slice(path.indexOf('L') + 2);
    const xCoord = parseInt(path.substr(0, path.indexOf(' ')), DECIMAL);
    const yCoord = parseInt(path.slice(path.indexOf(' ') + 1), DECIMAL);
    const point = { x: xCoord, y: yCoord };
    expect(service.getEndPointFromPath(pathEnd).x).toEqual(point.x);
    expect(service.getEndPointFromPath(pathEnd).y).toEqual(point.y);
  });

  it('ColorRGBAToHexString should convert RGBA format color to Hexadecimal ', () => {
    const colorRGBA = { red: 255, green: 255, blue: 0, opacity: 0 };
    const hexaSting = HASHTAG + (EIGHT_ZEROS +
      (MAX_EIGHT_BIT_NUMBER * MAX_EIGHT_BIT_NUMBER * MAX_EIGHT_BIT_NUMBER * colorRGBA.red +
        MAX_EIGHT_BIT_NUMBER * MAX_EIGHT_BIT_NUMBER * colorRGBA.green +
        MAX_EIGHT_BIT_NUMBER * colorRGBA.blue +
        colorRGBA.opacity).toString(16)).slice(-8);
    expect(service.ColorRGBAToHexString(colorRGBA)).toEqual(hexaSting);
  });

  it('HexStringToColorRGBA should convert Hexadecimal  format color to RGBA', () => {
    const colorRGBA = '#0000FFFF';
    const redS = parseInt(colorRGBA.substr(1, 2), 16);
    const greenS = parseInt(colorRGBA.substr(3, 2), 16);
    const blueS = parseInt(colorRGBA.substr(5, 2), 16);
    const opacityS = parseInt(colorRGBA.substr(7, 2), 16);
    expect(service.HexStringToColorRGBA(colorRGBA).blue).toEqual(blueS);
    expect(service.HexStringToColorRGBA(colorRGBA).green).toEqual(greenS);
    expect(service.HexStringToColorRGBA(colorRGBA).opacity).toEqual(opacityS);
    expect(service.HexStringToColorRGBA(colorRGBA).red).toEqual(redS);
  });

});
