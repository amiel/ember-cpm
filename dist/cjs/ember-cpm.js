"use strict";
var libraries = require("ember").libraries;
var among = require("./among")["default"] || require("./among");
var encodeURIComponent = require("./encode-uri-component")["default"] || require("./encode-uri-component");
var encodeURI = require("./encode-uri")["default"] || require("./encode-uri");
var fmt = require("./fmt")["default"] || require("./fmt");
var htmlEscape = require("./html-escape")["default"] || require("./html-escape");
var ifNull = require("./if-null")["default"] || require("./if-null");
var notAmong = require("./not-among")["default"] || require("./not-among");
var notEqual = require("./not-equal")["default"] || require("./not-equal");
var notMatch = require("./not-match")["default"] || require("./not-match");
var promise = require("./promise")["default"] || require("./promise");
var safeString = require("./safe-string")["default"] || require("./safe-string");
var join = require("./join")["default"] || require("./join");
var sumBy = require("./sum-by")["default"] || require("./sum-by");
var concat = require("./concat")["default"] || require("./concat");

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

exports.VERSION = VERSION;
exports.Macros = Macros;
exports.install = install;