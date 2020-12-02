import { Injectable, Renderer2, } from '@angular/core';
import {
  AEROSOL_COLORMATRIX_ATTRIBUTES,
  AEROSOL_COMPOSITEA_ATTRIBUTES,
  AEROSOL_COMPOSITEB_ATTRIBUTES,
  AEROSOL_TURBULENCE_ATTRIBUTES,
  BLUR_ATTRIBUTES,
  FILAMENT_MERGEA_ATTRIBUTES,
  FILAMENT_MERGEB_ATTRIBUTES,
  FILAMENT_MORPHOLOGYA_ATTRIBUTES,
  FILAMENT_MORPHOLOGYB_ATTRIBUTES,
  FILAMENT_MORPHOLOGYC_ATTRIBUTES,
  FILAMENT_NODEA_ATTRIBUTES,
  FILAMENT_NODEB_ATTRIBUTES,
  FILAMENT_NODEC_ATTRIBUTES,
  FILAMENT_NODED_ATTRIBUTES,
  FILAMENT_OFFSETA_ATTRIBUTES,
  FILAMENT_OFFSETB_ATTRIBUTES,
  FILTER_ATTRIBUTES,
  MAGIC_COLORMATRIX_ATTRIBUTES,
  MAGIC_COMPOSITE_A_ATTRIBUTES,
  MAGIC_COMPOSITE_B_ATTRIBUTES,
  MAGIC_TURBULENCE_ATTRIBUTES,
  SKETCH_DISPLACEMENTMAP_ATTRIBUTES,
  SKETCH_TURBULENCE_ATTRIBUTES,
  SPRAY_COLORMATRIX_ATTRIBUTES,
  SPRAY_COMPOSITEA_ATTRIBUTES,
  SPRAY_GAUSS_ATTRIBUTES,
  SPRAY_TURBULENCE_ATTRIBUTES
} from 'src/constant/drawing/pattern/constant';
import {SPRAY_FILTER} from 'src/constant/spray/constant';
import {
  AEROSOL, BLUR, DEFINITION, FE_BLUR, FE_COLOR_MATRIX, FE_COMPOSITE, FE_DISPLACEMENT_MAP, FE_GAUSSIAN_BLUR, FE_MERGE,
  FE_MERGE_NODE, FE_MORPHOLOGY, FE_OFFSET, FE_TURBULENCE, FILAMENT, FILTER,
  ID, MAGIC, SKETCH, SVG
} from 'src/constant/svg/constant';

@Injectable({
  providedIn: 'root',
})
export class PatternService {

  renderer: Renderer2;

  constructor(renderer: Renderer2) {
    this.renderer = renderer;
  }

  generatePatterns() {
    const patternDefinitions = this.renderer.createElement(DEFINITION, SVG);
    this.renderer.appendChild(patternDefinitions, this.generateBlur());
    this.renderer.appendChild(patternDefinitions, this.generateSketch());
    this.renderer.appendChild(patternDefinitions, this.generateAerosol());
    this.renderer.appendChild(patternDefinitions, this.generateSpray());
    this.renderer.appendChild(patternDefinitions, this.generateMagic());
    this.renderer.appendChild(patternDefinitions, this.generateFilament());
    return patternDefinitions;
  }

