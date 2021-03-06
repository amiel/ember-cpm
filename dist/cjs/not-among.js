"use strict";
var get = require("ember").get;
var computed = require("ember").computed;

exports["default"] = function EmberCPM_notAmong(dependentKey) {
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