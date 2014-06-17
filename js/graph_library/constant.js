/* 
 * Variables that SHOULD NOT be modified once initialized
 * These variables can be defined without the HTML elements,
 * and SHOULD be defined before calling any of the visualization scripts
 * Make sure you know what you're doing before modifying this file
 */

const OBJ_HIDDEN = -1;

const VERTEX_SHAPE_CIRCLE = "circle";
const VERTEX_SHAPE_RECT = "rect";
// const VERTEX_SHAPE_ELLIPSE = "ellipse"; // Currently not implemented
// IDEA: VERTEX_SHAPE_POLYLINE (Very low priority, might not be backward-compatible if implemented)

const VERTEX_DEFAULT = "default";
const VERTEX_NORMAL_BLUE = "normal_blue";
const VERTEX_NORMAL_GREEN = "normal_green";
const VERTEX_HIGHLIGHTED = "highlighted";
const VERTEX_HIGHLIGHTED_RECT = "highlighted_rect";
const VERTEX_TRAVERSED = "traversed";
const VERTEX_RESULT = "result";
const VERTEX_RESULT_RECT = "result_rect";
const VERTEX_RECT = "rect";
const VERTEX_BLUE_FILL = "blueFill";
const VERTEX_GREEN_FILL = "greenFill";
const VERTEX_GREY_FILL = "greyFill";
const VERTEX_PINK_FILL = "pinkFill";
const VERTEX_RED_FILL = "redFill";
const VERTEX_BLUE_OUTLINE = "blueOutline";
const VERTEX_GREEN_OUTLINE = "greenOutline";
const VERTEX_GREY_OUTLINE = "greyOutline";
const VERTEX_PINK_OUTLINE = "pinkOutline";
const VERTEX_RED_OUTLINE = "redOutline";

const EDGE_DEFAULT = "default";
const EDGE_HIGHLIGHTED = "highlighted";
const EDGE_TRAVERSED = "traversed";
const EDGE_BLUE = "blue";
const EDGE_GREEN = "green";
const EDGE_GREY = "grey";
const EDGE_PINK = "pink";
const EDGE_RED = "red";

const EDGE_TYPE_UDE = 0;
const EDGE_TYPE_DE = 1;
const EDGE_TYPE_BDE = 2;

const NO_ITERATION = -1;
const NO_STATELIST = {};

const ANIMATION_PLAY = 1;
const ANIMATION_PAUSE = 0;
const ANIMATION_STOP = -1;

const UPDATE_FORWARD = true;
const UPDATE_BACKWARD = false;