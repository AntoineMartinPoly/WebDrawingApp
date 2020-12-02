import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockElementRef } from 'src/constant/constant';
import { SVG } from 'src/constant/svg/constant';
import {FAKE_LENGTH} from 'src/constant/toolbar/constant';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {

  let renderer: Renderer2;
  let rendererFactory: RendererFactory2;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ElementRef, useClass: MockElementRef },
    ],
  }));
  beforeEach(() => {
    rendererFactory = TestBed.get(RendererFactory2);
    renderer = rendererFactory.createRenderer(null, null);
  });

  it('should be created if does not exist', () => {
    expect(DrawingService.getInstance()).toBeTruthy();
  });

  it('generateSVG should generate basic SVG by calling create element, setAttributes and appendChild once', () => {
    const service: DrawingService = DrawingService.getInstance();
    DrawingService.init(renderer, new MockElementRef());
    const rendererSpyCreate: jasmine.Spy = spyOn(renderer, 'createElement');
    const rendererSpySet: jasmine.Spy = spyOn(renderer, 'setAttribute');
    const rendererSpyRemove: jasmine.Spy = spyOn(renderer, 'removeChild');
    const rendererSpyAppend: jasmine.Spy = spyOn(renderer, 'appendChild');
    const patternSpy: jasmine.Spy = spyOn(service.patternGenerator, 'generatePatterns');
    service.setSVG(FAKE_LENGTH, FAKE_LENGTH);
    service.removeOldBackground();
    expect(rendererSpyCreate).toHaveBeenCalled();
    expect(rendererSpySet).toHaveBeenCalled();
    expect(rendererSpyAppend).toHaveBeenCalled();
    expect(patternSpy).toHaveBeenCalled();
    expect(rendererSpyRemove).toHaveBeenCalled();
  });

  it('remove/append Child should be called when removing/adding svg element', () => {
    const service: DrawingService = DrawingService.getInstance();
    DrawingService.init(renderer, new MockElementRef());
    const elementRef = TestBed.get(ElementRef);
    const removeSpy = spyOn(service.renderer, 'removeChild');
    const appendSpy = spyOn(service.renderer, 'appendChild');

    service.addSVGElementFromRef(elementRef);
    service.removeSVGElementFromRef(elementRef);

    expect(removeSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('isEventTargetBackgroundElement return if event target egale to svg childrem', () => {
    expect(DrawingService.getInstance()).toBeTruthy();
  });

  it(' getSVGBoundingBox', () => {
    const service: DrawingService = DrawingService.getInstance();
    DrawingService.init(renderer, new MockElementRef());
    service.svg = service.renderer.createElement(SVG, SVG);
    const svgSpy = spyOn(service.svg, 'getBoundingClientRect');
    service.getSVGBoundingBox();
    expect(svgSpy).toHaveBeenCalled();
  });
 /* getSVGBoundingBox(): DOMRect {
    return this.svg.getBoundingClientRect();
  }*/
  /*it('generateKeyModifierObject generate a keyModifier', () => {
    const event = new MouseEvent('mousemove');
    const keyModifier = component.generateKeyModifierObject(event);
    expect(keyModifier).toEqual({shift: event.shiftKey,
      leftKey: (event.button ===  LEFT_KEY),
      rightKey: (event.button ===  RIGHT_KEY),
      mouseMove: false,
      doubleClick: false, });
  });*/

});
