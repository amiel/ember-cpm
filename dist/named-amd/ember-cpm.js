define("ember-cpm/among",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;

    __exports__["default"] = function EmberCPM_among(dependentKey) {
      var properties = Array.prototype.slice.call(arguments, 1);

      return computed(dependentKey, function(){
        var value = get(this, dependentKey),
          i;

        for (i = 0; i < properties.length; ++i) {
          if (properties[i] === value) return true;
        }
        return false;
      });
    }
  });
define("ember-cpm/concat",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var ArrayPolyfills = __dependency1__.ArrayPolyfills;
    var guidFor = __dependency1__.guidFor;
    var arrayComputed = __dependency1__.arrayComputed;

    var a_forEach = ArrayPolyfills.forEach,
      a_slice   = Array.prototype.slice;

    /*
       Returns the index where an item is to be removed from, or placed into, for
       an EmberCPM.Macros.concat array.

       This is the index of the item within its dependent array, offset by the
       lengths of all prior dependent arrays.
    */
    function getIndex(changeMeta, instanceMeta, dependentArrayDelta) {
      var dependentArrayGuid = guidFor(changeMeta.arrayChanged);

      if (!(dependentArrayGuid in instanceMeta.dependentGuidToIndex)) {
        recomputeGuidIndexes(instanceMeta, changeMeta.property._dependentKeys, this);
      }

      var dependentArrayLengths = instanceMeta.dependentArrayLengths,
          dependentArrayIndex = instanceMeta.dependentGuidToIndex[dependentArrayGuid],
          offset = 0,
          arrayIndex;

      // offset is the sum of the lengths of arrays to our left
      for (var i = 0; i < dependentArrayIndex; ++i) {
        offset += (dependentArrayLengths[i] || 0);
      }

      arrayIndex = offset + changeMeta.index;
      dependentArrayLengths[dependentArrayIndex] = (get(changeMeta.arrayChanged, 'length') || 0) + dependentArrayDelta;

      return arrayIndex;
    }

    function recomputeGuidIndexes(instanceMeta, keys, context) {
      instanceMeta.dependentGuidToIndex = {};
      a_forEach.call(keys, function (key, idx) {
        instanceMeta.dependentGuidToIndex[guidFor(get(this, key))] = idx;
      }, context);
    }

    /**
      Keeps n arrays concatenated using `Ember.ArrayComputed`.

      Example:
      ```js
      obj = Ember.Object.createWithMixins({
        itemsA: [],
        itemsB: [],
        itemsC: [],
        allItems: EmberCPM.Macros.concat('itemsA', 'itemsB', 'itemsC');
      });

      obj.get('itemsA').pushObjects(['a', 'b']);
      obj.get('allItems') //=> ['a', 'b']

      obj.get('itemsB').pushObjects(['c']);
      obj.get('allItems') //=> ['a', 'b', 'c']

      obj.get('itemsC').pushObjects(['d']);
      obj.get('allItems') //=> ['a', 'b', 'c', 'd']

      obj.get('itemsB').pushObjects(['e', 'f']);
      obj.get('allItems') //=> ['a', 'b', 'c', 'e', 'f', 'd']
      ```
    */
    __exports__["default"] = function EmberCPM_concat() {
      var args = a_slice.call(arguments);
      args.push({
        initialize: function (array, changeMeta, instanceMeta) {
          instanceMeta.dependentArrayLengths = new Array(changeMeta.property._dependentKeys.length);
          // When items are added or removed, we have access to the array that was
          // changed, but not its dependent key, so we use its guid as the key to
          // determine its index in the array of dependent keys.
          instanceMeta.dependentGuidToIndex = {};

          return array;
        },

        addedItem: function (array, item, changeMeta, instanceMeta) {
          var arrayIndex = getIndex.call(this, changeMeta, instanceMeta, 0);
          array.insertAt(arrayIndex, item);
          return array;
        },

        removedItem: function (array, item, changeMeta, instanceMeta) {
          var arrayIndex = getIndex.call(this, changeMeta, instanceMeta, -1);
          array.removeAt(arrayIndex);
          return array;
        }
      });

      return arrayComputed.apply(null, args);
    }
  });
define("ember-cpm",
  ["ember","./among","./encode-uri-component","./encode-uri","./fmt","./html-escape","./if-null","./not-among","./not-equal","./not-match","./promise","./safe-string","./join","./sum-by","./concat","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__, __dependency11__, __dependency12__, __dependency13__, __dependency14__, __dependency15__, __exports__) {
    "use strict";
    var libraries = __dependency1__.libraries;
    var among = __dependency2__["default"] || __dependency2__;
    var encodeURIComponent = __dependency3__["default"] || __dependency3__;
    var encodeURI = __dependency4__["default"] || __dependency4__;
    var fmt = __dependency5__["default"] || __dependency5__;
    var htmlEscape = __dependency6__["default"] || __dependency6__;
    var ifNull = __dependency7__["default"] || __dependency7__;
    var notAmong = __dependency8__["default"] || __dependency8__;
    var notEqual = __dependency9__["default"] || __dependency9__;
    var notMatch = __dependency10__["default"] || __dependency10__;
    var promise = __dependency11__["default"] || __dependency11__;
    var safeString = __dependency12__["default"] || __dependency12__;
    var join = __dependency13__["default"] || __dependency13__;
    var sumBy = __dependency14__["default"] || __dependency14__;
    var concat = __dependency15__["default"] || __dependency15__;

    function reverseMerge(dest, source) {
      for (var key in source) {
        if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
          dest[key] = source[key];
        }
      }
    }

    var VERSION = '1.0.1',
      Macros = {
        among: among,
        encodeURIComponent: encodeURIComponent,
        encodeURI: encodeURI,
        fmt: fmt,
        htmlEscape: htmlEscape,
        ifNull: ifNull,
        notAmong: notAmong,
        notEqual: notEqual,
        notMatch: notMatch,
        promise: promise,
        safeString: safeString,
        join: join,
        sumBy: sumBy,
        concat: concat,
      },
      install = function(){ reverseMerge(Ember.computed, Macros); };


    if (libraries)
      libraries.register('Ember-CPM', VERSION);

    __exports__.VERSION = VERSION;
    __exports__.Macros = Macros;
    __exports__.install = install;
  });
