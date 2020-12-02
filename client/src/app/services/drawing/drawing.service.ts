import { ElementRef, Injectable, Renderer2, } from '@angular/core';
import { DRAWING_HEIGHT, DRAWING_WIDTH, SESSION_STORAGE } from 'src/constant/storage/constant';
import {
  CANVAS, DATA_CONFIRMATION, DATA_TYPE, FILL, GROUP, HEIGHT, IMG, PIXEL, RECT, SVG, TRUE, WIDTH, ZERO,
} from 'src/constant/svg/constant';
import { WHITE } from 'src/constant/toolbar/constant';
// import { HIDDEN } from 'src/constant/toolbar/grid/constant';
import { Point } from 'src/interface/Point';
import { StorageService } from '../storage/storage.service';
import { PatternService } from './pattern/pattern.service';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  // SINGLETON PATTERN -> MUST GET INSTANCE INSTEAD OF INSTANCIATING
  // let d = DrawingService.getInstace()

  private static instance: DrawingService;
  static container: ElementRef;

  patternGenerator: PatternService;
  renderer: Renderer2;
  svg: any;
  backgroundList: any[] = [];
  storage: StorageService;

  static getInstance() {
    if (!DrawingService.instance) {
      DrawingService.instance = new DrawingService();
    }
    return DrawingService.instance;
  }

  static init(renderer: Renderer2, container: ElementRef) {
    DrawingService.container = container;
    if (DrawingService.instance) {
      DrawingService.getInstance();
    }
    DrawingService.instance.renderer = renderer;
    DrawingService.instance.patternGenerator = new PatternService(renderer);
    DrawingService.instance.storage = new StorageService();

  }

  generateBackground() {
    this.svg = this.renderer.createElement(SVG, SVG);
    this.renderer.setAttribute(this.svg, DATA_CONFIRMATION, TRUE);
    this.svg = this.setSVG(
      this.storage.get(DRAWING_HEIGHT, SESSION_STORAGE),
      this.storage.get(DRAWING_WIDTH, SESSION_STORAGE),
    );
    this.renderer.appendChild(DrawingService.container.nativeElement, this.svg);

    return this.svg;
  }

  setSVG(height: string, width: string, backgroundColor: string = WHITE): any {
    this.renderer.setAttribute(this.svg, HEIGHT, height + PIXEL);
    this.renderer.setAttribute(this.svg, WIDTH, width + PIXEL);
    const background = this.renderer.createElement(RECT, SVG);
    this.renderer.setAttribute(background, FILL, backgroundColor);
    this.renderer.setAttribute(background, HEIGHT, height + PIXEL);
    this.renderer.setAttribute(background, WIDTH, width + PIXEL);
    this.renderer.appendChild(this.svg, background);

    this.renderer.appendChild(this.svg, this.patternGenerator.generatePatterns());
    this.backgroundList.push(background);

    return this.svg;
  }

  setNewDrawing(html: string): void {
    const element = this.renderer.createElement(GROUP, SVG);
    element.innerHTML = html;
    this.svg.innerHTML = element.getElementsByTagName(SVG)[ZERO].innerHTML;
  }

  setNewDrawingSize(): void {
    const height: number =
    parseInt((this.svg.getElementsByTagName(RECT)[ZERO].attributes.getNamedItem(HEIGHT) as Attr).value, 10);
    const width: number =
    parseInt((this.svg.getElementsByTagName(RECT)[ZERO].attributes.getNamedItem(WIDTH) as Attr).value, 10);
    this.renderer.setAttribute(this.svg, HEIGHT, height + PIXEL);
    this.renderer.setAttribute(this.svg, WIDTH, width + PIXEL);
  }

  getSVGElementAttributes(elementRef: ElementRef, attribute: string, value: boolean = true): string | any {
    return value ? (elementRef as any).attributes.getNamedItem(attribute).value :
    (elementRef as any).attributes.getNamedItem(attribute);
  }

  getElements(elementType: string, elementFrom: any = this.svg): any {
    return elementFrom.getElementsByTagName(elementType);
  }
  getElementsTable(elementType: string) {
    const  elementTable: any[] = [];
    for (const element of this.svg.getElementsByTagName(GROUP)) {
      if (element.attributes.getNamedItem(DATA_TYPE).value === elementType) {
        elementTable.push(element);
      }
    }

    return elementTable;
  }
  removeOldBackground() {
    for (const background of this.backgroundList) {
      this.renderer.removeChild(this.svg, background);
    }
    this.backgroundList = [];
  }
  removeSVGElementFromRef(element: ElementRef) {
    this.renderer.removeChild(this.svg, element);
  }
  addSVGElementFromRef(element: ElementRef) {
    this.renderer.appendChild(this.svg, element);
  }
  insertBeforeSVGElement(elementBefore: ElementRef, element: ElementRef) {
    this.renderer.insertBefore(this.svg, elementBefore, element);
  }
  insertSVGBeforeSVG(parent: ElementRef, elementBefore: ElementRef, element: ElementRef) {
    this.renderer.insertBefore(parent, elementBefore, element);
  }
  generateSVGElement(name: string) {
    return this.renderer.createElement(name, SVG);
  }
  generateCanvas() {
    const canvas = this.renderer.createElement(CANVAS);
    this.renderer.appendChild(this.svg.parentNode, canvas);
    this.renderer.setAttribute(canvas, WIDTH, this.storage.get(DRAWING_WIDTH, true));
    this.renderer.setAttribute(canvas, HEIGHT, this.storage.get(DRAWING_HEIGHT, true));
    // this.renderer.setAttribute(canvas, HIDDEN, TRUE);
    return canvas;
  }
  generateImg() {
    const xml = new XMLSerializer().serializeToString(this.svg);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;
    const img = this.renderer.createElement(IMG);
    this.renderer.appendChild(this.svg.parentNode, img);
    img.src = image64;
    // this.renderer.setAttribute(img, HIDDEN, TRUE);
    return img;
  }
  cleanAfterFill(canvas: ElementRef, img: ElementRef) {
    this.renderer.removeChild(this.svg, canvas);
    this.renderer.removeChild(this.svg, img);
  }
  addSVGToSVG(SVGToAdd: ElementRef, inSVG: ElementRef) {
     this.renderer.appendChild(inSVG, SVGToAdd);
  }
  getRelativeCoordinates(absoluteCoordinates: Point): Point {
    const point = this.svg.createSVGPoint();
    point.x = absoluteCoordinates.x;
    point.y = absoluteCoordinates.y;
    const svgPoint = point.matrixTransform(this.svg.getScreenCTM().inverse());
    return {x: svgPoint.x, y: svgPoint.y};
  }

  setSVGattribute(elementRef: ElementRef, attribute: string, value: string) {
    this.renderer.setAttribute(elementRef, attribute, value);
  }

  setSVGStyle(elementRef: ElementRef, style: string, value: string) {
    this.renderer.setStyle(elementRef, style, value);
  }

  isEventTargetBackgroundElement(event: MouseEvent) {
    return event.target === this.svg.children[ZERO];
  }

  getParentSVG(elementRef: ElementRef): ElementRef {
    return this.renderer.parentNode(elementRef);
  }

  getSVGBoundingBox(): DOMRect {
    return this.svg.getBoundingClientRect();
  }

  getAttributeValueFromSVG(elementRef: any, specifiedAttribute: string): string {
    for (const attribute of elementRef.attributes) {
      if (attribute.name === specifiedAttribute) {return attribute.value; }
    }
    return '';
  }
}
