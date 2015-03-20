/*!
 * verbalize <https://github.com/jonschlinkert/verbalize>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';


var getobject = require('getobject');
var expander = require('expander');
var Base = require('class-extend');
var _ = require('lodash');


/**
 * # Config
 *
 * The Config constructor is Assemble's parent storage class.
 * Optionally initialize a new `Config` with the given `obj`.
 *
 * **Example:**
 *
 * ```js
 * var cache = new Config();
 * ```
 *
 * @class Config
 * @param {Object} `obj`
 * @constructor
 * @api public
 */

function Config(obj) {
  Base.call(this);
  this.cache = obj || {};
}


/**
 * ## .hasOwn
 *
 * Return `true` if `cache` has own property `key`.
 *
 * **Example**
 *
 * ```js
 * cache.keys();
 * ```
 *
 * @method `keys`
 * @param {*} `key`
 * @return {*}
 * @api public
 */

Config.prototype.hasOwn = function (key) {
  return {}.hasOwnProperty.call(this.cache, key);
};


/**
 * ## .keys
 *
 * Return all of the keys on the `Config` prototype.
 *
 * **Example**
 *
 * ```js
 * cache.keys();
 * ```
 *
 * @method `keys`
 * @param {*} `key`
 * @return {*}
 * @api public
 */

Config.prototype.keys = function () {
  return _.methods(this);
};


/**
 * ## .set
 *
 * Assign `value` to `key`.
 *
 * **Example**
 *
 * ```js
 * cache.set('a', {b: 'c'});
 *
 * // expand template strings with expander
 * cache.set('a', {b: 'c'}, true);
 * ```
 *
 * Visit [expander's docs](https://github.com/tkellen/expander) for more info.
 *
 * @method set
 * @param {String} `key`
 * @param {*} `value`
 * @param {Boolean} `expand`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.set = function set(key, value, expand) {
  // translate for Express compatibility
  key = (key === 'view engine') ? 'layout engine' : key;
  if (expand) {
    expander.set(this.cache, key, value);
  } else {
    getobject.set(this.cache, key, value);
  }
  return this;
};


/**
 * ## .constant
 *
 * Set a constant on the cache.
 *
 * **Example**
 *
 * ```js
 * cache.constant('site.title', 'Foo');
 * ```
 *
 * @method `constant`
 * @param {String} `key`
 * @param {*} `value`
 * @chainable
 * @api public
 */

Config.prototype.constant = function constant(key, value){
  var getter;
  if (typeof value !== 'function'){
    getter = function() {
      return value;
    };
  } else {
    getter = value;
  }
  this.__defineGetter__(key, getter);
  return this;
};


/**
 * ## .enabled (key)
 *
 * Check if `key` is enabled (truthy). (express inspired)
 *
 * ```js
 * cache.enabled('foo')
 * // => false
 *
 * cache.enable('foo')
 * cache.enabled('foo')
 * // => true
 * ```
 *
 * @method enabled
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Config.prototype.enabled = function enabled(key){
  return !!this.get(key);
};


/**
 * ## .disabled (key)
 *
 * Check if `key` is disabled. (express inspired)
 *
 * ```js
 * cache.disabled('foo')
 * // => true
 *
 * cache.enable('foo')
 * cache.disabled('foo')
 * // => false
 * ```
 *
 * @method disabled
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Config.prototype.disabled = function disabled(key){
  return !this.get(key);
};


/**
 * ## .enable (key)
 *
 * Enable `key`.  (express inspired)
 *
 * **Example**
 *
 * ```js
 * cache.enable('foo');
 * ```
 *
 * @method enable
 * @param {String} `key`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.enable = function enable(key){
  return this.set(key, true);
};


/**
 * ## .disable (key)
 *
 * Disable `key`. (express inspired)
 *
 * **Example**
 *
 * ```js
 * cache.disable('foo');
 * ```
 *
 * @method disable
 * @param {String} `key`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.disable = function disable(key){
  return this.set(key, false);
};


/*
 * ## .exists
 *
 * Return `true` if the element exists.
 *
 * **Example**
 *
 * ```js
 * cache.exists('person');
 * //=> true
 * ```
 *
 * @method  `exists`
 * @param   {String}  `key`
 * @return  {Boolean}
 * @api public
 */

Config.prototype.exists = function exists(key) {
  return getobject.exists(this.cache, key);
};


/**
 * ## .merge ( arguments )
 *
 * Extend the cache with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * var cache = new Config();
 * cache
 *   .merge({foo: 'bar'}, {baz: 'quux'});
 *   .merge({fez: 'bang'});
 * ```
 *
 * @chainable
 * @method merge
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.merge = function merge() {
  var args = [].slice.call(arguments);
  _.merge.apply(_, [this.cache].concat(args));
  return this;
};


/**
 * ## .extend
 *
 * Extend the cache with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * cache
 *   .extend({foo: 'bar'}, {baz: 'quux'});
 *   .extend({fez: 'bang'});
 * ```
 *
 * @method `extend`
 * @param {Object} `arguments`
 * @return {Assemble} for chaining
 * @chainable
 * @api public
 */

Config.prototype.extend = function extend() {
  var args = [].slice.call(arguments);
  _.extend.apply(_, [this.cache].concat(args));
  return this;
};


/**
 * ## .defaults
 *
 * Extend the cache with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * cache
 *   .defaults({foo: 'bar'}, {baz: 'quux'});
 *   .defaults({fez: 'bang'});
 * ```
 *
 * @method `defaults`
 * @param {Object} `arguments`
 * @return {Assemble} for chaining
 * @chainable
 * @api public
 */

Config.prototype.defaults = function defaults() {
  var args = [].slice.call(arguments);
  _.defaults.apply(_, [this.cache].concat(args));
  return this;
};


/**
 * ## .get
 *
 * Return the stored value of `key`.
 *
 * ```js
 * cache.set('foo', 'bar')
 * cache.get('foo')
 * // => "bar"
 * ```
 *
 * @method get
 * @param {*} `key`
 * @param {Boolean} `create`
 * @return {*}
 * @api public
 */

Config.prototype.get = function get(key, create) {
  // translate for Express compatibility
  key = (key === 'view engine') ? 'layout engine' : key;
  return getobject.get(this.cache, key, create);
};


/**
 * ## .process
 *
 * Recursively expand template strings into their resolved values.
 *
 * **Example**
 *
 * ```js
 * cache.process({a: '<%= b %>', b: 'c'});
 * //=> {a: 'c', b: 'c'}
 * ```
 *
 * @param {String} `key`
 * @param {Any} `value`
 */

Config.prototype.process = function process(locals, options) {
  return expander.process(locals, this.merge(locals), options || {});
};


/**
 * ## .remove(key)
 *
 * Remove an element by `key`.
 *
 * **Example**
 *
 * ```js
 * cache.remove('foo');
 * ```
 *
 * @method remove
 * @param {*} `key`
 * @api public
 */

Config.prototype.remove = function remove(key) {
  delete this.cache[key];
};


/**
 * ## .omit ( arguments )
 *
 * Omit properties from the cache.
 *
 * **Example**
 *
 * ```js
 * var cache = new Config();
 * cache
 *   .omit('src');
 *   .omit('src', 'dest');
 *   .omit(['src']);
 *   .omit(['src', 'dest']);
 * ```
 *
 * @chainable
 * @method omit
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.omit = function omit() {
  var args = [].slice.call(arguments);
  var keys = [this.cache].concat(args);
  _.omit.apply(_, keys);
  return this;
};


// Expose `Config`
module.exports = Base.extend(Config.prototype);