define("ember-cpm/encode-uri-component",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;

    __exports__["default"] = function EmberCPM_encodeURIComponent(dependentKey) {
      return computed(dependentKey, function(){
        var value = get(this, dependentKey);
        if (value == null) return value;
        return encodeURIComponent(value);
      });
    }
  });
define("ember-cpm/encode-uri",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;

    __exports__["default"] = function EmberCPM_encodeURI(dependentKey) {
      return computed(dependentKey, function(){
        var value = get(this, dependentKey);
        if (value == null) return value;
        return encodeURI(value);
      });
    }
  });
define("ember-cpm/fmt",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;
    var String = __dependency1__.String;

    var a_slice = Array.prototype.slice;

    __exports__["default"] = function EmberCPM_fmt() {
      var formatString = '' + a_slice.call(arguments, -1),
          properties   = a_slice.call(arguments, 0, -1);

      return computed(function(){
        var values = [], i, value;

        for (i = 0; i < properties.length; ++i) {
          value = get(this, properties[i]);
          if (value === undefined) { return undefined; }
          if (value === null)      { return null; }
          values.push(value);
        }

        return String.fmt(formatString, values);
      });
    }
  });
define("ember-cpm/html-escape",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;
    var Handlebars = __dependency1__.Handlebars;

    __exports__["default"] = function EmberCPM_htmlEscape(dependentKey) {
      return computed(dependentKey, function(){
        var value = get(this, dependentKey);

        if (value == null) return value;

        var escapedExpression = Handlebars.Utils.escapeExpression(value);
        return new Handlebars.SafeString(escapedExpression);
      });

    }
  });
define("ember-cpm/if-null",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;

    __exports__["default"] = function EmberCPM_ifNull(dependentKey, defaultValue) {
      return computed(dependentKey, function(){
        var value = get(this, dependentKey);

        return value == null ? defaultValue : value;
      });
    }
  });
define("ember-cpm/join",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;

    var a_slice = Array.prototype.slice;

    __exports__["default"] = function EmberCPM_join() {
      var separator  = a_slice.call(arguments, -1),
          properties = a_slice.call(arguments, 0, -1);

      var cp = computed(function(){
        var that = this;
        return properties.map(function(key) {
          return get(that, key);
        }).join(separator);
      });

      return cp.property.apply(cp, properties);
    }
  });
define("ember-cpm/not-among",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;

    __exports__["default"] = function EmberCPM_notAmong(dependentKey) {
      var properties = Array.prototype.slice.call(arguments, 1);

      return computed(dependentKey, function(){
        var value = get(this, dependentKey),
          i;

        for (i = 0; i < properties.length; ++i) {
          if (properties[i] === value) return false;
        }

        return true;
      });
    }
  });
define("ember-cpm/not-equal",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;

    __exports__["default"] = function EmberCPM_notEqual(dependentKey, targetValue) {
      return computed(dependentKey, function(){
        return get(this, dependentKey) !== targetValue;
      });
    }
  });
define("ember-cpm/not-match",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;

    __exports__["default"] = function EmberCPM_notMatch(dependentKey, regexp) {
      return computed(dependentKey, function(){
        var value = get(this, dependentKey);

        return typeof value === 'string' ? !value.match(regexp) : true;
      });
    }
  });
define("ember-cpm/promise",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;
    var $ = __dependency1__.$;

    // TODO: Use RSVP?
    __exports__["default"] = function EmberCPM_promise(dependentKey) {
      return computed(dependentKey, function(){
        var value = get(this, dependentKey);
        if (value == null) { return value; }
        return $.when(value);
      });
    }
  });
define("ember-cpm/safe-string",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var computed = __dependency1__.computed;
    var Handlebars = __dependency1__.Handlebars;

    __exports__["default"] = function EmberCPM_safeString(dependentKey) {

      return computed(dependentKey, function(){
        var value = get(this, dependentKey);

        return value && new Handlebars.SafeString(value);
      });

    }
  });
define("ember-cpm/sum-by",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var get = __dependency1__.get;
    var reduceComputed = __dependency1__.reduceComputed;

    __exports__["default"] = function EmberCPM_sumBy(dependentKey, propertyKey) {
      return reduceComputed(dependentKey + '.@each.' + propertyKey, {
        initialValue: 0.0,

        addedItem: function(accumulatedValue, item, changeMeta, instanceMeta){
          return accumulatedValue + parseFloat(get(item, propertyKey));
        },

        removedItem: function(accumulatedValue, item, changeMeta, instanceMeta){
          return accumulatedValue - parseFloat(get(item, propertyKey));
        }
      });
    }
  });