  generateFilter(id: string) {
    const filter = this.renderer.createElement(FILTER, SVG);
    this.renderer.setAttribute(filter, ID, id);

    FILTER_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(filter, attribute.name, attribute.value);
    });

    return filter;
  }

  generateBlur() {
    const filter = this.generateFilter(BLUR);
    const blur = this.renderer.createElement(FE_BLUR, SVG);

    BLUR_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(blur, attribute.name, attribute.value);
    });

    this.renderer.appendChild(filter, blur);
    return filter;
  }

  generateSketch() {
    const filter = this.generateFilter(SKETCH);
    const turbulence = this.renderer.createElement(FE_TURBULENCE, SVG);
    const displacementMap = this.renderer.createElement(FE_DISPLACEMENT_MAP, SVG);

    SKETCH_TURBULENCE_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(turbulence, attribute.name, attribute.value); });
    SKETCH_DISPLACEMENTMAP_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(displacementMap, attribute.name, attribute.value); });

    this.renderer.appendChild(filter, turbulence);
    this.renderer.appendChild(filter, displacementMap);
    return filter;
  }

  generateAerosol() {
    const filter = this.generateFilter(AEROSOL);

    const feTurbulence = this.renderer.createElement(FE_TURBULENCE, SVG);
    const feColorMatrix = this.renderer.createElement(FE_COLOR_MATRIX, SVG);
    const feCompositeA = this.renderer.createElement(FE_COMPOSITE, SVG);
    const feCompositeB = this.renderer.createElement(FE_COMPOSITE, SVG);

    AEROSOL_TURBULENCE_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feTurbulence, attribute.name, attribute.value); });
    AEROSOL_COLORMATRIX_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feColorMatrix, attribute.name, attribute.value); });
    AEROSOL_COMPOSITEA_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feCompositeA, attribute.name, attribute.value); });
    AEROSOL_COMPOSITEB_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feCompositeB, attribute.name, attribute.value); });

    this.renderer.appendChild(filter, feTurbulence);
    this.renderer.appendChild(filter, feColorMatrix);
    this.renderer.appendChild(filter, feCompositeA);
    this.renderer.appendChild(filter, feCompositeB);

    return filter;
  }

  generateSpray() {
    const filter = this.generateFilter(SPRAY_FILTER);

    const feTurbulence = this.renderer.createElement(FE_TURBULENCE, SVG);
    const feColorMatrix = this.renderer.createElement(FE_COLOR_MATRIX, SVG);
    const feCompositeA = this.renderer.createElement(FE_COMPOSITE, SVG);
    const feGaussianBlur = this.renderer.createElement(FE_GAUSSIAN_BLUR, SVG);

    SPRAY_TURBULENCE_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feTurbulence, attribute.name, attribute.value); });
    SPRAY_COLORMATRIX_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feColorMatrix, attribute.name, attribute.value); });
    SPRAY_COMPOSITEA_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feCompositeA, attribute.name, attribute.value); });
    SPRAY_GAUSS_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feGaussianBlur, attribute.name, attribute.value); });

    this.renderer.appendChild(filter, feTurbulence);
    this.renderer.appendChild(filter, feColorMatrix);
    this.renderer.appendChild(filter, feCompositeA);
    this.renderer.appendChild(filter, feGaussianBlur);

    return filter;
  }

  generateMagic() {
    const filter = this.generateFilter(MAGIC);

    const feTurbulence = this.renderer.createElement(FE_TURBULENCE, SVG);
    const feColorMatrix = this.renderer.createElement(FE_COLOR_MATRIX, SVG);
    const feCompositeA = this.renderer.createElement(FE_COMPOSITE, SVG);
    const feCompositeB = this.renderer.createElement(FE_COMPOSITE, SVG);

    MAGIC_TURBULENCE_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feTurbulence, attribute.name, attribute.value); });
    MAGIC_COLORMATRIX_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feColorMatrix, attribute.name, attribute.value); });
    MAGIC_COMPOSITE_A_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feCompositeA, attribute.name, attribute.value); });
    MAGIC_COMPOSITE_B_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feCompositeB, attribute.name, attribute.value); });

    this.renderer.appendChild(filter, feTurbulence);
    this.renderer.appendChild(filter, feColorMatrix);
    this.renderer.appendChild(filter, feCompositeA);
    this.renderer.appendChild(filter, feCompositeB);

    return filter;
  }

  generateFilament() {
    const filter = this.generateFilter(FILAMENT);

    const feMorphologyA = this.renderer.createElement(FE_MORPHOLOGY, SVG);
    const feMorphologyB = this.renderer.createElement(FE_MORPHOLOGY, SVG);
    const feMorphologyC = this.renderer.createElement(FE_MORPHOLOGY, SVG);
    const feOffsetA = this.renderer.createElement(FE_OFFSET, SVG);
    const feOffsetB = this.renderer.createElement(FE_OFFSET, SVG);
    const feMergeA = this.renderer.createElement(FE_MERGE, SVG);
    const feMergeB = this.renderer.createElement(FE_MERGE, SVG);
    const feMergeNodeA = this.renderer.createElement(FE_MERGE_NODE, SVG);
    const feMergeNodeB = this.renderer.createElement(FE_MERGE_NODE, SVG);
    const feMergeNodeC = this.renderer.createElement(FE_MERGE_NODE, SVG);
    const feMergeNodeD = this.renderer.createElement(FE_MERGE_NODE, SVG);

    FILAMENT_MORPHOLOGYA_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feMorphologyA, attribute.name, attribute.value); });
    FILAMENT_MORPHOLOGYB_ATTRIBUTES.forEach((attribute) => {
        this.renderer.setAttribute(feMorphologyB, attribute.name, attribute.value); });
    FILAMENT_MORPHOLOGYC_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feMorphologyC, attribute.name, attribute.value); });
    FILAMENT_OFFSETA_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feOffsetA, attribute.name, attribute.value); });
    FILAMENT_OFFSETB_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feOffsetB, attribute.name, attribute.value); });
    FILAMENT_MERGEA_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feMergeA, attribute.name, attribute.value); });
    FILAMENT_MERGEB_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feMergeB, attribute.name, attribute.value); });
    FILAMENT_NODEA_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feMergeNodeA, attribute.name, attribute.value); });
    FILAMENT_NODEB_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feMergeNodeB, attribute.name, attribute.value); });
    FILAMENT_NODEC_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feMergeNodeC, attribute.name, attribute.value); });
    FILAMENT_NODED_ATTRIBUTES.forEach((attribute) => {
      this.renderer.setAttribute(feMergeNodeD, attribute.name, attribute.value); });

    this.renderer.appendChild(filter, feMorphologyA);
    this.renderer.appendChild(filter, feMorphologyB);
    this.renderer.appendChild(filter, feMorphologyC);
    this.renderer.appendChild(filter, feOffsetA);
    this.renderer.appendChild(filter, feOffsetB);
    this.renderer.appendChild(feMergeA, feMergeNodeA);
    this.renderer.appendChild(feMergeA, feMergeNodeB);
    this.renderer.appendChild(feMergeB, feMergeNodeC);
    this.renderer.appendChild(feMergeB, feMergeNodeD);
    this.renderer.appendChild(filter, feMergeA);
    this.renderer.appendChild(filter, feMergeB);

    return filter;
  }
}
