'use strict';

var stripColor = require('strip-color');
var styles = require('./colors');

function Styles(options) {
  this.options = options || {};
  this.stack = [];
  for (var key in styles) {
    createMethod(this, key, styles[key]);
  }
}

function createMethod(app, key, style) {
  if (style.open) {
    var fn = createStyle(app);
    fn.style = style;
    define(app, key, fn);
  } else {
    app[key] = style;
  }
}

function createStyle(app) {
  return function(msg) {
    if (app.options.stripColor) {
      return stripColor(msg);
    }
    var len = app.stack.length;
    var idx = -1;
    while (++idx < len) {
      msg = addStyle(app[app.stack[idx]].style, msg);
    }
    app.stack = [];
    return msg;
  };
}

function addStyle(style, msg) {
  return style.open + msg + style.close;
}

function define(app, key, fn) {
  Object.defineProperty(app, key, {
    configurable: true,
    enumerable: true,
    get: function() {
      app.stack.push(key);
      fn.__proto__ = app;
      return fn;
    }
  });
}

var styles = new Styles();

console.log('a %s b %s', styles.bold.yellow.underline('foo', 'bar').bold.green('whatever'));
// console.log(styles.white.bgYellow.bold('foo'));
// console.log(styles.red('foo'));
// console.log(styles.red.bold('foo'));
// console.log(styles.bold.blue('foo'));
// console.log(styles.green('foo'));
console.log(styles.green.bold('foo'));
