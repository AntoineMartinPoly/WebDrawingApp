import { TestBed } from '@angular/core/testing';
import { FAKE_RECTANGLE_VALUE } from 'src/constant/shape/constant';
import {MockElementRef} from '../../../../constant/constant';
import {FAKE_TEXT, Text} from '../../../../interface/text/text';
import {DrawingService} from '../../drawing/drawing.service';
import {DataTextService} from './dataShare/data-text.service';
import { TextService } from './text.service';

describe('TextService', () => {
  let service: TextService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(TextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTextBoundingBox should call getRelativeCoordinates', () => {
    service.text = FAKE_TEXT;
    service.text.ref = new MockElementRef();
    const getRelativeSpy: jasmine.Spy = spyOn(DrawingService.getInstance(), 'getRelativeCoordinates');
    service.getTextBoundingBox();
    expect(getRelativeSpy).toHaveBeenCalled();
  });

  it('generateTextElement should call generateSVGElement / addSVGElementFromRef / addSvgToSVG / setSVGattribute', () => {
    const drawingService = DrawingService.getInstance();
    const genSpy = spyOn(drawingService, 'generateSVGElement').and.returnValue(new MockElementRef());
    const addSpy = spyOn(drawingService, 'addSVGElementFromRef');
    const addSVGSpy = spyOn(drawingService, 'addSVGToSVG');
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const textRef = service.generateTextElement();
    expect(textRef).toEqual(new MockElementRef());
    expect(addSpy).toHaveBeenCalled();
    expect(genSpy).toHaveBeenCalledTimes(4);
    expect(addSVGSpy).toHaveBeenCalledTimes(3);
    expect(setSpy).toHaveBeenCalled();
  });

  it('createTextFromSVGElement should call getSVGElementAttributes', () => {
    const drawingService = DrawingService.getInstance();
    const fakeTextElement = new MockElementRef();
    (fakeTextElement as any).children = [''];
    const fakeText = {
      ref: new MockElementRef(),
      originPoint: {
        x: 0,
        y: 0,
      },
      policySize: 0,
    };
    const getSVGSpy: jasmine.Spy = spyOn(drawingService, 'getSVGElementAttributes');
    getSVGSpy.withArgs('', 'x').and.returnValue(0);
    getSVGSpy.withArgs('', 'y').and.returnValue(0);
    const text = service.createTextFromSVGElement(fakeTextElement);
    expect(text.originPoint).toEqual(fakeText.originPoint);
    expect(text.policySize).toEqual(fakeText.policySize);
    expect(getSVGSpy).toHaveBeenCalledTimes(2);
  });

  it('createText should getRelativeCoordinates and return text', () => {
    const drawingService = DrawingService.getInstance();
    const genSpy = spyOn(drawingService, 'getRelativeCoordinates').and.returnValue(FAKE_TEXT.originPoint);
    const mockMouseEvent = {} as MouseEvent;
    const fakeText = service.createText(new MockElementRef(), mockMouseEvent );
    expect(genSpy).toHaveBeenCalled();
    expect(fakeText.originPoint).toEqual(FAKE_TEXT.originPoint);
  });

  it('generateNewLineText should call generateSVGElement and return textLine', () => {
     const drawingService = DrawingService.getInstance();
     const genSpy = spyOn(drawingService, 'generateSVGElement');
     const setSpy = spyOn(drawingService, 'setSVGattribute');
     spyOn(drawingService, 'addSVGToSVG');
     service.text = FAKE_TEXT;
     const fakeLine = service.generateNewLineText(new MockElementRef());
     expect(genSpy).toHaveBeenCalled();
     expect(service.editableText).toEqual('');
     expect(service.textLines).toContain(fakeLine);
     expect(setSpy).toHaveBeenCalled();
  });

  it('editText should call setSVGAttributes', () => {
    const setSpy = spyOn(DrawingService.getInstance(), 'setSVGattribute');
    const fontSizeSpy = spyOn(service, 'updateFontSize');
    const boldSpy = spyOn(service, 'updateBold');
    const italicSpy = spyOn(service, 'updateItalic');
    const fontSpy = spyOn(service, 'updateFontFamily');
    const anchorSpy = spyOn(service, 'updateAnchor');
    service.editText(FAKE_TEXT);
    expect(setSpy).toHaveBeenCalled();
    expect(fontSizeSpy).toHaveBeenCalled();
    expect(boldSpy).toHaveBeenCalled();
    expect(italicSpy).toHaveBeenCalled();
    expect(fontSpy).toHaveBeenCalled();
    expect(anchorSpy).toHaveBeenCalled();
  });

  it('typeText edit text content', () => {
    service.editableText = 'a';
    service.currentLine = FAKE_TEXT;
    service.typeText('b');
    expect(service.editableText).toEqual('ab');
  });

  it('deleteText should delete char from  text content', () => {
    service.editableText = 'a';
    service.currentLine = FAKE_TEXT;
    service.textLines[service.textLines.length - 1] = FAKE_TEXT;
    const drawingService = DrawingService.getInstance();
    const removeSpy = spyOn(drawingService, 'removeSVGElementFromRef');
    service.textLines.push(FAKE_TEXT);
    service.deleteText();
    expect(service.editableText).toEqual('');
    expect(removeSpy).toHaveBeenCalled();
  });

  it('updatePolicySize should get policy size and apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updtSpy = spyOn(service, 'updateTextBox');
    service.editText(FAKE_TEXT);
    service.updateFontSize(FAKE_TEXT);
    dataService.sendPolicySize(17);
    expect(FAKE_TEXT.policySize).toEqual(17);
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updateItalic should get isItalic true  apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    service.editText(FAKE_TEXT);
    const updtSpy = spyOn(service, 'updateTextBox');
    service.updateItalic();
    dataService.sendItalic(true);
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updateItalic should get isItalic false  apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updtSpy = spyOn(service, 'updateTextBox');
    service.editText(FAKE_TEXT);
    service.updateItalic();
    dataService.sendItalic(false);
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updateBold should get isBold boolean  apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updtSpy = spyOn(service, 'updateTextBox');
    service.editText(FAKE_TEXT);
    service.updateBold();
    dataService.sendBold(false);
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updateBold should get isBold boolean  apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updtSpy = spyOn(service, 'updateTextBox');
    service.editText(FAKE_TEXT);
    service.updateBold();
    dataService.sendBold(true);
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updatePolicy should get policy option then apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updtSpy = spyOn(service, 'updateTextBox');
    service.editText(FAKE_TEXT);
    service.updateFontFamily();
    dataService.sendPolicy('Normal');
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updateAnchor should get anchor option then apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updtSpy = spyOn(service, 'updateTextBox');
    service.textLines.push(FAKE_TEXT);
    service.editText(FAKE_TEXT);
    service.updateAnchor();
    dataService.sendAnchor('middle');
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updateAnchor should get anchor option then apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updtSpy = spyOn(service, 'updateTextBox');
    service.textLines.push(FAKE_TEXT);
    service.editText(FAKE_TEXT);
    service.updateAnchor();
    dataService.sendAnchor('start');
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updateAnchor should get anchor option then apply it to text', () => {
    const dataService: DataTextService = TestBed.get(DataTextService);
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updtSpy = spyOn(service, 'updateTextBox');
    service.textLines.push(FAKE_TEXT);
    service.editText(FAKE_TEXT);
    service.updateAnchor();
    dataService.sendAnchor('end');
    expect(setSpy).toHaveBeenCalled();
    expect(updtSpy).toHaveBeenCalled();
  });

  it('updateLine should call setSVGattribute textLines`s length times', () => {
    const drawingService = DrawingService.getInstance();
    service.textLines.push(FAKE_TEXT);
    service.text = FAKE_TEXT;
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const updateSpy = spyOn(service, 'updateTextBox');
    service.updateLine();
    expect(setSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
  });

  it('updateTextBox should call setSVGAttributes and getTextBoundingBox', () => {
    const drawingService = DrawingService.getInstance();
    const setSpy = spyOn(drawingService, 'setSVGattribute');
    const getSpy = spyOn(service, 'getTextBoundingBox').and.returnValue(FAKE_RECTANGLE_VALUE);
    service.updateTextBox();
    expect(setSpy).toHaveBeenCalledTimes(4);
    expect(getSpy).toHaveBeenCalled();
  });

  it('removeTextBox should call removeSVGElementFromRef', () => {
    const drawingService = DrawingService.getInstance();
    const removeSpy = spyOn(drawingService, 'removeSVGElementFromRef');
    const fakeTextElement = new MockElementRef();
    service.removeTextBox(fakeTextElement);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('removeElement should call removeSVGElementFromRef', () => {
    const removeSpy = spyOn(DrawingService.getInstance(), 'removeSVGElementFromRef');
    const fakeText: Text = FAKE_TEXT;
    service.removeElement(fakeText);
    expect(removeSpy).toHaveBeenCalled();
  });

  it('reAddElement should call addSVGElementFromRef and appendObject', () => {
    const addSpy = spyOn(DrawingService.getInstance(), 'addSVGElementFromRef');
    const appendSpy = spyOn(service.drawingElementManager, 'appendDrawingElement');
    const fakeText: Text = FAKE_TEXT;
    service.reAddElement(fakeText);
    expect(addSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });
});
