import { KeyModifier } from 'src/interface/key-modifier';

export const DEFAULT_TOOL = 0;
export const FIRST_CHILD = 0;

export const TOOL_TABLE = [
    'TRACE (C, W, P, Y, A)',
    'SHAPE (1, 2, 3, L)',
    'COLORIZER (R)',
    'TEXT (T)',
    'PIPETTE (I)',
    'STAMP (U)',
    'SELECTION (S)',
    'ERASER (E)',
    'BUCKET (B)'];
export const OPTION_TABLE = [
    'CREATE (CTRL-O)',
    'SAVE (CTRL-S)',
    'OPEN (CTRL-G)',
    'EXPORT (CTRL-E)',
    'TUTORIAL (CTRL-T)',
];

export const DEFAULT_BUTTON_BACKGROUND_COLOR: string[] = ['lightgrey', 'white', 'white',
'white', 'white', 'white', 'white', 'white', 'black'];
export const TRACE_COMPONENT = 0;
export const SHAPE_COMPONENT = 1;
export const TEXT_COMPONENT  = 2;
export const CREATE = 0;
export const SAVE = 1;
export const GALLERY = 2;
export const EXPORT = 3;
export const TUTORIAL = 4;
export const WRONG_VALUE = 23;
export const TRACE_COMPONENT_INDEX = 0;
export const SHAPE_COMPONENT_INDEX = 1;

export const WHITE = 'white';
export const LIGHTGREY = 'lightgrey';

export const TOOL_SELECTED = 'tool_selected';
export const FAKE_LENGTH = '2';

export const FAKE_KEY_MODIFIER: KeyModifier = {
    shift: false,
    leftKey: false,
    rightKey: false,
};

export const COLORIZER = 2;
export const PIPETTE = 4;
export const SELECTION = 6;

export const LEFT_KEY = 0;
export const RIGHT_KEY = 2;
export const NUMBER_ONLY_REGEX = '[0-9]*';
export const NAME_REGEX = '[a-zA-Z0-9]*';

export const CREATE_DRAWING = 'CreateDrawingSceneComponent';
export const VIEW_DRAWING = 'ViewDrawingComponent';
export const EXPORT_DRAWING = 'ExportComponent';

export const MIN_PAGE = 0;
export const MAX_PAGE = 2;

export const NUMBER_SIDE_SUP = 1;
export const NUMBER_SIDE_INF = 3;
export const BELOW_NUMBER_SIDE_INF = 0;

export const ROTATION_LIMIT = 99;
export const BELOW_ROTATION_LIMIT = 0;
export const ABOVE_ROTATION_LIMIT = 100;

export const Z_KEY = 90;
export const Y_KEY = 89;

export const DEFAULT_PASTE_OFFSET = 10;

export const COLOR_TAB = 2;
