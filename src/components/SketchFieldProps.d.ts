export type SketchFieldProps = {
  // the color of the line
  lineColor?: string;
  // The width of the line
  lineWidth?: number;
  // the fill color of the shape when applicable
  fillColor?: string;
  // the background color of the sketch
  backgroundColor?: string;
  // the opacity of the object
  opacity?: number;
  // number of undo/redo steps to maintain
  undoSteps?: number;
  // The tool to use, can be pencil, rectangle, circle, brush;
  tool?: string;
  // image format when calling toDataURL
  imageFormat?: string;
  // Sketch data for controlling sketch from
  // outside the component
  value?: object;
  // Set to true if you wish to force load the given value, even if it is  the same
  forceValue?: boolean;
  // Specify some width correction which will be applied on auto resize
  widthCorrection?: number;
  // Specify some height correction which will be applied on auto resize
  heightCorrection?: number;
  // Specify action on change
  onChange?: (evt: any) => void;
  // Default initial value
  defaultValue?: {};
  // Sketch width
  width?: number;
  // Sketch height
  height?: number;
  // Class name to pass to container div of canvas
  className?: string;
  // Style options to pass to container div of canvas
  style?: {};
  // ref to the canvas element
  ref: React.MutableRefObject<null>;
  // event object added
  onObjectAdded?: (event: any) => void;
  // event object modified
  onObjectModified?: (event: any) => void;
  // event object removed
  onObjectRemoved?: (event: any) => void;
  // event mouse down
  onMouseDown?: (event: any) => void;
  // event mouse move
  onMouseMove?: (event: any) => void;
  // event mouse up
  onMouseUp?: (event: any) => void;
  // event mouse out
  onMouseOut?: (event: any) => void;
  // event object move
  onObjectMoving?: (event: any) => void;
  // event object scale
  onObjectScaling?: (event: any) => void;
  // event object rotating
  onObjectRotating?: (event: any) => void;
};

export type SketchModel = {
  background: string;
  objects: any[];
  version: string;
};

export type SketchModelJSON = {
  background: string;
  objectJSONs: string[];
  version: string;
};

export type ToolsEnum = {
    Circle: "circle",
    Line: "line",
    Arrow: "arrow",
    Pencil: "pencil",
    Rectangle: "rectangle",
    RectangleLabel: "rectangle-label",
    Select: "select",
    Pan: "pan",
    Highlighter: "highlighter",
    DefaultTool: "default-tool",
}