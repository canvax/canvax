define(
    "canvax/library/underscore",
    [],
    function(){
        var _ = {}
        var breaker = {};
        var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
        var
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;

        var
        nativeForEach      = ArrayProto.forEach,
        nativeFilter       = ArrayProto.filter,
        nativeIndexOf      = ArrayProto.indexOf,
        nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys;

        _.values = function(obj) {
          var keys = _.keys(obj);
          var length = keys.length;
          var values = new Array(length);
          for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
          }
          return values;
        };

        _.keys = nativeKeys || function(obj) {
          if (obj !== Object(obj)) throw new TypeError('Invalid object');
          var keys = [];
          for (var key in obj) if (_.has(obj, key)) keys.push(key);
            return keys;
        };

        _.has = function(obj, key) {
          return hasOwnProperty.call(obj, key);
        };

        var each = _.each = _.forEach = function(obj, iterator, context) {
          if (obj == null) return;
          if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
          } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
              if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
          } else {
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
              if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
            }
          }
        };

        _.compact = function(array) {
          return _.filter(array, _.identity);
        };

        _.filter = _.select = function(obj, iterator, context) {
          var results = [];
          if (obj == null) return results;
          if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
          each(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) results.push(value);
          });
          return results;
        };

        each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
          _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
          };
        });

        if (typeof (/./) !== 'function') {
          _.isFunction = function(obj) {
            return typeof obj === 'function';
          };
        };

        _.isFinite = function(obj) {
          return isFinite(obj) && !isNaN(parseFloat(obj));
        };

        _.isNaN = function(obj) {
          return _.isNumber(obj) && obj != +obj;
        };

        _.isBoolean = function(obj) {
          return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
        };

        _.isNull = function(obj) {
          return obj === null;
        };

        _.isEmpty = function(obj) {
          if (obj == null) return true;
          if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
          for (var key in obj) if (_.has(obj, key)) return false;
            return true;
        };

        _.isElement = function(obj) {
          return !!(obj && obj.nodeType === 1);
        };

        _.isArray = nativeIsArray || function(obj) {
          return toString.call(obj) == '[object Array]';
        };

        _.isObject = function(obj) {
          return obj === Object(obj);
        };

        _.identity = function(value) {
          return value;
        };

        _.indexOf = function(array, item, isSorted) {
          if (array == null) return -1;
          var i = 0, length = array.length;
          if (isSorted) {
            if (typeof isSorted == 'number') {
              i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
            } else {
              i = _.sortedIndex(array, item);
              return array[i] === item ? i : -1;
            }
          }
          if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
          for (; i < length; i++) if (array[i] === item) return i;
            return -1;
        };

        _.isWindow = function( obj ) { 
           return obj != null && obj == obj.window;
        };
        _.isPlainObject = function( obj ) {
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if ( !obj || typeof obj !== "object" || obj.nodeType || isWindow( obj ) ) {
                return false;
            }
            try {
                // Not own constructor property must be Object
                if ( obj.constructor &&
                    !hasOwn.call(obj, "constructor") &&
                    !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                    return false;
                }
            } catch ( e ) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }
            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            var key;
            for ( key in obj ) {}

            return key === undefined || hasOwn.call( obj, key );
        };
        _.extend = function() {  
          var options, name, src, copy, copyIsArray, clone,  
              target = arguments[0] || {},  
              i = 1,  
              length = arguments.length,  
              deep = false;  
        
          // Handle a deep copy situation  
          if ( typeof target === "boolean" ) {  
              deep = target;  
              target = arguments[1] || {};  
              // skip the boolean and the target  
              i = 2;  
          };  
        
          // Handle case when target is a string or something (possible in deep copy)  
          if ( typeof target !== "object" && !_.isFunction(target) ) {  
              target = {};  
          };  
        
          // extend jQuery itself if only one argument is passed  
          if ( length === i ) {  
              target = this;  
              --i;  
          };  
        
          for ( ; i < length; i++ ) {  
              // Only deal with non-null/undefined values  
              if ( (options = arguments[ i ]) != null ) {  
                  // Extend the base object  
                  for ( name in options ) {  
                      src = target[ name ];  
                      copy = options[ name ];  
                      // Prevent never-ending loop  
                      if ( target === copy ) {  
                          continue;  
                      }  
                      // Recurse if we're merging plain objects or arrays  
                      if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = _.isArray(copy)) ) ) {  
                          if ( copyIsArray ) {  
                              copyIsArray = false;  
                              clone = src && _.isArray(src) ? src : [];  
                          } else {  
                              clone = src && isPlainObject(src) ? src : {};  
                          }  
                          // Never move original objects, clone them  
                          target[ name ] = _.extend( deep, clone, copy );  
                      // Don't bring in undefined values  
                      } else if ( copy !== undefined ) {  
                          target[ name ] = copy;  
                      }  
                  }  
              }  
          }  
          return target;  
        }; 

        // Create a (shallow-cloned) duplicate of an object.
        _.clone = function(obj) {
          if (!_.isObject(obj)) return obj;
          return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };

        return _;
    }
);  