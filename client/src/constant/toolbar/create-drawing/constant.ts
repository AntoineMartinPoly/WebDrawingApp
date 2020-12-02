import { ColorRGBA } from 'src/interface/colors';

export const PALETTE_COLOR_ARRAY = [
    {red: 0, green: 0, blue: 0, opacity: 1} as ColorRGBA,
    {red: 255, green: 255, blue: 255, opacity: 1} as ColorRGBA,
    {red: 255, green: 0, blue: 0, opacity: 1} as ColorRGBA,
    {red: 255, green: 255, blue: 0, opacity: 1} as ColorRGBA,
    {red: 255, green: 0, blue: 255, opacity: 1} as ColorRGBA,
    {red: 255, green: 122, blue: 123, opacity: 1} as ColorRGBA,
    {red: 0, green: 255, blue: 0, opacity: 1} as ColorRGBA,
    {red: 122, green: 255, blue: 123, opacity: 1} as ColorRGBA,
    {red: 122, green: 255, blue: 0, opacity: 1} as ColorRGBA,
    {red: 0, green: 0, blue: 255, opacity: 1} as ColorRGBA,
   ];

export const MIN_VALUE = 0;
export const MAX_COLOR = 255;
export const MAX_OPACITY = 1;
export const MAX_COLOR_255 = '255';
export const MAX_COLOR_1 = '1';
export const PATTERN_VALIDATION_CREATE = '^[0-1]$|^[0-1][.][0-9]*$';
export const PALETTE = 'palette';
