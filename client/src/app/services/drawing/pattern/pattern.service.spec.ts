import { TestBed } from '@angular/core/testing';

import { Renderer2, RendererFactory2 } from '@angular/core';
import { PatternService } from './pattern.service';

describe('PatternService', () => {

  let service: PatternService;
  let renderer: Renderer2;
  let rendererFactory: RendererFactory2;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    rendererFactory = TestBed.get(RendererFactory2);
    renderer = rendererFactory.createRenderer(null, null);
    service = new PatternService(renderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call five different filterGenerators and return the result', () => {
    const blurSpy: jasmine.Spy = spyOn(service, 'generateBlur').and.callThrough();
    const sketchSpy: jasmine.Spy = spyOn(service, 'generateSketch').and.callThrough();
    const aerosolSpy: jasmine.Spy = spyOn(service, 'generateAerosol').and.callThrough();
    const magicSpy: jasmine.Spy = spyOn(service, 'generateMagic').and.callThrough();
    const shadowSpy: jasmine.Spy = spyOn(service, 'generateFilament').and.callThrough();
    const filterSpy: jasmine.Spy = spyOn(service, 'generateFilter').and.callThrough();

    const patterns = service.generatePatterns();
    expect(patterns).toBeTruthy();

    expect(blurSpy).toHaveBeenCalled();
    expect(sketchSpy).toHaveBeenCalled();
    expect(aerosolSpy).toHaveBeenCalled();
    expect(magicSpy).toHaveBeenCalled();
    expect(shadowSpy).toHaveBeenCalled();
    expect(filterSpy).toHaveBeenCalledTimes(6);
  });

  it('should return the result filterGenerators sre called', () => {
    expect(service.generateAerosol()).toBeTruthy();
    expect(service.generateBlur()).toBeTruthy();
    expect(service.generateFilter('FILLER_ID')).toBeTruthy();
    expect(service.generateMagic()).toBeTruthy();
    expect(service.generateFilament()).toBeTruthy();
    expect(service.generateSketch()).toBeTruthy();
  });
});
