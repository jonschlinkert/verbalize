'use strict';

// console.log(chalk.yellow.bold('loggerred'))
// console.log(chalk.yellow('loggerred'))
// var colors = require('ansi-colors');
var ansiStyles = require('./ansi');

// var ansiColors = [
//   'red',
//   'red.bold',
//   'yellow',
//   'yellow.bold',
//   'green',
//   'green.bold',
//   'blue',
//   'blue.bold',
//   'cyan',
//   'cyan.bold',
//   'magenta',
//   'magenta.bold',
//   'white',
//   'white.bold'
// ];

// var len = ansiColors.length;
// var idx = -1;

// while (++idx < len) {
//   var str = ansiColors[idx];
//   var segs = str.split('.');
//   var styles = [];

//   for (var j = 0; j < segs.length; j++) {
//     styles = styles.concat(chalk[segs[j]]._styles);
//   }
//   console.log(styles)
//   // console.log(str, last('foo'))
// }

function Styles() {

}

function Logger() {
  this.cache = {};
  this.keys = [];

  for (var key in ansiStyles) {
    if (ansiStyles.hasOwnProperty(key)) {
      this.mixin(key, ansiStyles[key]);
    }
  }
}

function define(obj, key, fn) {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set: function(val) {
      define(obj, key, val);
    },
    get: function() {
      return fn;
    }
  });
}

Logger.prototype.mixin = function(key, val) {
  var self = this;

  define(Logger.prototype, key, function(msg) {
    this.keys.push(key);

    this[key] = function(msg) {
      console.log(this.keys)
      var fn = createColors.call(this, this.keys);
      console.log(fn(msg));
      this.keys = [];

      return fn
    }.bind(this);

    this[key].__proto__ = this;
    this[key](msg);
    return this;
  }.bind(this));
};

Logger.prototype.create = function(key) {
  var self = this;
  this.keys.push(key);

  this[key] = function(msg) {
    var fn = createColors.call(this, this.keys);
    console.log(fn(msg));
    self.keys = [];
    return this[key];
  }.bind(this);

  this[key].__proto__ = this;
  return this;
};

function createColors(styles) {
  var len = styles.length;
  var idx = -1;
  var res = [];

  while (++idx < len) {
    var style = styles[idx];
    var open = ansiStyles[style].open;
    var close = ansiStyles[style].close;
    res.push(createColor(open, close));
  }

  return function(str) {
    var val = str;
    for (var j = 0; j < res.length; j++) {
      var fn = res[j];
      val = fn(val);
    }
    return val;
  };
}

function createColor(open, close) {
  return function(msg) {
    return open + msg + close;
  }
}

// createColors(arr, 'logger red green');

var logger = new Logger();

// logger.create('red');
// logger.create('green');
// logger.create('yellow');
// logger.create('cyan');
// logger.create('bold');

logger.yellow('something');
// logger.red.green
