"use strict";
var get = require("ember").get;
var reduceComputed = require("ember").reduceComputed;

exports["default"] = function EmberCPM_sumBy(dependentKey, propertyKey) {
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