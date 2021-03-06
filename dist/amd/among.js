define(
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