'use strict';

var capture = require('capture-stream');
var assert = require('assert');
var Verbalize = require('..');
var logger;

describe('verbalize', function() {
  beforeEach(function() {
    // ensure prototype is fresh for each test
    var Logger = Verbalize.create();
    logger = Logger();
  });

  it('should create a new instance', function() {
    logger = new Verbalize();
    assert(logger);
    assert.equal(logger instanceof Verbalize, true);
  });

  it('should create a new instance without using the `new` keyword', function() {
    logger = Verbalize();
    assert(logger);
    assert.equal(logger instanceof Verbalize, true);
  });

  it('should have a _emit method', function() {
    assert.equal(typeof logger._emit, 'function');
  });

  it('should have a emit method', function() {
    assert.equal(typeof logger.emit, 'function');
  });

  it('should have a on method', function() {
    assert.equal(typeof logger.on, 'function');
  });

  it('should have a addLogger method', function() {
    assert.equal(typeof logger.addLogger, 'function');
  });

  it('should have a addMode method', function() {
    assert.equal(typeof logger.addMode, 'function');
  });

  it('should have a default logger `log` method', function() {
    assert.equal(typeof logger.log, 'function');
  });

  it('should add a new logger method', function() {
    assert.equal(typeof logger.foo, 'undefined');
    logger.addLogger('foo');
    assert.equal(typeof logger.foo, 'function');
  });

  it('should add a new mode method', function() {
    assert.equal(typeof logger.bar, 'undefined');
    logger.addMode('bar');
    assert.equal(typeof logger.bar, 'function');
  });

  it('should emit when adding a new logger method', function(cb) {
    logger.on('addLogger', function(name, modifier) {
      assert.equal(name, 'foo');
      assert.deepEqual(logger.modifiers[name], modifier);
      cb();
    });
    logger.addLogger('foo');
  });

  it('should emit when adding a new mode method', function(cb) {
    logger.on('addMode', function(name, mode) {
      assert.equal(name, 'bar');
      assert.deepEqual(logger.modes[name], mode);
      cb();
    });
    logger.addMode('bar');
  });

  it('should chain mode and logger methods', function() {
    assert.equal(typeof logger.foo, 'undefined');
    assert.equal(typeof logger.bar, 'undefined');
    logger.addMode('bar');
    assert.equal(typeof logger.bar, 'function');
    assert.equal(typeof logger.foo, 'undefined');
    logger.addLogger('foo');
    assert.equal(typeof logger.bar, 'function');
    assert.equal(typeof logger.foo, 'function');
    assert.equal(typeof logger.bar.foo, 'function');
  });

  it('should allow overwritting set methods', function() {
    assert.equal(typeof logger.foo, 'undefined');
    logger.addLogger('foo');
    assert.equal(typeof logger.foo, 'function');
    logger.foo = function(str) {
      console.error(str);
      return this;
    };
    assert.equal(typeof logger.foo, 'function');

    var restore = capture(process.stderr);
    logger.verbose.foo('foo')
          .not.verbose.foo('bar');
    var output = restore(true);
    assert.equal(output, 'foo\nbar\n');
  });

  it('should allow passing a modifier function when creating a logger', function() {
    logger.addLogger('foo', function(msg) {
      return '[LOG]: ' + msg;
    });
    assert.equal(typeof logger.foo, 'function');
    assert.equal(logger.modifiers.foo.fn('foo'), '[LOG]: foo');
  });

  it('should chain modifiers in current stats object when type is modifier', function(cb) {
    logger.on('log', function(stats) {
      assert.deepEqual(stats.getModes('name'), ['verbose']);
      assert.deepEqual(stats.getModifiers('name'), ['red', 'log']);
      assert.deepEqual(stats.args, ['foo']);
      cb();
    });
    logger.verbose.red.log('foo');
  });

  it('should allow passing a modifier function when defining a mode', function() {
    logger.addMode('debug', function(msg) {
      return '[DEBUG]: ' + msg;
    });
    assert.equal(typeof logger.debug, 'function');
    assert.equal(logger.modes.debug.fn('foo'), '[DEBUG]: foo');
  });

  it('should allow calling a mode function directly', function(cb) {
    logger.addMode('debug');
    assert.equal(typeof logger.debug, 'function');
    logger.on('log', function(stats) {
      assert.deepEqual(stats.getModes('name'), ['debug']);
      assert.deepEqual(stats.getModifiers('name'), ['log']);
      assert.deepEqual(stats.args, ['foo']);
      cb();
    });
    logger.debug('foo');
  });

  it('should throw an error when an undefined logger name is given to `_emit`', function(cb) {
    try {
      logger._emit('foo', 'bar');
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'Unable to find logger "foo"');
      cb();
    }
  });

  it('should format arguments', function() {
    assert.equal(logger._format('%s', 'foo'), 'foo');
  });

  it('should format empty arguments', function() {
    assert.equal(logger._format([]), '');
  });

  it('should format and write to stdout', function() {
    var restore = capture(process.stdout);
    logger.write('foo');

    var output = restore(true);
    assert.equal(output, 'foo');
  });

  it('should format and write empty string to stdout', function() {
    var restore = capture(process.stdout);
    logger.write('');

    var output = restore(true);
    assert.equal(output, '');
  });

  it('should format and writeln to stdout', function() {
    var restore = capture(process.stdout);
    logger.writeln('foo');

    var output = restore(true);
    assert.equal(output, 'foo\n');
  });

  it('should format and writeln empty string to stdout', function() {
    var restore = capture(process.stdout);
    logger.writeln('');

    var output = restore(true);
    assert.equal(output, '\n');
  });

  it('should stylize a message', function() {
    assert.equal(logger.stylize('red', 'red message'), '\u001b[31mred message\u001b[39m');
  });

  it('should not stylize a message when style is not found', function() {
    assert.equal(logger.stylize('zebra', 'zebra message'), 'zebra message');
  });

  it('should strip colors from a message when strip color is `true`', function() {
    logger.options.stripColor = true;
    assert.equal(logger.stylize('red', '\u001b[31mred message\u001b[39m'), 'red message');
  });

  it('should add a separator in string', function() {
    var restore = capture(process.stdout);
    logger.writeln('%s %s %s', 'before', logger.sep(), 'after');

    var output = restore(true);
    assert.equal(output, 'before \u001b[90m · \u001b[39m after\n');
  });

  it('should add a custom separator in string', function() {
    var restore = capture(process.stdout);
    logger.writeln('%s %s %s', 'before', logger.sep(' - '), 'after');

    var output = restore(true);
    assert.equal(output, 'before \u001b[90m - \u001b[39m after\n');
  });

  it('should handle a stats object and write formatted output', function() {
    var restore = capture(process.stdout);
    logger.on('*', function(name, stats) {
      this.handle(stats);
    });

    logger.info('info message');
    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n');
  });

  it('should handle multiple stats objects with different modes', function() {
    var restore = capture(process.stdout);
    logger.on('*', function(name, stats) {
      this.handle(stats);
    });

    logger.info('info message')
      .verbose.error('error message')
      .not.verbose.warn('warn message');

    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n');
  });

  it('should handle multiple stats objects with different modes when verbose is `true`', function() {
    var restore = capture(process.stdout);
    logger.on('*', function(name, stats) {
      this.handle(stats);
    });

    logger.options.verbose = true;
    logger.info('info message')
      .verbose.error('error message')
      .not.verbose.warn('warn message');

    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n\u001b[31merror message\u001b[39m\n');
  });

  it('should handle multiple stats objects with different modes when verbose is `false`', function() {
    var restore = capture(process.stdout);
    logger.on('*', function(name, stats) {
      this.handle(stats);
    });

    logger.options.verbose = false;
    logger.info('info message')
      .verbose.error('error message')
      .not.verbose.warn('warn message');

    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n\u001b[33mwarn message\u001b[39m\n');
  });

  it('should handle default styles from styles plugin', function() {
    var restore = capture(process.stdout);
    logger.on('*', function(name, stats) {
      this.handle(stats);
    });

    var time = new Date().toLocaleTimeString();
    logger.log('log message');
    logger.subhead('subhead message');
    logger.time('time message');
    logger.timestamp('timestamp message');
    logger.inform('inform message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');
    logger.success('success message');

    var output = restore(true);
    assert.equal(output, [
      '\u001b[1mlog message\u001b[22m',
      '\u001b[1msubhead message\u001b[22m',
      '\u001b[40m\u001b[37m' + time + '\u001b[39m\u001b[49m ',
      '\u001b[40m\u001b[37m' + time + '\u001b[39m\u001b[49m \u001b[90mtimestamp message\u001b[39m',
      '\u001b[90minform message\u001b[39m',
      '\u001b[36minfo message\u001b[39m',
      '\u001b[33mwarn message\u001b[39m',
      '\u001b[31merror message\u001b[39m',
      '\u001b[32msuccess message\u001b[39m',
      ''
    ].join('\n'));
  });

  it('should handle plugin styles', function() {
    var restore = capture(process.stdout);
    logger.on('*', function(name, stats) {
      this.handle(stats);
    });

    logger.use(require('../lib/plugins/rainbow')());
    logger.rainbow('rainbow message');

    var output = restore(true);
    assert.equal(output, '\u001b[31mr\u001b[39m\u001b[33ma\u001b[39m\u001b[32mi\u001b[39m\u001b[34mn\u001b[39m\u001b[36mb\u001b[39m\u001b[35mo\u001b[39m\u001b[1mw\u001b[22m \u001b[31mm\u001b[39m\u001b[33me\u001b[39m\u001b[32ms\u001b[39m\u001b[34ms\u001b[39m\u001b[36ma\u001b[39m\u001b[35mg\u001b[39m\u001b[1me\u001b[22m\n');
  });
});
