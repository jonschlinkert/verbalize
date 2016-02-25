'use strict';

var assert = require('assert');
var utils = require('../lib/utils');

describe('utils', function() {
  describe('toArray', function() {
    it('should coerce a string into an array', function() {
      assert.deepEqual(utils.toArray('foo'), ['foo']);
    });

    it('should coerce an arguments object into an array', function() {
      function run() {
        assert.deepEqual(utils.toArray(arguments), ['foo', 'bar', 'baz']);
      }
      run('foo', 'bar', 'baz');
    });

    it('should use own arguments when args are not a string or an arguments object', function() {
      assert.deepEqual(utils.toArray('foo', ['bar'], 'baz'), ['foo', 'bar', 'baz']);
    });
  });

  describe('arrayify', function() {
    it('should return an empty array for undefined values', function() {
      assert.deepEqual(utils.arrayify(undefined), []);
    });

    it('should return the original value if val is an array', function() {
      assert.deepEqual(utils.arrayify(['foo']), ['foo']);
    });

    it('should return the array of values if val is not an array', function() {
      assert.deepEqual(utils.arrayify('foo'), ['foo']);
    });
  });

  describe('toString', function() {
    it('should return an empty string for undefined values', function() {
      assert.deepEqual(utils.toString(null), '');
    });

    it('should return the original value if val is string', function() {
      assert.deepEqual(utils.toString('foo'), 'foo');
    });

    it('should return the string value if val is not a string', function() {
      assert.deepEqual(utils.toString(['foo', 'bar', 'baz']), 'foo,bar,baz');
    });
  });

  describe('toBold', function() {
    it('should return bold ansi codes', function() {
      assert.equal(utils.toBold('**foo**'), '\u001b[1mfoo\u001b[22m');
      assert.equal(utils.toBold('a/**foo**/b'), 'a/**foo**/b');
      assert.equal(utils.toBold('a **foo** b'), 'a \u001b[1mfoo\u001b[22m b');
      assert.equal(utils.toBold('a **foo* b'), 'a \u001b[1m*foo\u001b[22m b');
      assert.equal(utils.toBold('a *foo** b'), 'a \u001b[1mfoo*\u001b[22m b');
      assert.equal(utils.toBold('a *foo* b'), 'a \u001b[1mfoo\u001b[22m b');
      assert.equal(utils.toBold('aa*foo*bb'), 'aa*foo*bb');
      assert.equal(utils.toBold('*aa*foo*bb*'), '\u001b[1maa*foo*bb\u001b[22m');
      assert.equal(utils.toBold('* aa*foo*bb *'), '* aa*foo*bb *');
    });
  });

  describe('toUnderline', function() {
    it('should return underline ansi codes', function() {
      assert.equal(utils.toUnderline('__foo__'), '\u001b[4mfoo\u001b[24m');
      assert.equal(utils.toUnderline('a/__foo__/b'), 'a/__foo__/b');
      assert.equal(utils.toUnderline('a __foo_ b'), 'a \u001b[4m_foo\u001b[24m b');
      assert.equal(utils.toUnderline('a __foo__ b'), 'a \u001b[4mfoo\u001b[24m b');
      assert.equal(utils.toUnderline('a _foo_ b'), 'a \u001b[4mfoo\u001b[24m b');
      assert.equal(utils.toUnderline('aa_foo_bb'), 'aa_foo_bb');
    });
  });

  describe('markup', function() {
    it('should convert markdown styles to ansi styles', function() {
      assert.equal(utils.markup('a *_foo_* b'), 'a \u001b[1m\u001b[4mfoo\u001b[24m\u001b[22m b');
      assert.equal(utils.markup('a _*foo*_ b'), 'a \u001b[4m\u001b[1mfoo\u001b[22m\u001b[24m b');
    });
  });

  describe('isFalsey', function() {
    it('should return `false` for none falsey values', function() {
      assert.equal(utils.isFalsey(true), false);
      assert.equal(utils.isFalsey('true'), false);
    });

    it('should return `true` for falsey values', function() {
      assert.equal(utils.isFalsey(false), true);
      assert.equal(utils.isFalsey('false'), true);
      assert.equal(utils.isFalsey('no'), true);
      assert.equal(utils.isFalsey('not'), true);
    });

    it('should allow custom keywords', function() {
      var opts = {
        keywords: ['foo', 'bar']
      };
      assert.equal(utils.isFalsey('foo'), false);
      assert.equal(utils.isFalsey('bar'), false);

      assert.equal(utils.isFalsey('foo', opts), true);
      assert.equal(utils.isFalsey('bar', opts), true);
    });
  });
});
