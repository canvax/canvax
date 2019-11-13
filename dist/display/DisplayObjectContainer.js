"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "mmvis", "./DisplayObject"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mmvis"), require("./DisplayObject"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mmvis, global.DisplayObject);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _mmvis, _DisplayObject2) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

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

  var DisplayObjectContainer = function (_DisplayObject) {
    _inherits(DisplayObjectContainer, _DisplayObject);

    function DisplayObjectContainer(opt) {
      var _this;

      _classCallCheck(this, DisplayObjectContainer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayObjectContainer).call(this, opt));
      _this.children = [];
      _this.mouseChildren = []; //所有的容器默认支持event 检测，因为 可能有里面的shape是eventEnable是true的
      //如果用户有强制的需求让容器下的所有元素都 不可检测，可以调用
      //DisplayObjectContainer的 setEventEnable() 方法

      _this._eventEnabled = true;
      return _this;
    }

    _createClass(DisplayObjectContainer, [{
      key: "addChild",
      value: function addChild(child, index) {
        if (!child) {
          return;
        }

        ;

        if (this.getChildIndex(child) != -1) {
          child.parent = this;
          return child;
        }

        ; //如果他在别的子元素中，那么就从别人那里删除了

        if (child.parent) {
          child.parent.removeChild(child);
        }

        ;

        if (index === undefined) {
          index = this.children.length;
        }

        ;
        this.children.splice(index, 0, child);
        child.parent = this;

        if (this.heartBeat) {
          this.heartBeat({
            convertType: "children",
            target: child,
            src: this
          });
        }

        ;

        if (this._afterAddChild) {
          this._afterAddChild(child);
        }

        ;
        return child;
      }
    }, {
      key: "addChildAt",
      value: function addChildAt(child, index) {
        return this.addChild(child, index);
      }
    }, {
      key: "removeChild",
      value: function removeChild(child) {
        return this.removeChildAt(_mmvis._.indexOf(this.children, child));
      }
    }, {
      key: "removeChildAt",
      value: function removeChildAt(index) {
        if (index < 0 || index > this.children.length - 1) {
          return false;
        }

        ;
        var child = this.children[index];

        if (child != null) {
          child.parent = null;
        }

        ;
        this.children.splice(index, 1);

        if (this.heartBeat) {
          this.heartBeat({
            convertType: "children",
            target: child,
            src: this
          });
        }

        ;

        if (this._afterDelChild) {
          this._afterDelChild(child, index);
        }

        return child;
      }
    }, {
      key: "removeChildById",
      value: function removeChildById(id) {
        for (var i = 0, len = this.children.length; i < len; i++) {
          if (this.children[i].id == id) {
            return this.removeChildAt(i);
          }
        }

        return false;
      }
    }, {
      key: "removeAllChildren",
      value: function removeAllChildren() {
        while (this.children.length > 0) {
          this.removeChildAt(0);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        /*
        if( this.parent ){
            this.parent.removeChild(this);
            this.parent = null;
        };
        this.fire("destroy");
        */
        //依次销毁所有子元素
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.getChildAt(i).destroy();
          i--;
          l--;
        }

        ;

        this._destroy();
      }
    }, {
      key: "cleanAnimates",
      value: function cleanAnimates() {
        //依次销毁所有子元素
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.getChildAt(i).cleanAnimates();
        }

        ;

        this._cleanAnimates();
      }
    }, {
      key: "getChildById",
      value: function getChildById(id, boolen) {
        if (!boolen) {
          for (var i = 0, len = this.children.length; i < len; i++) {
            if (this.children[i].id == id) {
              return this.children[i];
            }
          }
        } else {
          //深度查询
          //TODO:暂时未实现
          return null;
        }

        return null;
      }
    }, {
      key: "getChildAt",
      value: function getChildAt(index) {
        if (index < 0 || index > this.children.length - 1) return null;
        return this.children[index];
      }
    }, {
      key: "getChildIndex",
      value: function getChildIndex(child) {
        return _mmvis._.indexOf(this.children, child);
      }
    }, {
      key: "setChildIndex",
      value: function setChildIndex(child, index) {
        if (child.parent != this) return;

        var oldIndex = _mmvis._.indexOf(this.children, child);

        if (index == oldIndex) return;
        this.children.splice(oldIndex, 1);
        this.children.splice(index, 0, child);
      }
    }, {
      key: "getNumChildren",
      value: function getNumChildren() {
        return this.children.length;
      }
    }, {
      key: "getObjectsUnderPoint",
      value: function getObjectsUnderPoint(point, num) {
        var result = [];

        for (var i = this.children.length - 1; i >= 0; i--) {
          var child = this.children[i];

          if (child == null || !child.context.$model.visible) {
            //不管是集合还是非集合，如果不显示的都不接受点击检测
            continue;
          }

          ;

          if (child instanceof DisplayObjectContainer) {
            if (!child._eventEnabled) {
              //容易一般默认 _eventEnabled == true; 但是如果被设置成了false
              //如果容器设置了不接受事件检测，那么下面所有的元素都不接受事件检测
              continue;
            }

            ; //是集合

            if (child.mouseChildren && child.getNumChildren() > 0) {
              var objs = child.getObjectsUnderPoint(point);

              if (objs.length > 0) {
                result = result.concat(objs);
              }
            }
          } else {
            if (!child._eventEnabled && !child.dragEnabled) {
              continue;
            }

            ; //非集合，可以开始做getChildInPoint了

            if (child.getChildInPoint(point)) {
              result.push(child);

              if (num != undefined && !isNaN(num)) {
                if (result.length == num) {
                  return result;
                }
              }
            }
          }
        }

        return result;
      }
    }]);

    return DisplayObjectContainer;
  }(_DisplayObject3.default);

  exports.default = DisplayObjectContainer;
});