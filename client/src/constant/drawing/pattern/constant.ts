export const FILTER_ATTRIBUTES = [
    {name: 'x', value: '-200'},
    {name: 'y', value: '-200'},
    {name: 'width', value: '1000'},
    {name: 'height', value: '1000'},
    {name: 'filterUnits', value: 'objectBoundingBox'},
    {name: 'primitiveUnits', value: 'userSpaceOnUse'},
    {name: 'color-interpolation-filters', value: 'linearRGB'},
];

export const BLUR_ATTRIBUTES = [
    {name: 'stdDeviation', value: '3 3'},
    {name: 'x', value: '0%'},
    {name: 'y', value: '0%'},
    {name: 'width', value: '100%'},
    {name: 'height', value: '100%'},
    {name: 'in', value: 'SourceGraphic'},
    {name: 'edgeMode', value: 'none'},
    {name: 'result', value: 'blur2'},
];

export const SKETCH_TURBULENCE_ATTRIBUTES = [
    {name: 'type', value: 'turbulence'},
    {name: 'baseFrequency', value: '0.01 0.014'},
    {name: 'numOctaves', value: '2'},
    {name: 'seed', value: '2'},
    {name: 'stitchTiles', value: 'noStitch'},
    {name: 'result', value: 'turbulence'},
];

export const SKETCH_DISPLACEMENTMAP_ATTRIBUTES = [
    {name: 'in', value: 'SourceGraphic'},
    {name: 'in2', value: 'turbulence'},
    {name: 'scale', value: '20'},
    {name: 'xChannelSelector', value: 'G'},
    {name: 'yChannelSelector', value: 'A'},
    {name: 'result', value: 'displacementMap'},
];

