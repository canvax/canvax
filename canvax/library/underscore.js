define(
    "canvax/library/underscore",
    [],
    function(){ 
     
        var _ = {}

        // Establish the object that gets returned to break out of a loop iteration.
        var breaker = {};

        
        // Save bytes in the minified (but not gzipped) version:
        var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

        // Create quick reference variables for speed access to core prototypes.
        var
        push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        concat           = ArrayProto.concat,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;

        // All **ECMAScript 5** native function implementations that we hope to use
        // are declared here.
        var
        nativeForEach      = ArrayProto.forEach,
        nativeMap          = ArrayProto.map,
        nativeReduce       = ArrayProto.reduce,
        nativeReduceRight  = ArrayProto.reduceRight,
        nativeFilter       = ArrayProto.filter,
        nativeEvery        = ArrayProto.every,
        nativeSome         = ArrayProto.some,
        nativeIndexOf      = ArrayProto.indexOf,
        nativeLastIndexOf  = ArrayProto.lastIndexOf,
        nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys,
        nativeBind         = FuncProto.bind;

        // Retrieve the values of an object's properties.
        _.values = function(obj) {
          var keys = _.keys(obj);
          var length = keys.length;
          var values = new Array(length);
          for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
          }
          return values;
        };

        // Retrieve the names of an object's properties.
        // Delegates to **ECMAScript 5**'s native `Object.keys`
        _.keys = nativeKeys || function(obj) {
          if (obj !== Object(obj)) throw new TypeError('Invalid object');
          var keys = [];
          for (var key in obj) if (_.has(obj, key)) keys.push(key);
            return keys;
        };

        // Shortcut function for checking if an object has a given property directly
        // on itself (in other words, not on a prototype).
        _.has = function(obj, key) {
          return hasOwnProperty.call(obj, key);
        };

        // The cornerstone, an `each` implementation, aka `forEach`.
        // Handles objects with the built-in `forEach`, arrays, and raw objects.
        // Delegates to **ECMAScript 5**'s native `forEach` if available.
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

        // Trim out all falsy values from an array.
        _.compact = function(array) {
          return _.filter(array, _.identity);
        };

        // Return all the elements that pass a truth test.
        // Delegates to **ECMAScript 5**'s native `filter` if available.
        // Aliased as `select`.
        _.filter = _.select = function(obj, iterator, context) {
          var results = [];
          if (obj == null) return results;
          if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
          each(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) results.push(value);
          });
          return results;
        };

        // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
        each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
          _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
          };
        });

        // Optimize `isFunction` if appropriate.
        if (typeof (/./) !== 'function') {
          _.isFunction = function(obj) {
            return typeof obj === 'function';
          };
        };

        // Is a given object a finite number?
        _.isFinite = function(obj) {
          return isFinite(obj) && !isNaN(parseFloat(obj));
        };

        // Is the given value `NaN`? (NaN is the only number which does not equal itself).
        _.isNaN = function(obj) {
          return _.isNumber(obj) && obj != +obj;
        };

        // Is a given value a boolean?
        _.isBoolean = function(obj) {
          return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
        };

        // Is a given value equal to null?
        _.isNull = function(obj) {
          return obj === null;
        };

        // Is a given array, string, or object empty?
        // An "empty" object has no enumerable own-properties.
        _.isEmpty = function(obj) {
          if (obj == null) return true;
          if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
          for (var key in obj) if (_.has(obj, key)) return false;
            return true;
        };

        // Is a given value a DOM element?
        _.isElement = function(obj) {
          return !!(obj && obj.nodeType === 1);
        };

        // Is a given value an array?
        // Delegates to ECMA5's native Array.isArray
        _.isArray = nativeIsArray || function(obj) {
          return toString.call(obj) == '[object Array]';
        };

        // Is a given variable an object?
        _.isObject = function(obj) {
          return obj === Object(obj);
        };

        // Keep the identity function around for default iterators.
        _.identity = function(value) {
          return value;
        };

        // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
        // we need this function. Return the position of the first occurrence of an
        // item in an array, or -1 if the item is not included in the array.
        // Delegates to **ECMAScript 5**'s native `indexOf` if available.
        // If the array is large and already in sort order, pass `true`
        // for **isSorted** to use binary search.
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

        // Create a (shallow-cloned) duplicate of an object.
        _.clone = function(obj) {
          if (!_.isObject(obj)) return obj;
          return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };

        // Extend a given object with all the properties in passed-in object(s).
        _.extend = function(obj) {
          each(slice.call(arguments, 1), function(source) {
            if (source) {
              for (var prop in source) {
                obj[prop] = source[prop];
              }
            }
          });
          return obj;
        };

        // **Reduce** builds up a single result from a list of values, aka `inject`,
        // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
        _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
          var initial = arguments.length > 2;
          if (obj == null) obj = [];
          if (nativeReduce && obj.reduce === nativeReduce) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
          }
          each(obj, function(value, index, list) {
            if (!initial) {
              memo = value;
              initial = true;
            } else {
              memo = iterator.call(context, memo, value, index, list);
            }
          });
          if (!initial) throw new TypeError(reduceError);
          return memo;
        };

        // Produce an array that contains every item shared between all the
        // passed-in arrays.
        _.intersection = function(array) {
          var rest = slice.call(arguments, 1);
          return _.filter(_.uniq(array), function(item) {
            return _.every(rest, function(other) {
              return _.indexOf(other, item) >= 0;
            });
          });
        };

        // Determine whether all of the elements match a truth test.
        // Delegates to **ECMAScript 5**'s native `every` if available.
        // Aliased as `all`.
        _.every = _.all = function(obj, iterator, context) {
          iterator || (iterator = _.identity);
          var result = true;
          if (obj == null) return result;
          if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
          each(obj, function(value, index, list) {
            if (!(result = result && iterator.call(context, value, index, list))) return breaker;
          });
          return !!result;
        };

        // Return the results of applying the iterator to each element.
        // Delegates to **ECMAScript 5**'s native `map` if available.
        _.map = _.collect = function(obj, iterator, context) {
          var results = [];
          if (obj == null) return results;
          if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
          each(obj, function(value, index, list) {
            results.push(iterator.call(context, value, index, list));
          });
          return results;
        };

        // Produce a duplicate-free version of the array. If the array has already
        // been sorted, you have the option of using a faster algorithm.
        // Aliased as `unique`.
        _.uniq = _.unique = function(array, isSorted, iterator, context) {
          if (_.isFunction(isSorted)) {
            context = iterator;
            iterator = isSorted;
            isSorted = false;
          }
          var initial = iterator ? _.map(array, iterator, context) : array;
          var results = [];
          var seen = [];
          each(initial, function(value, index) {
            if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
              seen.push(value);
              results.push(array[index]);
            }
          });
          return results;
        };

        // Determine if the array or object contains a given value (using `===`).
        // Aliased as `include`.
        _.contains = _.include = function(obj, target) {
          if (obj == null) return false;
          if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
          return any(obj, function(value) {
            return value === target;
          });
        };

        //////---------------------------------------
        (function( _ ) {
            var arrays, basicObjects, deepClone, deepExtend, deepExtendCouple, isBasicObject, __slice = [].slice;

            deepClone = function(obj) {
                var func, isArr;
                if (!_.isObject(obj) || _.isFunction(obj)) {
                    return obj;
                }
                if (_.isDate(obj)) {
                    return new Date(obj.getTime());
                }
                if (_.isRegExp(obj)) {
                    return new RegExp(obj.source, obj.toString().replace(/.*\//, ""));
                }
                isArr = _.isArray(obj || _.isArguments(obj));
                func = function(memo, value, key) {
                    if (isArr) {
                        memo.push(deepClone(value));
                    } else {
                        memo[key] = deepClone(value);
                    }
                    return memo;
                };
                debugger
                return _.reduce(obj, func, isArr ? [] : {});
            };

            isBasicObject = function(object) {
                return ( object==null || object==undefined || object.prototype === {}.prototype || object.prototype === Object.prototype) && _.isObject(object) && !_.isArray(object) && !_.isFunction(object) && !_.isDate(object) && !_.isRegExp(object) && !_.isArguments(object);
            };

            basicObjects = function(object) {
                return _.filter(_.keys(object), function(key) {
                    return isBasicObject(object[key]);
                });
            };

            arrays = function(object) {
                return _.filter(_.keys(object), function(key) {
                    return _.isArray(object[key]);
                });
            };

            deepExtendCouple = function(destination, source, maxDepth) {
                if( !source ) {
                    return destination
                }
                var combine, recurse, sharedArrayKey, sharedArrayKeys, sharedObjectKey, sharedObjectKeys, _i, _j, _len, _len1;
                if (maxDepth == null) {
                    maxDepth = 20;
                }
                if (maxDepth <= 0) {
                    console.warn('_.deepExtend(): Maximum depth of recursion hit.');
                    return _.extend(destination, source);
                }
                sharedObjectKeys = _.intersection(basicObjects(destination), basicObjects(source));
                recurse = function(key) {
                    return source[key] = deepExtendCouple(destination[key], source[key], maxDepth - 1);
                };
                for (_i = 0, _len = sharedObjectKeys.length; _i < _len; _i++) {
                    sharedObjectKey = sharedObjectKeys[_i];
                    recurse(sharedObjectKey);
                }
                sharedArrayKeys = _.intersection(arrays(destination), arrays(source));
                combine = function(key) {
                    //TODO:这里做点修改，array的话就不需要做并集了。直接整个array覆盖。因为
                    //在大部分的场景里，array的话，应该要看成是一个basicObject
                    return source[key];

                    //return source[key] = _.union(destination[key], source[key]);
                };
                for (_j = 0, _len1 = sharedArrayKeys.length; _j < _len1; _j++) {
                    sharedArrayKey = sharedArrayKeys[_j];
                    combine(sharedArrayKey);
                }
                return _.extend(destination, source);
            };

            _.deepExtend = function() {
                var finalObj, maxDepth, objects, _i;
                objects = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), maxDepth = arguments[_i++];
                if (!_.isNumber(maxDepth)) {
                    objects.push(maxDepth);
                    maxDepth = 20;
                }
                if (objects.length <= 1) {
                    return objects[0];
                }
                if (maxDepth <= 0) {
                    return _.extend.apply(this, objects);
                }
                finalObj = objects.shift();
                while (objects.length > 0) {
                    finalObj = deepExtendCouple(finalObj, deepClone(objects.shift()), maxDepth);
                }
                return finalObj;
            };

        })( _ );

        return _;
    }
);  

