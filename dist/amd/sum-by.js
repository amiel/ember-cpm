define(
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