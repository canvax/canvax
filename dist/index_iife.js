(function () {
  'use strict';

  (function (global, factory) {
    if (typeof define === "function" && define.amd) {
      define(["exports", "./Application", "./display/DisplayObject", "./display/DisplayObjectContainer", "./display/Stage", "./display/Sprite", "./display/Shape", "./display/Point", "./display/Text", "./shape/BrokenLine", "./shape/Circle", "./shape/Droplet", "./shape/Ellipse", "./shape/Isogon", "./shape/Line", "./shape/Path", "./shape/Polygon", "./shape/Rect", "./shape/Sector", "./shape/arrow", "./animation/AnimationFrame", "./utils/index"], factory);
    } else if (typeof exports !== "undefined") {
      factory(exports, require("./Application"), require("./display/DisplayObject"), require("./display/DisplayObjectContainer"), require("./display/Stage"), require("./display/Sprite"), require("./display/Shape"), require("./display/Point"), require("./display/Text"), require("./shape/BrokenLine"), require("./shape/Circle"), require("./shape/Droplet"), require("./shape/Ellipse"), require("./shape/Isogon"), require("./shape/Line"), require("./shape/Path"), require("./shape/Polygon"), require("./shape/Rect"), require("./shape/Sector"), require("./shape/arrow"), require("./animation/AnimationFrame"), require("./utils/index"));
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports, global.Application, global.DisplayObject, global.DisplayObjectContainer, global.Stage, global.Sprite, global.Shape, global.Point, global.Text, global.BrokenLine, global.Circle, global.Droplet, global.Ellipse, global.Isogon, global.Line, global.Path, global.Polygon, global.Rect, global.Sector, global.arrow, global.AnimationFrame, global.index);
      global.undefined = mod.exports;
    }
  })(void 0, function (exports, _Application, _DisplayObject, _DisplayObjectContainer, _Stage, _Sprite, _Shape, _Point, _Text, _BrokenLine, _Circle, _Droplet, _Ellipse, _Isogon, _Line, _Path, _Polygon, _Rect, _Sector, _arrow, _AnimationFrame, _index) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _Application2 = _interopRequireDefault(_Application);

    var _DisplayObject2 = _interopRequireDefault(_DisplayObject);

    var _DisplayObjectContainer2 = _interopRequireDefault(_DisplayObjectContainer);

    var _Stage2 = _interopRequireDefault(_Stage);

    var _Sprite2 = _interopRequireDefault(_Sprite);

    var _Shape2 = _interopRequireDefault(_Shape);

    var _Point2 = _interopRequireDefault(_Point);

    var _Text2 = _interopRequireDefault(_Text);

    var _BrokenLine2 = _interopRequireDefault(_BrokenLine);

    var _Circle2 = _interopRequireDefault(_Circle);

    var _Droplet2 = _interopRequireDefault(_Droplet);

    var _Ellipse2 = _interopRequireDefault(_Ellipse);

    var _Isogon2 = _interopRequireDefault(_Isogon);

    var _Line2 = _interopRequireDefault(_Line);

    var _Path2 = _interopRequireDefault(_Path);

    var _Polygon2 = _interopRequireDefault(_Polygon);

    var _Rect2 = _interopRequireDefault(_Rect);

    var _Sector2 = _interopRequireDefault(_Sector);

    var _arrow2 = _interopRequireDefault(_arrow);

    var _AnimationFrame2 = _interopRequireDefault(_AnimationFrame);

    var _index2 = _interopRequireDefault(_index);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    //shapes
    var Canvax = {
      App: _Application2.default
    };
    Canvax.Display = {
      DisplayObject: _DisplayObject2.default,
      DisplayObjectContainer: _DisplayObjectContainer2.default,
      Stage: _Stage2.default,
      Sprite: _Sprite2.default,
      Shape: _Shape2.default,
      Point: _Point2.default,
      Text: _Text2.default
    };
    Canvax.Shapes = {
      BrokenLine: _BrokenLine2.default,
      Circle: _Circle2.default,
      Droplet: _Droplet2.default,
      Ellipse: _Ellipse2.default,
      Isogon: _Isogon2.default,
      Line: _Line2.default,
      Path: _Path2.default,
      Polygon: _Polygon2.default,
      Rect: _Rect2.default,
      Sector: _Sector2.default,
      Arrow: _arrow2.default
    };
    Canvax.AnimationFrame = _AnimationFrame2.default;
    Canvax.utils = _index2.default;
    exports.default = Canvax;
  });

}());
