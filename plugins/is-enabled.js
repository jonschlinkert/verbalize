'use strict';

var utils = require('../lib/utils');

module.exports = function(options) {
  var opts = utils.extend({}, options);
  return function(app) {
    if (typeof app.isEnabled === 'function') return;

    this.define('isEnabled', function(keys) {
      if (isEmpty(keys)) return true;
      if (typeof keys === 'string') {
        keys = keys.split('.');
      }

      // filter out falsey keys and flip the flag when falsey
      var flag = true;
      keys = keys.filter(function(m) {
        if (utils.isFalsey(m, opts)) {
          flag = !flag;
          return false;
        }
        return true;
      });

      var key = keys[0];
      if (isEmpty(key)) return flag;
      return this.options[key] === flag;
    });

    function isEmpty(val) {
      if (!val) return true;
      if (Array.isArray(val) && val.length === 0) {
        return true;
      }
      return false;
    }
  };
};
