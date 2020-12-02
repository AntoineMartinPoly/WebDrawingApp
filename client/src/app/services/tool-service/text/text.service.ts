import {ElementRef, Injectable} from '@angular/core';
import { DECIMAL, NO_VALUE, ZERO } from 'src/constant/constant';
import { TEXT_FONT_SIZE, TEXT_FONT_STYLE } from 'src/constant/storage/constant';
import { BOLD, DATA_TYPE, DEFAULT_VALUE, DX, FONT_FAMILY, FONT_SIZE, FONT_STYLE, FONT_WEIGHT, GROUP, HEIGHT, ID,
  ITALIC, MY_TEXT, RECT, RECTANGLE_STYLE, STYLE, TEXT, TEXT_ANCHOR, TSPAN,
  WIDTH, X, Y } from 'src/constant/svg/constant';
import { ONE } from 'src/constant/toolbar/shape/constant';
import { DEFAULT_FONT_SIZE, dxFactor, START } from 'src/constant/toolbar/text/constant';
import { RectangleValues } from 'src/interface/shape/rectangle';
import {Point} from '../../../../interface/Point';
import {Text} from '../../../../interface/text/text';
import { DrawingElementManagerService } from '../../drawing-element-manager/drawing-element-manager.service';
import {DrawingService} from '../../drawing/drawing.service';
import {StorageService} from '../../storage/storage.service';
import {DataTextService} from './dataShare/data-text.service';

@Injectable({
  providedIn: 'root',
})
export class TextService {

  editableText: string;
  textLines: any[];
  currentLine: any;
  fontSize: number;
  text: Text;
  textBox: ElementRef;
  numberOfline: number;
  width: number;
  gText: ElementRef;
  anchor: string;
  drawingService: DrawingService;

  constructor(private dataText: DataTextService, public storageService: StorageService,
              public drawingElementManager: DrawingElementManagerService) {
    this.editableText = NO_VALUE;
    this.textLines = [];
    this.fontSize = DEFAULT_FONT_SIZE;
    this.numberOfline = ONE;
    this.width = DEFAULT_VALUE;
    this.drawingService = DrawingService.getInstance();
  }

  getTextBoundingBox(): RectangleValues {
    const BBox = this.text.ref.getBoundingClientRect();
    const relativeOrigin = this.drawingService.getRelativeCoordinates({x: BBox.x, y: BBox.y});
    return {width: BBox.width, height: BBox.height, origin: relativeOrigin};
  }

  generateTextElement() {
    this.fontSize = DEFAULT_FONT_SIZE;
    this.textLines = [];
    this.gText = this.drawingService.generateSVGElement(GROUP);
    this.drawingService.setSVGattribute(this.gText, DATA_TYPE, TEXT);
    this.textBox = this.drawingService.generateSVGElement(RECT);
    const text = this.drawingService.generateSVGElement(TEXT);
    const firstLine =  this.drawingService.generateSVGElement(TSPAN);
    this.drawingService.addSVGElementFromRef(this.gText);
    this.drawingService.addSVGToSVG(this.textBox, this.gText);
    this.drawingService.addSVGToSVG(text, this.gText);
    this.drawingService.addSVGToSVG(firstLine, text);
    this.textLines.push(firstLine);
    this.currentLine = firstLine;
    return text;
  }

