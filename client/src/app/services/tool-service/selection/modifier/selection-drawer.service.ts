import { ElementRef, Injectable } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TWO, ZERO } from 'src/constant/constant';
import { FULL_WITH_CONTOUR, SELECTION_RECT_CONT_COLOR, SELECTION_RECT_FILL_COLOR } from 'src/constant/shape/constant';
import { DEFAULT_VALUE, STROKE_DASHARRAY } from 'src/constant/svg/constant';
import {
    NUMBER_OF_SELECTION_ELLIPSE, ResizeState, SELECTION_DASHARRAY,
    SELECTION_ELLIPSE_BOTTOM_INDEX, SELECTION_ELLIPSE_BOTTOM_LEFT_INDEX, SELECTION_ELLIPSE_BOTTOM_RIGHT_INDEX,
    SELECTION_ELLIPSE_LEFT_INDEX, SELECTION_ELLIPSE_RADIUS, SELECTION_ELLIPSE_RIGHT_INDEX,
    SELECTION_ELLIPSE_TOP_INDEX, SELECTION_ELLIPSE_TOP_LEFT_INDEX, SELECTION_ELLIPSE_TOP_RIGHT_INDEX,
} from 'src/constant/tool-service/constant';
import { FIRST_CHILD } from 'src/constant/toolbar/constant';
import { FULL } from 'src/constant/toolbar/shape/constant';
import { KeyModifier } from 'src/interface/key-modifier';
import { Point } from 'src/interface/Point';
import { Ellipse } from 'src/interface/shape/ellipse';
import { Rectangle } from 'src/interface/shape/rectangle';
import { EllipseService } from '../../shape/ellipse/ellipse.service';
import { RectangleService } from '../../shape/rectangle/rectangle.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionDrawerService {

  private drawingService: DrawingService;
    private selectionCircles: Ellipse[];

    constructor(private rectangleService: RectangleService, private ellipseService: EllipseService) {
        this.drawingService = DrawingService.getInstance();
        this.selectionCircles = [];
    }

    generateSelection(): ElementRef {
        return this.rectangleService.generateRectangleElement();
    }

    createSelection(elementRef: ElementRef, originPoint: Point): Rectangle {
        this.createSelectionCircles();
        return {
            ref: elementRef,
            value: {
              origin: originPoint,
              height: ZERO,
              width: ZERO,
            },
            option: { traceType: FULL_WITH_CONTOUR, contourThickness: TWO },
            color: {
              fill: SELECTION_RECT_FILL_COLOR,
              contour: SELECTION_RECT_CONT_COLOR,
            },
            key: {
              shift: false,
            },
          };
    }

    generateSelectionCircle(): ElementRef {
        return this.ellipseService.generateEllipseElement();
    }

    createSelectionCircles(): void {
        for (let i = ZERO; i < NUMBER_OF_SELECTION_ELLIPSE; i++) {
            this.selectionCircles.push({
                ref: this.generateSelectionCircle(),
                param: {
                  origin: {
                    x: DEFAULT_VALUE,
                    y: DEFAULT_VALUE,
                  },
                  horizontalRadius: SELECTION_ELLIPSE_RADIUS,
                  verticalRadius: SELECTION_ELLIPSE_RADIUS,
                  horizontalCenter: DEFAULT_VALUE,
                  verticalCenter: DEFAULT_VALUE,
                },
                option: {
                    traceType: FULL,
                    contourThickness: 0,
                },
                color: {
                  fill: SELECTION_RECT_CONT_COLOR,
                },
                key: {
                  shift: false,
                },
            } as Ellipse);
        }
    }

    addSelectionOption(selection: Rectangle): void {
        this.rectangleService.addRectangleOption(selection);
        this.drawingService.setSVGattribute(selection.ref.children[FIRST_CHILD], STROKE_DASHARRAY, SELECTION_DASHARRAY);
        for ( const ellipse of this.selectionCircles ) {
            this.ellipseService.addEllipseOption(ellipse);
        }
    }

    updateValues(selectRectangle: Rectangle, event: MouseEvent, keyModifier: KeyModifier): void {
        const relativePoint = this.drawingService.getRelativeCoordinates({x: event.x, y: event.y});
        this.rectangleService.updateValues(selectRectangle.value, relativePoint, keyModifier);
        this.updateAllSelectionCircles(selectRectangle);
    }

    updateAllSelectionCircles(selectRectangle: Rectangle): void {
        this.updateBottomCircles(selectRectangle);
        this.updateBottomLeftCircles(selectRectangle);
        this.updateBottomRightCircles(selectRectangle);
        this.updateLeftCircles(selectRectangle);
        this.updateRightCircles(selectRectangle);
        this.updateTopCircles(selectRectangle);
        this.updateTopLeftCircles(selectRectangle);
        this.updateTopRightCircles(selectRectangle);
        // this.updateRotationCircles(selectRectangle);
    }

    updateTopLeftCircles(selectRectangle: Rectangle): void {
        this.selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.horizontalCenter = selectRectangle.value.origin.x;
        this.selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].param.verticalCenter = selectRectangle.value.origin.y;
    }

    updateTopCircles(selectRectangle: Rectangle): void {
        const xCenter = selectRectangle.value.origin.x + selectRectangle.value.width / TWO;
        this.selectionCircles[SELECTION_ELLIPSE_TOP_INDEX].param.horizontalCenter = xCenter;
        this.selectionCircles[SELECTION_ELLIPSE_TOP_INDEX].param.verticalCenter = selectRectangle.value.origin.y;
    }

    updateTopRightCircles(selectRectangle: Rectangle): void {
        const xCenter = selectRectangle.value.origin.x + selectRectangle.value.width;
        this.selectionCircles[SELECTION_ELLIPSE_TOP_RIGHT_INDEX].param.horizontalCenter = xCenter;
        this.selectionCircles[SELECTION_ELLIPSE_TOP_RIGHT_INDEX].param.verticalCenter = selectRectangle.value.origin.y;
    }

    updateRightCircles(selectRectangle: Rectangle): void {
        const xCenter = selectRectangle.value.origin.x + selectRectangle.value.width;
        const yCenter = selectRectangle.value.origin.y + selectRectangle.value.height / TWO;
        this.selectionCircles[SELECTION_ELLIPSE_RIGHT_INDEX].param.horizontalCenter = xCenter;
        this.selectionCircles[SELECTION_ELLIPSE_RIGHT_INDEX].param.verticalCenter = yCenter;
    }

    updateBottomRightCircles(selectRectangle: Rectangle): void {
        const xCenter = selectRectangle.value.origin.x + selectRectangle.value.width;
        const yCenter = selectRectangle.value.origin.y + selectRectangle.value.height;
        this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_RIGHT_INDEX].param.horizontalCenter = xCenter;
        this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_RIGHT_INDEX].param.verticalCenter = yCenter;
    }

    updateBottomCircles(selectRectangle: Rectangle): void {
        const xCenter = selectRectangle.value.origin.x + selectRectangle.value.width / TWO;
        const yCenter = selectRectangle.value.origin.y + selectRectangle.value.height;
        this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_INDEX].param.horizontalCenter = xCenter;
        this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_INDEX].param.verticalCenter = yCenter;
    }

    updateBottomLeftCircles(selectRectangle: Rectangle): void {
        const yCenter = selectRectangle.value.origin.y + selectRectangle.value.height;
        this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_LEFT_INDEX].param.horizontalCenter = selectRectangle.value.origin.x;
        this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_LEFT_INDEX].param.verticalCenter = yCenter;
    }

    updateLeftCircles(selectRectangle: Rectangle): void {
        const yCenter = selectRectangle.value.origin.y + selectRectangle.value.height / TWO;
        this.selectionCircles[SELECTION_ELLIPSE_LEFT_INDEX].param.horizontalCenter = selectRectangle.value.origin.x;
        this.selectionCircles[SELECTION_ELLIPSE_LEFT_INDEX].param.verticalCenter = yCenter;
    }

    editSelection(selectRectangle: Rectangle): void {
        this.rectangleService.editRectangle(selectRectangle);
        for ( const ellipse of this.selectionCircles ) {
            this.ellipseService.editEllipse(ellipse);
        }
    }

    getCoordinate(point: Point): Point {
        return this.drawingService.getRelativeCoordinates({x: point.x, y: point.y});
    }

    removeRefFromDrawing(ref: ElementRef): void {
        this.drawingService.removeSVGElementFromRef(ref);
    }

    removeCircles(): void {
        for ( const ellipse of this.selectionCircles ) {
            this.removeRefFromDrawing(ellipse.ref);
        }
        this.selectionCircles = [];
    }

    isTargetSelectionCircles(event: MouseEvent): boolean {
        for ( const ellipse of this.selectionCircles ) {
            if ( event.target === ellipse.ref.children[FIRST_CHILD] ) {
                return true;
            }
        }
        return false;
    }

    getResizeState(event: MouseEvent): ResizeState {
        if ( event.target === this.selectionCircles[SELECTION_ELLIPSE_TOP_INDEX].ref.children[FIRST_CHILD] ) {
            return ResizeState.top;
        } else if ( event.target === this.selectionCircles[SELECTION_ELLIPSE_TOP_RIGHT_INDEX].ref.children[FIRST_CHILD] ) {
            return ResizeState.topRight;
        } else if ( event.target === this.selectionCircles[SELECTION_ELLIPSE_RIGHT_INDEX].ref.children[FIRST_CHILD] ) {
            return ResizeState.right;
        } else if ( event.target === this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_RIGHT_INDEX].ref.children[FIRST_CHILD] ) {
            return ResizeState.bottomRight;
        } else if ( event.target === this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_INDEX].ref.children[FIRST_CHILD] ) {
            return ResizeState.bottom;
        } else if ( event.target === this.selectionCircles[SELECTION_ELLIPSE_BOTTOM_LEFT_INDEX].ref.children[FIRST_CHILD] ) {
            return ResizeState.bottomLeft;
        } else if ( event.target === this.selectionCircles[SELECTION_ELLIPSE_LEFT_INDEX].ref.children[FIRST_CHILD] ) {
            return ResizeState.left;
        } else if ( event.target === this.selectionCircles[SELECTION_ELLIPSE_TOP_LEFT_INDEX].ref.children[FIRST_CHILD] ) {
            return ResizeState.topLeft;
        }
        return ResizeState.none;
    }
}
