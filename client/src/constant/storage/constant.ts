import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constant';

export const DRAWING_HEIGHT = 'drawingHeight';
export const DRAWING_WIDTH = 'drawingWidth';

export const SHAPE_SELECTED = 'shape_selected';

export const ELLIPSE_OPTION_TRACE = 'shape_ellipse_option_trace';
export const ELLIPSE_OPTION_CONTOUR = 'shape_ellipse_option_contour';

export const POLYGON_OPTION_TRACE = 'shape_polygon_option_trace';
export const POLYGON_OPTION_CONTOUR = 'shape_polygon_option_contour';
export const POLYGON_OPTION_SIDES = 'shape_polygon_option_sides';

export const LINE_OPTION_JUNCTION = 'shape_line_option_junction';
export const LINE_OPTION_THICKNESS = 'shape_line_option_thickness';
export const LINE_OPTION_DIAMETER = 'shape_line_option_diameter';
export const LINE_OPTION_STYLE = 'shape_line_option_style';

export const RECTANGLE_OPTION_TRACE = 'shape_rectangle_option_trace';
export const RECTANGLE_OPTION_CONTOUR = 'shape_rectangle_option_contour';

export const OPTION_GRID_SIZE = 'option_grid_size';
export const OPTION_GRID_OPACITY = 'option_grid_opacity';
export const OPTION_GRID_SHOWN = 'option_grid_shown';

export const ERASER_DIAMETER = 'eraser_diameter';

export const STAMP_SELECTED = 'stamp_selected';
export const STAMP_OPTION_IMAGE = 'stamp_option_link';
export const STAMP_OPTION_SCALE = 'stamp_option_scale';
export const STAMP_OPTION_ROTATE = 'stamp_option_rotate';

export const TRACE_SELECTED = 'trace_selected';

export const BRUSH_OPTION_THICKNESS = 'trace_brush_option_thickness';
export const BRUSH_OPTION_PATTERN = 'trace_brush_option_pattern';

export const PENCIL_OPTION_THICKNESS = 'trace_pencil_option_thickness';

export const FEATHER_OPTION_LINE_LENGTH = 'trace_feather_option_line_length';
export const FEATHER_OPTION_ORIENTATION_ANGLE = 'trace_feather_option_orientation_angle';

export const PEN_OPTION_THICKNESS_MIN = 'trace_pen_option_thickness_min';
export const PEN_OPTION_THICKNESS_MAX = 'trace_pen_option_thickness_max';
export const BUCKET_TOLERANCE = 'bucket_tolerance';

export const TEXT_FONT_SIZE = 'text_font_size';
export const TEXT_FONT_STYLE = 'text_font_style';

export const MAGNETISM_STATE = 'magnetism_state';

export const SPRAY_INTERVAL_PERIOD = 'spray_interval_millis';
export const SPRAY_RADIUS = 'spray_radius';

export const TUTORIAL = 'tutorial';
export const ENABLE = 'true';
export const DISABLE = 'false';
export const NOT_DEACTIVATED = false;
export const DEACTIVATED = true;
export const LOCAL_STORAGE = false;
export const SESSION_STORAGE = true;
export const ERROR = 'ERROR';

export const ALL_STORAGE_ELEMENT: string[] = [
    ELLIPSE_OPTION_TRACE, ELLIPSE_OPTION_CONTOUR, LINE_OPTION_STYLE, LINE_OPTION_JUNCTION, LINE_OPTION_THICKNESS, LINE_OPTION_DIAMETER,
    POLYGON_OPTION_TRACE, POLYGON_OPTION_CONTOUR, POLYGON_OPTION_SIDES, RECTANGLE_OPTION_TRACE, RECTANGLE_OPTION_CONTOUR, SHAPE_SELECTED,
    STAMP_OPTION_IMAGE, STAMP_OPTION_SCALE, STAMP_OPTION_ROTATE, BRUSH_OPTION_THICKNESS, BRUSH_OPTION_PATTERN, PENCIL_OPTION_THICKNESS,
    TRACE_SELECTED, PRIMARY_COLOR, SECONDARY_COLOR, TUTORIAL, ERASER_DIAMETER, STAMP_OPTION_IMAGE,
    PEN_OPTION_THICKNESS_MIN, PEN_OPTION_THICKNESS_MAX, OPTION_GRID_OPACITY, OPTION_GRID_SHOWN, OPTION_GRID_SIZE, TEXT_FONT_SIZE,
    TEXT_FONT_STYLE, MAGNETISM_STATE, FEATHER_OPTION_LINE_LENGTH, FEATHER_OPTION_ORIENTATION_ANGLE, BUCKET_TOLERANCE,
    SPRAY_INTERVAL_PERIOD, SPRAY_RADIUS,
];

export const DEFAULT_STORAGE_VALUE: string[] = [
    '5', 'Contour', 'Continuous', 'Point', '5', '5', 'Contour', '5', '5', 'Contour', '5', 'shape_rectangle', 'stamp1', '1', '5', '5',
    'blur', '5', 'trace_pencil', '#27ff00ff', '#d32fbbff', 'true', '10', 'China', '5', '30', '.2', 'false', '10', '50', 'sans-serif',
    'false', '5', '0', '0', '0.2', '5',
];
