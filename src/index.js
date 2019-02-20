
import Application from "./Application";
import DisplayObject from "./display/DisplayObject";
import DisplayObjectContainer from "./display/DisplayObjectContainer";
import Stage from "./display/Stage";
import Sprite from "./display/Sprite";
import Shape from "./display/Shape";
import Point from "./display/Point";
import Text from "./display/Text";

//shapes
import BrokenLine from "./shape/BrokenLine";
import Circle from "./shape/Circle";
import Droplet from "./shape/Droplet";
import Ellipse from "./shape/Ellipse";
import Isogon from "./shape/Isogon";
import Line from "./shape/Line";
import Path from "./shape/Path";
import Polygon from "./shape/Polygon";
import Rect from "./shape/Rect";
import Sector from "./shape/Sector";
import Arrow from "./shape/arrow";

import AnimationFrame from "./animation/AnimationFrame"

import utils from "./utils/index"

var Canvax = {
    App: Application
};

Canvax.Display = {
    DisplayObject : DisplayObject,
    DisplayObjectContainer : DisplayObjectContainer,
    Stage  : Stage,
    Sprite : Sprite,
    Shape  : Shape,
    Point  : Point,
    Text   : Text
}

Canvax.Shapes = {
    BrokenLine : BrokenLine,
    Circle : Circle,
    Droplet : Droplet,
    Ellipse : Ellipse,
    Isogon : Isogon,
    Line : Line,
    Path : Path,
    Polygon : Polygon,
    Rect : Rect,
    Sector : Sector,
    Arrow  : Arrow
}

Canvax.AnimationFrame = AnimationFrame;

Canvax.utils = utils;

export default Canvax;