var _ = {}
var breaker = {};
var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;


// Create quick reference variables for speed access to core prototypes.
var 
push = ArrayProto.push,
slice = ArrayProto.slice,
concat = ArrayProto.concat,
toString = ObjProto.toString,
hasOwnProperty = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
var 
nativeForEach = ArrayProto.forEach,
nativeMap = ArrayProto.map,
nativeReduce = ArrayProto.reduce,
nativeReduceRight = ArrayProto.reduceRight,
nativeFilter = ArrayProto.filter,
nativeEvery = ArrayProto.every,
nativeSome = ArrayProto.some,
nativeIndexOf = ArrayProto.indexOf,
nativeLastIndexOf = ArrayProto.lastIndexOf,
nativeIsArray = Array.isArray,
nativeKeys = Object.keys,
nativeBind = FuncProto.bind;


var shallowProperty = function(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
};
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = shallowProperty('length');
var isArrayLike = function(collection) {
  var length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};



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

if (!_.isArguments(arguments)) {
  _.isArguments = function (obj) {
    return !!(obj && _.has(obj, 'callee'));
  };
}

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

// Internal implementation of a recursive `flatten` function.
var flatten = function (input, shallow, output) {
  if (shallow && _.every(input, _.isArray)) {
    return concat.apply(output, input);
  }
  each(input, function (value) {
    if (_.isArray(value) || _.isArguments(value)) {
      shallow ? push.apply(output, value) : flatten(value, shallow, output);
    } else {
      output.push(value);
    }
  });
  return output;
};

// Flatten out an array, either recursively (by default), or just one level.
_.flatten = function (array, shallow) {
  return flatten(array, shallow, []);
};

_.every = _.all = function (obj, iterator, context) {
  iterator || (iterator = _.identity);
  var result = true;
  if (obj == null) return result;
  if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
  each(obj, function (value, index, list) {
    if (!(result = result && iterator.call(context, value, index, list))) return breaker;
  });
  return !!result;
};






// Return the minimum element (or element-based computation).
_.min = function (obj, iterator, context) {
  if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
    return Math.min.apply(Math, obj);
  }
  if (!iterator && _.isEmpty(obj)) return Infinity;
  var result = { computed: Infinity, value: Infinity };
  each(obj, function (value, index, list) {
    var computed = iterator ? iterator.call(context, value, index, list) : value;
    computed < result.computed && (result = { value: value, computed: computed });
  });
  return result.value;
};
// Return the maximum element or (element-based computation).
// Can't optimize arrays of integers longer than 65,535 elements.
// See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
_.max = function (obj, iterator, context) {
  if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
    return Math.max.apply(Math, obj);
  }
  if (!iterator && _.isEmpty(obj)) return -Infinity;
  var result = { computed: -Infinity, value: -Infinity };
  each(obj, function (value, index, list) {
    var computed = iterator ? iterator.call(context, value, index, list) : value;
    computed > result.computed && (result = { value: value, computed: computed });
  });
  return result.value;
};

// Return the first value which passes a truth test. Aliased as `detect`.
_.find = _.detect = function (obj, iterator, context) {
  var result;
  any(obj, function (value, index, list) {
    if (iterator.call(context, value, index, list)) {
      result = value;
      return true;
    }
  });
  return result;
};
// Determine if at least one element in the object matches a truth test.
// Delegates to **ECMAScript 5**'s native `some` if available.
// Aliased as `any`.
var any = _.some = _.any = function (obj, iterator, context) {
  iterator || (iterator = _.identity);
  var result = false;
  if (obj == null) return result;
  if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
  each(obj, function (value, index, list) {
    if (result || (result = iterator.call(context, value, index, list))) return breaker;
  });
  return !!result;
};
// Return a version of the array that does not contain the specified value(s).
_.without = function (array) {
  return _.difference(array, slice.call(arguments, 1));
};
// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
_.difference = function (array) {
  var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
  return _.filter(array, function (value) { return !_.contains(rest, value); });
};
// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// Aliased as `unique`.
_.uniq = _.unique = function (array, isSorted, iterator, context) {
  if (_.isFunction(isSorted)) {
    context = iterator;
    iterator = isSorted;
    isSorted = false;
  }
  var initial = iterator ? _.map(array, iterator, context) : array;
  var results = [];
  var seen = [];
  each(initial, function (value, index) {
    if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
      seen.push(value);
      results.push(array[index]);
    }
  });
  return results;
};
// Return the results of applying the iterator to each element.
// Delegates to **ECMAScript 5**'s native `map` if available.
_.map = _.collect = function (obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
  each(obj, function (value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
};
// Determine if the array or object contains a given value (using `===`).
// Aliased as `include`.
_.contains = _.include = function (obj, target) {
  if (obj == null) return false;
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
  return any(obj, function (value) {
    return value === target;
  });
};

// Convenience version of a common use case of `map`: fetching a property.
_.pluck = function (obj, key) {
  return _.map(obj, function (value) { return value[key]; });
};

// Return a random integer between min and max (inclusive).
_.random = function(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

// Shuffle a collection.
_.shuffle = function(obj) {
  return _.sample(obj, Infinity);
};

_.sample = function(obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    return obj[_.random(obj.length - 1)];
  }
  var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
  var length = getLength(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = _.random(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
};





/**
*
*如果是深度extend，第一个参数就设置为true
*/
_.extend = function() {  
  var options, name, src, copy,  
      target = arguments[0] || {},  
      i = 1,  
      length = arguments.length,  
      deep = false;  
  if ( typeof target === "boolean" ) {  
      deep = target;  
      target = arguments[1] || {};  
      i = 2;  
  };  
  if ( typeof target !== "object" && !_.isFunction(target) ) {  
      target = {};  
  };  
  if ( length === i ) {  
      target = this;  
      --i;  
  };  
  for ( ; i < length; i++ ) {  
      if ( (options = arguments[ i ]) != null ) {  
          for ( name in options ) {  
              src = target[ name ];  
              copy = options[ name ];  
              if ( target === copy ) {  
                  continue;
              };
              
              //if( deep && copy && _.isObject( copy ) &&  && !_.isArray( copy ) && !_.isFunction( copy ) ){
              if( deep && copy && _.isObject( copy ) && copy.constructor === Object ){
                  target[ name ] = _.extend( deep, src, copy ); 
              } else {
                  target[ name ] = copy;
              };
          }  
      }  
  }  
  return target;  
};

_.clone = function(obj) {
  if (!_.isObject(obj)) return obj;
  return _.isArray(obj) ? obj.slice() : _.extend(true, {}, obj);
};

export default _;