export const AEROSOL_TURBULENCE_ATTRIBUTES = [
    {name: 'type', value: 'turbulence'},
    {name: 'baseFrequency', value: '0.6 0.6'},
    {name: 'numOctaves', value: '4'},
    {name: 'seed', value: '4'},
    {name: 'stitchTiles', value: 'stitch'},
    {name: 'result', value: 'turbulence'},
];
export const AEROSOL_COLORMATRIX_ATTRIBUTES = [
    {name: 'type', value: 'matrix'},
    {name: 'values', value: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -30 10'},
    {name: 'in', value: 'turbulence'},
    {name: 'result', value: 'colormatrix'},
];
export const AEROSOL_COMPOSITEA_ATTRIBUTES = [
    {name: 'in', value: 'colormatrix'},
    {name: 'in2', value: 'SourceAlpha'},
    {name: 'operator', value: 'in'},
    {name: 'result', value: 'composite'},
];
export const AEROSOL_COMPOSITEB_ATTRIBUTES = [
    {name: 'in', value: 'composite'},
    {name: 'in2', value: 'SourceGraphic'},
    {name: 'operator', value: 'xor'},
    {name: 'result', value: 'composite1'},
];

export const SPRAY_TURBULENCE_ATTRIBUTES = [
  {name: 'type', value: 'turbulence'},
  {name: 'baseFrequency', value: '0.6 0.6'},
  {name: 'numOctaves', value: '4'},
  {name: 'seed', value: '4'},
  {name: 'stitchTiles', value: 'stitch'},
  {name: 'result', value: 'turbulence'},
];
export const SPRAY_COLORMATRIX_ATTRIBUTES = [
  {name: 'type', value: 'matrix'},
  {name: 'values', value: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -70 10'},
  {name: 'in', value: 'turbulence'},
  {name: 'result', value: 'colormatrix'},
];
export const SPRAY_COMPOSITEA_ATTRIBUTES = [
  {name: 'in', value: 'colormatrix'},
  {name: 'in2', value: 'SourceGraphic'},
  {name: 'operator', value: 'in'},
  {name: 'result', value: 'composite'},
];
export const SPRAY_GAUSS_ATTRIBUTES = [
  {name: 'in', value: 'composite'},
  {name: 'stdDeviation', value: '0.5 0.5'},
  {name: 'x', value: '-30%'},
  {name: 'y', value: '-30%'},
  {name: 'width',   value: '200%'},
  {name: 'height',  value: '200%'},
  {name: 'result', value: 'blur'},
];

export const MAGIC_TURBULENCE_ATTRIBUTES = [
    {name: 'type', value: 'turbulence'},
    {name: 'baseFrequency', value: '0.12 0.06'},
    {name: 'inumOctavesn', value: '1'},
    {name: 'seed', value: '4'},
    {name: 'stitchTiles', value: 'stitch'},
    {name: 'result', value: 'turbulence'},
];
export const MAGIC_COLORMATRIX_ATTRIBUTES = [
    {name: 'type', value: 'matrix'},
    {name: 'values', value: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -70 10'},
    {name: 'in', value: 'turbulence'},
    {name: 'result', value: 'colormatrix'},
];
export const MAGIC_COMPOSITE_A_ATTRIBUTES = [
    {name: 'in', value: 'colormatrix'},
    {name: 'in2', value: 'SourceAlpha'},
    {name: 'operator', value: 'in'},
    {name: 'result', value: 'composite'},
];
export const MAGIC_COMPOSITE_B_ATTRIBUTES = [
    {name: 'in', value: 'SourceGraphic'},
    {name: 'in2', value: 'composite'},
    {name: 'operator', value: 'xor'},
    {name: 'result', value: 'composite1'},
];

export const FILAMENT_MORPHOLOGYA_ATTRIBUTES = [
    {name: 'operator', value: 'erode'},
    {name: 'radius', value: '3 3'},
    {name: 'x', value: '0%'},
    {name: 'y', value: '0%'},
    {name: 'width', value: '100%'},
    {name: 'height', value: '100%'},
    {name: 'in', value: 'SourceGraphic'},
    {name: 'result', value: 'morphology1'},
];
export const FILAMENT_MORPHOLOGYB_ATTRIBUTES = [
    {name: 'operator', value: 'erode'},
    {name: 'radius', value: '1 1'},
    {name: 'x', value: '0%'},
    {name: 'y', value: '0%'},
    {name: 'width', value: '100%'},
    {name: 'height', value: '100%'},
    {name: 'in', value: 'SourceGraphic'},
    {name: 'result', value: 'morphology2'},
];
export const FILAMENT_MORPHOLOGYC_ATTRIBUTES = [
    {name: 'operator', value: 'erode'},
    {name: 'radius', value: '2 2'},
    {name: 'x', value: '0%'},
    {name: 'y', value: '0%'},
    {name: 'width', value: '100%'},
    {name: 'height', value: '100%'},
    {name: 'in', value: 'SourceGraphic'},
    {name: 'result', value: 'morphology3'},
];

export const FILAMENT_OFFSETA_ATTRIBUTES = [
    {name: 'dx', value: '8'},
    {name: 'dy', value: '-10'},
    {name: 'x', value: '0%'},
    {name: 'y', value: '0%'},
    {name: 'width', value: '100%'},
    {name: 'height', value: '100%'},
    {name: 'in', value: 'morphology1'},
    {name: 'result', value: 'offset1'},
];
export const FILAMENT_OFFSETB_ATTRIBUTES = [
    {name: 'dx', value: '10'},
    {name: 'dy', value: '15'},
    {name: 'x', value: '0%'},
    {name: 'y', value: '0%'},
    {name: 'width', value: '100%'},
    {name: 'height', value: '100%'},
    {name: 'in', value: 'morphology2'},
    {name: 'result', value: 'offset2'},
];
export const FILAMENT_MERGEA_ATTRIBUTES = [
    {name: 'x', value: '0%'},
    {name: 'y', value: '0%'},
    {name: 'width', value: '100%'},
    {name: 'height', value: '100%'},
    {name: 'result', value: 'merge'},
];
export const FILAMENT_MERGEB_ATTRIBUTES = [
    {name: 'x', value: '0%'},
    {name: 'y', value: '0%'},
    {name: 'width', value: '100%'},
    {name: 'height', value: '100%'},
    {name: 'result', value: 'merge'},
];
export const FILAMENT_NODEA_ATTRIBUTES = [
    {name: 'in', value: 'offset1'},
];
export const FILAMENT_NODEB_ATTRIBUTES = [
    {name: 'in', value: 'offset2'},
];
export const FILAMENT_NODEC_ATTRIBUTES = [
    {name: 'in', value: 'merge'},
];
export const FILAMENT_NODED_ATTRIBUTES = [
    {name: 'in', value: 'morphology3'},
];
