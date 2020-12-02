import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import {
  FAKE_ELLIPSE, FAKE_POINT, FAKE_RECTANGLE, FULL, FULL_WITH_CONTOUR, SELECTION_RECT_CONT_COLOR, SELECTION_RECT_FILL_COLOR
} from 'src/constant/shape/constant';
import { ResizeState, SELECTION_ELLIPSE_RADIUS, SELECTION_ELLIPSE_TOP_LEFT_INDEX } from 'src/constant/tool-service/constant';
import { FAKE_KEY_MODIFIER } from 'src/constant/toolbar/constant';
import { Rectangle } from 'src/interface/shape/rectangle';
import { SelectionDrawerService } from './selection-drawer.service';

describe('SelectionDrawerService', () => {
  let service: SelectionDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionDrawerService],
    });
    service = TestBed.get(SelectionDrawerService);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('generateSelection should call RectangleService to generate a rectangle', () => {
    const genSpy = spyOn((service as any).rectangleService, 'generateRectangleElement');
    service.generateSelection();
    expect(genSpy).toHaveBeenCalled();
  });

  it('createSelection should create a rectangle with custom value for selection and create the selection circles', () => {
    const fakeRectangleElement: MockElementRef = new MockElementRef();
    const fakePoint = {x: 10, y: -10};
    const createSpy = spyOn(service, 'createSelectionCircles');
    const rectangle: Rectangle = service.createSelection(fakeRectangleElement, fakePoint);
    expect(createSpy).toHaveBeenCalled();
    expect(rectangle.ref).toEqual(fakeRectangleElement);
    expect(rectangle.value.origin).toEqual(fakePoint);
    expect(rectangle.value.height).toEqual(0);
    expect(rectangle.value.width).toEqual(0);
    expect(rectangle.option.contourThickness).toEqual(2);
    expect(rectangle.option.traceType).toEqual(FULL_WITH_CONTOUR);
    expect(rectangle.color.contour).toEqual(SELECTION_RECT_CONT_COLOR);
    expect(rectangle.color.fill).toEqual(SELECTION_RECT_FILL_COLOR);
  });

  it('generateSelectionCircle should call EllipseService to generate a rectangle', () => {
    const genSpy = spyOn((service as any).ellipseService, 'generateEllipseElement');
    service.generateSelectionCircle();
    expect(genSpy).toHaveBeenCalled();
  });

  it('createSelectionCircles should create 8 ellipses with custom value for selection', () => {
    const fakeEllipseRef: MockElementRef = new MockElementRef();
    spyOn(service, 'generateSelectionCircle').and.returnValue(fakeEllipseRef);
    const createSpy = spyOn(service, 'createSelectionCircles');
    service.createSelectionCircles();
    expect(createSpy).toHaveBeenCalled();
    for ( const ellipse of (service as any).selectionCircles ) {
      expect(ellipse.ref).toEqual(fakeEllipseRef);
      expect(ellipse.param.origin).toEqual({x: 0, y: 0});
      expect(ellipse.param.horizontalRadius).toEqual(SELECTION_ELLIPSE_RADIUS);
      expect(ellipse.param.verticalRadius).toEqual(SELECTION_ELLIPSE_RADIUS);
      expect(ellipse.param.horizontalCenter).toEqual(0);
      expect(ellipse.param.verticalCenter).toEqual(0);
      expect(ellipse.option.contourThickness).toEqual(2);
      expect(ellipse.option.traceType).toEqual(FULL);
      expect(ellipse.color.contourThickness).toEqual(0);
      expect(ellipse.color.fill).toEqual(SELECTION_RECT_CONT_COLOR);
    }
  });

  it('addSelectionOption should add ellipse and rectangle option to selection', () => {
    const addEllipseSpy = spyOn((service as any).ellipseService, 'addEllipseOption');
    const addRectSpy = spyOn((service as any).rectangleService, 'addRectangleOption');
    const setSpy = spyOn((service as any).drawingService, 'setSVGattribute');
    (service as any).selectionCircles = [FAKE_ELLIPSE];
    service.addSelectionOption({ref: {children: ['123']}} as Rectangle);
    expect(addEllipseSpy).toHaveBeenCalled();
    expect(addRectSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
  });

  it('updateValues should add ellipse and rectangle option to selection', () => {
    const updateALLSpy = spyOn(service, 'updateAllSelectionCircles');
    const updateSpy = spyOn((service as any).rectangleService, 'updateValues');
    const relSpy = spyOn((service as any).drawingService, 'getRelativeCoordinates').and.returnValue(FAKE_POINT);
    service.updateValues({ref: {children: ['123']}} as Rectangle, new MouseEvent('click'), FAKE_KEY_MODIFIER);
    expect(updateSpy).toHaveBeenCalled();
    expect(relSpy).toHaveBeenCalled();
    expect(updateALLSpy).toHaveBeenCalled();
  });

  it('updateAllSelectionCircles should call all update methods for selection circles', () => {
    const updateTSpy = spyOn(service, 'updateTopCircles');
    const updateTRSpy = spyOn(service, 'updateTopRightCircles');
    const updateRSpy = spyOn(service, 'updateRightCircles');
    const updateBRSpy = spyOn(service, 'updateBottomRightCircles');
    const updateBSpy = spyOn(service, 'updateBottomCircles');
    const updateBLSpy = spyOn(service, 'updateBottomLeftCircles');
    const updateLSpy = spyOn(service, 'updateLeftCircles');
    const updateTLSpy = spyOn(service, 'updateTopLeftCircles');
    service.updateAllSelectionCircles(FAKE_RECTANGLE);
    expect(updateTSpy).toHaveBeenCalledWith(FAKE_RECTANGLE);
    expect(updateTRSpy).toHaveBeenCalledWith(FAKE_RECTANGLE);
    expect(updateRSpy).toHaveBeenCalledWith(FAKE_RECTANGLE);
    expect(updateBRSpy).toHaveBeenCalledWith(FAKE_RECTANGLE);
    expect(updateBSpy).toHaveBeenCalledWith(FAKE_RECTANGLE);
    expect(updateBLSpy).toHaveBeenCalledWith(FAKE_RECTANGLE);
    expect(updateLSpy).toHaveBeenCalledWith(FAKE_RECTANGLE);
    expect(updateTLSpy).toHaveBeenCalledWith(FAKE_RECTANGLE);
  });

  it('updateTopLeftCircles should set top left circle x, y coordinates base on selection rectangle', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.updateTopLeftCircles(FAKE_RECTANGLE);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.x);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.y);
  });

  it('updateTopCircles should set top left circle x, y coordinates base on selection rectangle', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.updateTopCircles(FAKE_RECTANGLE);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width / 2);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.y);
  });

  it('updateTopRightCircles should set top left circle x, y coordinates base on selection rectangle', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.updateTopRightCircles(FAKE_RECTANGLE);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter).toEqual(
        FAKE_RECTANGLE.value.origin.y);
  });

  it('updateRightCircles should set top left circle x, y coordinates base on selection rectangle', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.updateRightCircles(FAKE_RECTANGLE);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height / 2);
  });

  it('updateBottomRightCircles should set top left circle x, y coordinates base on selection rectangle', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.updateBottomRightCircles(FAKE_RECTANGLE);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height);
  });

  it('updateBottomCircles should set top left circle x, y coordinates base on selection rectangle', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.updateBottomCircles(FAKE_RECTANGLE);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.x + FAKE_RECTANGLE.value.width / 2);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height);
  });

  it('updateBottomLeftCircles should set top left circle x, y coordinates base on selection rectangle', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.updateBottomLeftCircles(FAKE_RECTANGLE);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.x);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height);
  });

  it('updateLeftCircles should set top left circle x, y coordinates base on selection rectangle', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.updateLeftCircles(FAKE_RECTANGLE);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.x);
    expect((service as any).selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter).toEqual(
      FAKE_RECTANGLE.value.origin.y + FAKE_RECTANGLE.value.height / 2);
  });

  it('editSelection should call editShape from rectangle and ellipse to edit selection', () => {
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    const editEllipseSpy = spyOn((service as any).ellipseService, 'editEllipse');
    const aeditRectSpy = spyOn((service as any).rectangleService, 'editRectangle');
    service.editSelection(FAKE_RECTANGLE);
    expect(editEllipseSpy).toHaveBeenCalledTimes(8);
    expect(aeditRectSpy).toHaveBeenCalledTimes(1);
  });

  it('getCoordinate should call getRelativeCoordinates from DrawingService', () => {
    const getSpy = spyOn((service as any).drawingService, 'getRelativeCoordinates');
    service.getCoordinate(FAKE_POINT);
    expect(getSpy).toHaveBeenCalled();
  });

  it('removeRefFromDrawing should call removeSVGElementFromRef from DrawingService', () => {
    const removeSpy = spyOn((service as any).drawingService, 'removeSVGElementFromRef');
    service.removeRefFromDrawing(FAKE_RECTANGLE.ref);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('removeCircles should call removeRefFromDrawing for all 8 circles', () => {
    const removeSpy = spyOn(service, 'removeRefFromDrawing');
    (service as any).selectionCircles = [FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE,
                                        FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE, FAKE_ELLIPSE];
    service.removeCircles();
    expect(removeSpy).toHaveBeenCalledTimes(8);
  });

  it('isTargetSelectionCircles should return true if target is one of the 8 circles', () => {
    const fakeEllipse = FAKE_ELLIPSE;
    fakeEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeEllipse, fakeEllipse, fakeEllipse, fakeEllipse,
      fakeEllipse, fakeEllipse, fakeEllipse, fakeEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.isTargetSelectionCircles(fakeMouseEvent)).toBe(true);
  });

  it('isTargetSelectionCircles should return false if target is not one of the 8 circles', () => {
    const fakeEllipse = FAKE_ELLIPSE;
    fakeEllipse.ref = {children: [456]};
    (service as any).selectionCircles = [fakeEllipse, fakeEllipse, fakeEllipse, fakeEllipse,
      fakeEllipse, fakeEllipse, fakeEllipse, fakeEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.isTargetSelectionCircles(fakeMouseEvent)).toBe(false);
  });

  it('getResizeState should return ResizeState.topLeft if the topLeft circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse,
      fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.topLeft);
  });

  it('getResizeState should return ResizeState.top if the top circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeNotTargetEllipse, fakeTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse,
      fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.top);
  });

  it('getResizeState should return ResizeState.topRight if the topRight circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeNotTargetEllipse, fakeNotTargetEllipse, fakeTargetEllipse, fakeNotTargetEllipse,
      fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.topRight);
  });

  it('getResizeState should return ResizeState.Right if the Right circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeTargetEllipse,
      fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.right);
  });

  it('getResizeState should return ResizeState.bottomRight if the bottomRight circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse,
      fakeNotTargetEllipse, fakeTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.bottomRight);
  });

  it('getResizeState should return ResizeState.bottom if the bottom circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse,
      fakeNotTargetEllipse, fakeNotTargetEllipse, fakeTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.bottom);
  });

  it('getResizeState should return ResizeState.bottomLeft if the bottomLeft circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse,
      fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeTargetEllipse, fakeNotTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.bottomLeft);
  });

  it('getResizeState should return ResizeState.left if the left circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse,
      fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.left);
  });

  it('getResizeState should return ResizeState.none if the not one circle was clicked', () => {
    const fakeNotTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    const fakeTargetEllipse = Object.assign({}, FAKE_ELLIPSE);
    fakeNotTargetEllipse.ref = {children: [456]};
    fakeTargetEllipse.ref = {children: [123]};
    (service as any).selectionCircles = [fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse,
      fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse, fakeNotTargetEllipse];
    const fakeMouseEvent = new MouseEvent('click');
    const fakeTarget = {value: 123};
    Object.defineProperty(fakeMouseEvent, 'target', fakeTarget);
    expect(service.getResizeState(fakeMouseEvent)).toBe(ResizeState.none);
  });
});
