import { TestBed } from '@angular/core/testing';
import { PRIMARY_COLOR, SECONDARY_COLOR, SEVEN } from 'src/constant/constant';
import { FAKE_POINT, FAKE_RECTANGLE_VALUE, MockElementRef } from 'src/constant/shape/constant';
import { BUCKET, DATA_TYPE, GROUP } from 'src/constant/svg/constant';
import { Bucket, Side } from 'src/interface/bucket/bucket';
import { Point } from 'src/interface/Point';
import { BucketService } from './bucket.service';

describe('BucketService', () => {
  let service: BucketService;
  const FAKE_BUCKET = {ref: new MockElementRef(), isBucket: true} as Bucket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(BucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPixelColor should get correct pixel color in img.data', () => {
    service.img = {data: new Uint8ClampedArray([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]), width: 2};
    expect(service.getPixelColor({x: 1, y: 1})).toEqual(new Uint8ClampedArray([3, 3, 3, 3]));
  });

  it('setPixel should set correct pixel in img.data', () => {
    service.img = {data: new Uint8ClampedArray([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]), width: 2};
    service.floodColor = new Uint8ClampedArray([55, 66, 77, 88]);
    service.setPixel({x: 1, y: 1});
    expect(service.img.data.slice(12, 16)).toEqual(service.floodColor);
  });

  it('colorsMatch should return true if colors within range', () => {
    const FAKE_COLOR = new Uint8ClampedArray([1, 1, 1, 1]);
    const FAKE_COLOR_TWO = new Uint8ClampedArray([1, 255, 255, 255]);
    service.tolerance = 0.1;
    expect(service.colorsMatch(FAKE_COLOR, FAKE_COLOR)).toBe(true);
    expect(service.colorsMatch(FAKE_COLOR, FAKE_COLOR, false)).toBe(true);
    service.tolerance = 1;
    expect(service.colorsMatch(FAKE_COLOR, FAKE_COLOR_TWO)).toBe(true);
  });

  it('colorsMatch should return false if colors not within range', () => {
    const FAKE_COLOR = new Uint8ClampedArray([1, 1, 1, 1]);
    const FAKE_COLOR_TWO = new Uint8ClampedArray([1, 255, 255, 255]);
    service.tolerance = 0.1;
    expect(service.colorsMatch(FAKE_COLOR, FAKE_COLOR_TWO)).toBe(false);
    expect(service.colorsMatch(FAKE_COLOR, FAKE_COLOR_TWO, false)).toBe(false);
  });

  it('floodInit should call floodAlgorithm  colorize context.putImageData colorsMatch getPixelColor', () => {
    const FAKE_COLOR = new Uint8ClampedArray([2, 3]);
    const matchSpy = spyOn(service, 'colorsMatch').and.returnValue(false);
    const getColorSpy = spyOn(service, 'getPixelColor').and.returnValue(FAKE_COLOR);
    const floodSpy = spyOn(service, 'floodAlgorithm');
    const colorizeSpy = spyOn(service, 'colorize');
    expect(service.floodInit(FAKE_POINT)).toBe(true);
    expect(matchSpy).toHaveBeenCalled();
    expect(getColorSpy).toHaveBeenCalled();
    expect(floodSpy).toHaveBeenCalled();
    expect(colorizeSpy).toHaveBeenCalled();
  });

  it('floodInit should set colorToFill and call colorsMatch getPixelColor then return  false if same color is clicked', () => {
    const FAKE_COLOR = new Uint8ClampedArray([2, 3]);
    const matchSpy = spyOn(service, 'colorsMatch').and.returnValue(true);
    const getColorSpy = spyOn(service, 'getPixelColor').and.returnValue(FAKE_COLOR);
    expect(service.floodInit(FAKE_POINT)).toBe(false);
    expect(matchSpy).toHaveBeenCalled();
    expect(getColorSpy).toHaveBeenCalled();
    expect(service.colorToFill).toEqual(FAKE_COLOR);
  });

  it('floodAlgorithm should call getTopPixel topToBottomSearch and append the values to pixelColumns', () => {
    service.currentPixelStack = [FAKE_POINT, FAKE_POINT];
    const FAKE_POINT_TOP = {x: 123, y: 345} as Point;
    const FAKE_POINT_BOTTOM = {x: 123, y: 345} as Point;
    const getSpy = spyOn(service, 'getTopPixel').and.returnValue(FAKE_POINT_TOP);
    const searchSpy = spyOn(service, 'topToBottomSearch').and.returnValue(FAKE_POINT_BOTTOM);
    service.floodAlgorithm();
    expect(getSpy).toHaveBeenCalled();
    expect(searchSpy).toHaveBeenCalled();
  });

  it('getTopPixel should return top pixel', () => {
    const getColorSpy = spyOn(service, 'getPixelColor');
    const matchSpy = spyOn(service, 'colorsMatch').and.returnValues(true, true, false);
    service.canvasDimensions = FAKE_RECTANGLE_VALUE;
    const FAKE_POINT_ONE = {x: 5, y: 5} as Point;
    const bottomPoint = service.getTopPixel(FAKE_POINT_ONE);
    expect(getColorSpy).toHaveBeenCalled();
    expect(matchSpy).toHaveBeenCalled();
    expect(bottomPoint).toEqual({x: FAKE_POINT_ONE.x, y: FAKE_POINT_ONE.y - 1});
  });

  it('topToBottomSearch should return lowest pixel', () => {
    const setSpy = spyOn(service, 'setPixel');
    const getColorSpy = spyOn(service, 'getPixelColor');
    const horizontalSpy = spyOn(service, 'compareHorizontalPixel');
    const matchSpy = spyOn(service, 'colorsMatch').and.returnValues(true, true, false);
    service.canvasDimensions = FAKE_RECTANGLE_VALUE;
    service.canvasDimensions.height = SEVEN;
    const FAKE_POINT_ONE = {x: 5, y: 3} as Point;
    const bottomPoint = service.topToBottomSearch(FAKE_POINT_ONE);
    expect(getColorSpy).toHaveBeenCalled();
    expect(horizontalSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(matchSpy).toHaveBeenCalled();
    expect(bottomPoint).toEqual({x: FAKE_POINT_ONE.x, y: FAKE_POINT_ONE.y + 2});
  });

  it('compareHorizontalPixel should return true if pixel above is not similar and new pixel is similar', () => {
    const getColorSpy = spyOn(service, 'getPixelColor');
    const matchColorSpy = spyOn(service, 'colorsMatch').and.returnValue(true);
    let comparizonResult: boolean;
    comparizonResult = service.compareHorizontalPixel(FAKE_POINT, false, Side.left);
    expect(comparizonResult).toBe(true);
    expect(getColorSpy).toHaveBeenCalledWith({x: FAKE_POINT.x - 1, y: FAKE_POINT.y});
    comparizonResult = service.compareHorizontalPixel(FAKE_POINT, false, Side.right);
    expect(comparizonResult).toBe(true);
    expect(getColorSpy).toHaveBeenCalledWith({x: FAKE_POINT.x + 1, y: FAKE_POINT.y});
    expect(matchColorSpy).toHaveBeenCalled();
  });

  it('compareHorizontalPixel should return false if pixel above is similar and new pixel is not similar', () => {
    const getColorSpy = spyOn(service, 'getPixelColor');
    const matchColorSpy = spyOn(service, 'colorsMatch').and.returnValue(false);
    let comparizonResult: boolean;
    comparizonResult = service.compareHorizontalPixel(FAKE_POINT, true, Side.left);
    expect(comparizonResult).toBe(false);
    expect(getColorSpy).toHaveBeenCalledWith({x: FAKE_POINT.x - 1, y: FAKE_POINT.y});
    comparizonResult = service.compareHorizontalPixel(FAKE_POINT, true, Side.right);
    expect(comparizonResult).toBe(false);
    expect(getColorSpy).toHaveBeenCalledWith({x: FAKE_POINT.x + 1, y: FAKE_POINT.y});
    expect(matchColorSpy).toHaveBeenCalled();
  });

  it('compareHorizontalPixel should return false same value if nothing changes', () => {
    const getColorSpy = spyOn(service, 'getPixelColor');
    const matchColorSpy = spyOn(service, 'colorsMatch').and.returnValues(false, false, true, true);
    let comparizonResult: boolean;
    comparizonResult = service.compareHorizontalPixel(FAKE_POINT, false, Side.left);
    expect(comparizonResult).toBe(false);
    expect(getColorSpy).toHaveBeenCalledWith({x: FAKE_POINT.x - 1, y: FAKE_POINT.y});
    comparizonResult = service.compareHorizontalPixel(FAKE_POINT, false, Side.right);
    expect(comparizonResult).toBe(false);
    expect(getColorSpy).toHaveBeenCalledWith({x: FAKE_POINT.x + 1, y: FAKE_POINT.y});
    expect(matchColorSpy).toHaveBeenCalled();
    comparizonResult = service.compareHorizontalPixel(FAKE_POINT, true, Side.left);
    expect(comparizonResult).toBe(true);
    expect(getColorSpy).toHaveBeenCalledWith({x: FAKE_POINT.x - 1, y: FAKE_POINT.y});
    comparizonResult = service.compareHorizontalPixel(FAKE_POINT, true, Side.right);
    expect(comparizonResult).toBe(true);
    expect(getColorSpy).toHaveBeenCalledWith({x: FAKE_POINT.x + 1, y: FAKE_POINT.y});
    expect(matchColorSpy).toHaveBeenCalled();
  });

  it('generateBucketElement call generateSVGElement setSVGattribute and set bucket attribute', () => {
    const generateSpy = spyOn(service.drawingService, 'generateSVGElement').and.returnValue(new MockElementRef());
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    service.generateBucketElement();
    expect(service.bucket).toEqual(FAKE_BUCKET);
    expect(generateSpy).toHaveBeenCalledWith(GROUP);
    expect(setSpy).toHaveBeenCalledWith(FAKE_BUCKET.ref, DATA_TYPE, BUCKET);
  });

  it('colorize should call generateSVGElement addSVGToSVG addSVGElementFromRef setSVGattribute storage.get', () => {
    const generateSpy = spyOn(service.drawingService, 'generateSVGElement');
    const appendSpy = spyOn(service.drawingService, 'addSVGToSVG');
    const addSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const setSpy = spyOn(service.drawingService, 'setSVGattribute');
    const storageSpy = spyOn(service.storageService, 'get');
    service.bucket = FAKE_BUCKET;
    service.colorize();
    expect(generateSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
  });

  it('colorize should call storage.get with PRIMARY or SECONDARY color', () => {
    spyOn(service.drawingService, 'generateSVGElement');
    spyOn(service.drawingService, 'addSVGToSVG');
    spyOn(service.drawingService, 'addSVGElementFromRef');
    spyOn(service.drawingService, 'setSVGattribute');
    const getSpy = spyOn(service.storageService, 'get');
    service.bucket = FAKE_BUCKET;
    service.isLeftClick = true;
    service.colorize();
    expect(getSpy).toHaveBeenCalledWith(PRIMARY_COLOR);
    service.isLeftClick = false;
    service.colorize();
    expect(getSpy).toHaveBeenCalledWith(SECONDARY_COLOR);
  });

  it('removeElement should call removeSVGElementFromRef and removeDrawingElement', () => {
    const referenceSpy = spyOn(service.drawingService, 'removeSVGElementFromRef');
    const managerSpy = spyOn(service.drawingElementManager, 'removeDrawingElement');
    service.removeElement(FAKE_BUCKET);
    expect(referenceSpy).toHaveBeenCalledWith(FAKE_BUCKET.ref);
    expect(managerSpy).toHaveBeenCalledWith(FAKE_BUCKET);
  });

  it('reAddElement should call addSVGElementFromRef and appendDrawingElement', () => {
    const referenceSpy = spyOn(service.drawingService, 'addSVGElementFromRef');
    const managerSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    service.reAddElement(FAKE_BUCKET);
    expect(referenceSpy).toHaveBeenCalledWith(FAKE_BUCKET.ref);
    expect(managerSpy).toHaveBeenCalledWith(FAKE_BUCKET);
  });
});
