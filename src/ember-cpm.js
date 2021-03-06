import {libraries} from 'ember';
import among from './among';
import encodeURIComponent from './encode-uri-component';
import encodeURI from './encode-uri';
import fmt from './fmt';
import htmlEscape from './html-escape';
import ifNull from './if-null';
import notAmong from './not-among';
import notEqual from './not-equal';
import notMatch from './not-match';
import promise from './promise';
import safeString from './safe-string';
import join from './join';
import sumBy from './sum-by';
import concat from './concat';

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

export {
  VERSION,
  Macros,
  install
};