  createTextFromSVGElement(svgElement: ElementRef): Text {
    return {
      ref: svgElement,
      originPoint: {
        x: parseInt(this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], X), DECIMAL),
        y: parseInt(this.drawingService.getSVGElementAttributes((svgElement as any).children[DEFAULT_VALUE], Y), DECIMAL),
      },
      policySize: DEFAULT_VALUE,
    };
  }

  createText(textRef: ElementRef, textOrigin: Point): Text {
    const originPoint: Point = this.drawingService.getRelativeCoordinates(textOrigin);
    return {
      ref: textRef,
      originPoint,
      policySize: this.fontSize,
    };
  }

  generateNewLineText(groupRef: ElementRef) {
    this.editableText = NO_VALUE;
    const textLine = this.drawingService.generateSVGElement(TSPAN);
    this.drawingService.setSVGattribute(textLine, X, this.text.originPoint.x.toString() );
    this.currentLine = textLine;
    this.textLines.push(textLine);
    this.drawingService.addSVGToSVG(textLine, groupRef);
    return textLine;
  }

  editText(text: Text) {
    this.editableText = NO_VALUE;
    this.numberOfline = ONE;
    this.fontSize =  +this.storageService.get(TEXT_FONT_SIZE);
    this.drawingService.setSVGattribute(text.ref, ID, MY_TEXT);
    this.drawingService.setSVGattribute(text.ref, X, (text.originPoint.x).toString());
    this.drawingService.setSVGattribute(text.ref, Y, (text.originPoint.y).toString());
    this.drawingService.setSVGattribute(text.ref, FONT_FAMILY, this.storageService.get(TEXT_FONT_STYLE));
    this.drawingService.setSVGattribute(text.ref, FONT_SIZE, this.storageService.get(TEXT_FONT_SIZE));
    this.drawingService.setSVGattribute(this.textBox, X, (text.originPoint.x).toString());
    this.drawingService.setSVGattribute(this.textBox, Y, (text.originPoint.y - this.fontSize).toString());
    this.drawingService.setSVGattribute(this.textBox, STYLE, RECTANGLE_STYLE);
    this.updateFontSize(text);
    this.updateItalic();
    this.updateBold();
    this.updateFontFamily();
    this.updateAnchor();
    this.text = text;
  }

  typeText(char: string) {
    if (this.currentLine !== undefined) {
      this.editableText = this.editableText + char;
      this.currentLine.textContent = this.editableText;
      this.dataText.sendAnchor(this.anchor);
    }
  }

  updateTextBox() {
    const BBox = this.getTextBoundingBox();
    this.drawingService.setSVGattribute(this.textBox, WIDTH, BBox.width.toString());
    this.drawingService.setSVGattribute(this.textBox, HEIGHT, BBox.height.toString());
    this.drawingService.setSVGattribute(this.textBox, X, BBox.origin.x.toString());
    this.drawingService.setSVGattribute(this.textBox, Y, BBox.origin.y.toString());
  }

  deleteText() {
    if (this.textLines.length > ZERO && this.editableText.length > ZERO) {
      this.editableText = this.editableText.substring(ZERO, this.editableText.length - ONE);
      this.textLines[this.textLines.length - 1].textContent = this.editableText;
    }
    if (this.editableText.length === ZERO && this.textLines.length > ZERO) {
      this.drawingService.removeSVGElementFromRef(this.textLines[this.textLines.length - ONE]);
      this.textLines.pop();
      this.numberOfline--;
      this.currentLine = this.textLines[this.textLines.length - ONE];
      this.editableText = this.textLines[this.textLines.length - ONE].textContent;
    }
    if (this.textLines.length === ZERO) {
      this.drawingService.removeSVGElementFromRef(this.gText);
    }
  }

  updateFontSize(text: Text) {
    this.dataText.getPolicySize().subscribe((policy) => {
      this.fontSize = policy;
      text.policySize = policy;
      this.drawingService.setSVGattribute(this.text.ref, FONT_SIZE, text.policySize.toString());
      this.updateLine();
      this.updateTextBox();
    });

  }

  updateLine() {
    let i = ZERO;
    for (const txt of this.textLines) {
      this.drawingService.setSVGattribute(txt, Y, (this.text.originPoint.y + this.fontSize * i).toString());
      i++;
    }
    this.updateTextBox();
  }

  updateItalic() {
    this.dataText.getItalic().subscribe((isItalic) => {
      isItalic ? this.drawingService.setSVGattribute(this.text.ref, FONT_STYLE, ITALIC) :
        this.drawingService.setSVGattribute(this.text.ref, FONT_STYLE, NO_VALUE);
      this.updateTextBox();
    });
  }

  updateBold() {
    this.dataText.getBold().subscribe((isBold) => {
      isBold ? this.drawingService.setSVGattribute(this.text.ref, FONT_WEIGHT, BOLD) :
        this.drawingService.setSVGattribute(this.text.ref, FONT_WEIGHT, NO_VALUE);
      this.updateTextBox();
    });
  }

  updateFontFamily() {
    this.dataText.getPolicy().subscribe((option) => {
      this.drawingService.setSVGattribute(this.text.ref, FONT_FAMILY, option);
      this.updateTextBox();
    });
  }

  updateAnchor() {
    this.dataText.getAnchor().subscribe((option) => {
      this.anchor = option;
      this.drawingService.setSVGattribute(this.text.ref, TEXT_ANCHOR, option);
      for (const txt of this.textLines) {
        this.drawingService.setSVGattribute(txt, DX,
          (option === START ? ZERO :
          this.fontSize * this.width / dxFactor[option as keyof typeof dxFactor]).toString());
      }
      this.updateTextBox();
    });
  }

  removeTextBox(textBoxRef: ElementRef) {
    this.drawingService.removeSVGElementFromRef(textBoxRef);
  }

  removeElement(text: Text) {
    this.drawingService.removeSVGElementFromRef(text.ref);
    this.drawingElementManager.removeDrawingElement(text);
  }

  reAddElement(text: Text) {
    this.drawingService.addSVGElementFromRef(text.ref);
    this.drawingElementManager.appendDrawingElement(text);
  }
}
