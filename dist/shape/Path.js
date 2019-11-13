"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../display/Shape", "../utils/index", "mmvis", "../geom/Matrix", "../math/index"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../display/Shape"), require("../utils/index"), require("mmvis"), require("../geom/Matrix"), require("../math/index"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Shape, global.index, global.mmvis, global.Matrix, global.index);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Shape2, _index, _mmvis, _Matrix, _index3) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Shape3 = _interopRequireDefault(_Shape2);

  var _index2 = _interopRequireDefault(_index);

  var _Matrix2 = _interopRequireDefault(_Matrix);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Path = function (_Shape) {
    _inherits(Path, _Shape);

    function Path(opt) {
      _classCallCheck(this, Path);

      var _context = _mmvis._.extend(true, {
        pointList: [],
        //从下面的path中计算得到的边界点的集合
        path: "" //字符串 必须，路径。例如:M 0 0 L 0 10 L 10 10 Z (一个三角形)
        //M = moveto
        //L = lineto
        //H = horizontal lineto
        //V = vertical lineto
        //C = curveto
        //S = smooth curveto
        //Q = quadratic Belzier curve
        //T = smooth quadratic Belzier curveto
        //Z = closepath

      }, opt.context);

      opt.context = _context;
      opt.__parsePathData = null;
      opt.type = "path";
      return _possibleConstructorReturn(this, _getPrototypeOf(Path).call(this, opt));
    }

    _createClass(Path, [{
      key: "watch",
      value: function watch(name, value, preValue) {
        if (name == "path") {
          //如果path有变动，需要自动计算新的pointList
          this.graphics.clear();
        }
      }
    }, {
      key: "_parsePathData",
      value: function _parsePathData(data) {
        if (this.__parsePathData) {
          return this.__parsePathData;
        }

        ;

        if (!data) {
          return [];
        }

        ; //分拆子分组

        this.__parsePathData = [];

        var paths = _mmvis._.compact(data.replace(/[Mm]/g, "\\r$&").split('\\r'));

        var me = this;

        _mmvis._.each(paths, function (pathStr) {
          me.__parsePathData.push(me._parseChildPathData(pathStr));
        });

        return this.__parsePathData;
      }
    }, {
      key: "_parseChildPathData",
      value: function _parseChildPathData(data) {
        // command string
        var cs = data; // command chars

        var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
        cs = cs.replace(/  /g, ' ');
        cs = cs.replace(/ /g, ','); //cs = cs.replace(/(.)-/g, "$1,-");

        cs = cs.replace(/(\d)-/g, '$1,-');
        cs = cs.replace(/,,/g, ',');
        var n; // create pipes so that we can split the data

        for (n = 0; n < cc.length; n++) {
          cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        } // create array


        var arr = cs.split('|');
        var ca = []; // init context point

        var cpx = 0;
        var cpy = 0;

        for (n = 1; n < arr.length; n++) {
          var str = arr[n];
          var c = str.charAt(0);
          str = str.slice(1);
          str = str.replace(new RegExp('e,-', 'g'), 'e-'); //有的时候，比如“22，-22” 数据可能会经常的被写成22-22，那么需要手动修改
          //str = str.replace(new RegExp('-', 'g'), ',-');
          //str = str.replace(/(.)-/g, "$1,-")

          var p = str.split(',');

          if (p.length > 0 && p[0] === '') {
            p.shift();
          }

          for (var i = 0; i < p.length; i++) {
            p[i] = parseFloat(p[i]);
          }

          while (p.length > 0) {
            if (isNaN(p[0])) {
              break;
            }

            var cmd = null;
            var points = [];
            var ctlPtx;
            var ctlPty;
            var prevCmd;
            var rx;
            var ry;
            var psi;
            var fa;
            var fs;
            var x1 = cpx;
            var y1 = cpy; // convert l, H, h, V, and v to L

            switch (c) {
              case 'l':
                cpx += p.shift();
                cpy += p.shift();
                cmd = 'L';
                points.push(cpx, cpy);
                break;

              case 'L':
                cpx = p.shift();
                cpy = p.shift();
                points.push(cpx, cpy);
                break;

              case 'm':
                cpx += p.shift();
                cpy += p.shift();
                cmd = 'M';
                points.push(cpx, cpy);
                c = 'l';
                break;

              case 'M':
                cpx = p.shift();
                cpy = p.shift();
                cmd = 'M';
                points.push(cpx, cpy);
                c = 'L';
                break;

              case 'h':
                cpx += p.shift();
                cmd = 'L';
                points.push(cpx, cpy);
                break;

              case 'H':
                cpx = p.shift();
                cmd = 'L';
                points.push(cpx, cpy);
                break;

              case 'v':
                cpy += p.shift();
                cmd = 'L';
                points.push(cpx, cpy);
                break;

              case 'V':
                cpy = p.shift();
                cmd = 'L';
                points.push(cpx, cpy);
                break;

              case 'C':
                points.push(p.shift(), p.shift(), p.shift(), p.shift());
                cpx = p.shift();
                cpy = p.shift();
                points.push(cpx, cpy);
                break;

              case 'c':
                points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                cpx += p.shift();
                cpy += p.shift();
                cmd = 'C';
                points.push(cpx, cpy);
                break;

              case 'S':
                ctlPtx = cpx;
                ctlPty = cpy;
                prevCmd = ca[ca.length - 1];

                if (prevCmd.command === 'C') {
                  ctlPtx = cpx + (cpx - prevCmd.points[2]);
                  ctlPty = cpy + (cpy - prevCmd.points[3]);
                }

                points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                cpx = p.shift();
                cpy = p.shift();
                cmd = 'C';
                points.push(cpx, cpy);
                break;

              case 's':
                ctlPtx = cpx, ctlPty = cpy;
                prevCmd = ca[ca.length - 1];

                if (prevCmd.command === 'C') {
                  ctlPtx = cpx + (cpx - prevCmd.points[2]);
                  ctlPty = cpy + (cpy - prevCmd.points[3]);
                }

                points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                cpx += p.shift();
                cpy += p.shift();
                cmd = 'C';
                points.push(cpx, cpy);
                break;

              case 'Q':
                points.push(p.shift(), p.shift());
                cpx = p.shift();
                cpy = p.shift();
                points.push(cpx, cpy);
                break;

              case 'q':
                points.push(cpx + p.shift(), cpy + p.shift());
                cpx += p.shift();
                cpy += p.shift();
                cmd = 'Q';
                points.push(cpx, cpy);
                break;

              case 'T':
                ctlPtx = cpx, ctlPty = cpy;
                prevCmd = ca[ca.length - 1];

                if (prevCmd.command === 'Q') {
                  ctlPtx = cpx + (cpx - prevCmd.points[0]);
                  ctlPty = cpy + (cpy - prevCmd.points[1]);
                }

                cpx = p.shift();
                cpy = p.shift();
                cmd = 'Q';
                points.push(ctlPtx, ctlPty, cpx, cpy);
                break;

              case 't':
                ctlPtx = cpx, ctlPty = cpy;
                prevCmd = ca[ca.length - 1];

                if (prevCmd.command === 'Q') {
                  ctlPtx = cpx + (cpx - prevCmd.points[0]);
                  ctlPty = cpy + (cpy - prevCmd.points[1]);
                }

                cpx += p.shift();
                cpy += p.shift();
                cmd = 'Q';
                points.push(ctlPtx, ctlPty, cpx, cpy);
                break;

              case 'A':
                rx = p.shift(); //x半径

                ry = p.shift(); //y半径

                psi = p.shift(); //旋转角度

                fa = p.shift(); //角度大小 

                fs = p.shift(); //时针方向

                x1 = cpx, y1 = cpy;
                cpx = p.shift(), cpy = p.shift();
                cmd = 'A';
                points = [rx, ry, psi, fa, fs, cpx, cpy, x1, y1];
                break;

              case 'a':
                rx = p.shift();
                ry = p.shift();
                psi = p.shift();
                fa = p.shift();
                fs = p.shift();
                x1 = cpx, y1 = cpy;
                cpx += p.shift();
                cpy += p.shift();
                cmd = 'A';
                points = [rx, ry, psi, fa, fs, cpx, cpy, x1, y1];
                break;
            }

            ca.push({
              command: cmd || c,
              points: points
            });
          }

          if (c === 'z' || c === 'Z') {
            ca.push({
              command: 'z',
              points: []
            });
          }
        }

        ;
        return ca;
      }
    }, {
      key: "draw",
      value: function draw(graphics) {
        //graphics.beginPath();
        this.__parsePathData = null;
        this.context.$model.pointList = [];

        var pathArray = this._parsePathData(this.context.$model.path);

        for (var g = 0, gl = pathArray.length; g < gl; g++) {
          for (var i = 0, l = pathArray[g].length; i < l; i++) {
            var c = pathArray[g][i].command,
                p = pathArray[g][i].points;

            switch (c) {
              case 'L':
                graphics.lineTo(p[0], p[1]);
                break;

              case 'M':
                graphics.moveTo(p[0], p[1]);
                break;

              case 'C':
                graphics.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                break;

              case 'Q':
                graphics.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                break;

              case 'A':
                //前面6个元素用来放path的A 6个参数，path A命令详见
                _index3.Arc.drawArc(graphics, p[7], p[8], p);

                break;

              case 'z':
                graphics.closePath();
                break;
            }
          }
        }

        ;
        return this;
      }
    }]);

    return Path;
  }(_Shape3.default);

  exports.default = Path;
});