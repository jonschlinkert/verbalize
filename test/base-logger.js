'use strict';

var capture = require('capture-stream');
var assert = require('assert');
var Base = require('base');
var logger = require('../lib/plugins/base-logger');
var App, app;

describe('base-logger', function() {

  function create() {
    function App(options) {
      if (!(this instanceof App)) {
        return new App(options);
      }
      Base.call(this, null, options);
    }
    Base.extend(App);

    return App;
  }

  beforeEach(function() {
    // ensure prototype is fresh for each test
    App = create();
    app = App();
    app.use(logger());
  });

  it('should create a new instance', function() {
    app = new App();
    assert(app);
    assert.equal(app instanceof App, true);
  });

  it('should create a new instance without using the `new` keyword', function() {
    app = App();
    assert(app);
    assert.equal(app instanceof App, true);
  });

  it('should not redefine logger plugin', function() {
    app.use(logger());
    assert.equal(typeof app.logger, 'function');
  });

  it('should have a _emit method', function() {
    assert.equal(typeof app.logger._emit, 'function');
  });

  it('should have a emit method', function() {
    assert.equal(typeof app.logger.emit, 'function');
  });

  it('should have a on method', function() {
    assert.equal(typeof app.logger.on, 'function');
  });

  it('should have a addLogger method', function() {
    assert.equal(typeof app.logger.addLogger, 'function');
  });

  it('should have a addMode method', function() {
    assert.equal(typeof app.logger.addMode, 'function');
  });

  it('should have a default app.logger `log` method', function() {
    assert.equal(typeof app.logger.log, 'function');
  });

  it('should add a new app.logger method', function() {
    assert.equal(typeof app.logger.foo, 'undefined');
    app.logger.addLogger('foo');
    assert.equal(typeof app.logger.foo, 'function');
  });

  it('should add a new mode method', function() {
    assert.equal(typeof app.logger.bar, 'undefined');
    app.logger.addMode('bar');
    assert.equal(typeof app.logger.bar, 'function');
  });

  it('should emit when adding a new app.logger method', function(cb) {
    app.logger.on('addLogger', function(name, modifier) {
      assert.equal(name, 'foo');
      assert.deepEqual(app.logger.modifiers[name], modifier);
      cb();
    });
    app.logger.addLogger('foo');
  });

  it('should emit when adding a new mode method', function(cb) {
    app.logger.on('addMode', function(name, mode) {
      assert.equal(name, 'bar');
      assert.deepEqual(app.logger.modes[name], mode);
      cb();
    });
    app.logger.addMode('bar');
  });

  it('should chain mode and app.logger methods', function() {
    assert.equal(typeof app.logger.foo, 'undefined');
    assert.equal(typeof app.logger.bar, 'undefined');
    app.logger.addMode('bar');
    assert.equal(typeof app.logger.bar, 'function');
    assert.equal(typeof app.logger.foo, 'undefined');
    app.logger.addLogger('foo');
    assert.equal(typeof app.logger.bar, 'function');
    assert.equal(typeof app.logger.foo, 'function');
    assert.equal(typeof app.logger.bar.foo, 'function');
  });

  it('should allow overwritting set methods', function() {
    assert.equal(typeof app.logger.foo, 'undefined');
    app.logger.addLogger('foo');
    assert.equal(typeof app.logger.foo, 'function');
    app.logger.foo = function(str) {
      console.error(str);
      return this;
    };
    assert.equal(typeof app.logger.foo, 'function');

    var restore = capture(process.stderr);
    app.logger.verbose.foo('foo')
          .not.verbose.foo('bar');
    var output = restore(true);
    assert.equal(output, 'foo\nbar\n');
  });

  it('should allow passing a modifier function when creating a app.logger', function() {
    app.logger.addLogger('foo', function(msg) {
      return '[LOG]: ' + msg;
    });
    assert.equal(typeof app.logger.foo, 'function');
    assert.equal(app.logger.modifiers.foo.fn('foo'), '[LOG]: foo');
  });

  it('should chain modifiers in current stats object when type is modifier', function(cb) {
    app.logger.on('log', function(stats) {
      assert.deepEqual(stats.getModes('name'), ['verbose']);
      assert.deepEqual(stats.getModifiers('name'), ['red', 'log']);
      assert.deepEqual(stats.args, ['foo']);
      cb();
    });
    app.logger.verbose.red.log('foo');
  });

  it('should allow passing a modifier function when defining a mode', function() {
    app.logger.addMode('debug', function(msg) {
      return '[DEBUG]: ' + msg;
    });
    assert.equal(typeof app.logger.debug, 'function');
    assert.equal(app.logger.modes.debug.fn('foo'), '[DEBUG]: foo');
  });

  it('should allow calling a mode function directly', function(cb) {
    app.logger.addMode('debug');
    assert.equal(typeof app.logger.debug, 'function');
    app.logger.on('log', function(stats) {
      assert.deepEqual(stats.getModes('name'), ['debug']);
      assert.deepEqual(stats.getModifiers('name'), ['log']);
      assert.deepEqual(stats.args, ['foo']);
      cb();
    });
    app.logger.debug('foo');
  });

  it('should throw an error when an undefined logger name is given to `_emit`', function(cb) {
    try {
      app.logger._emit('foo', 'bar');
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'Unable to find logger "foo"');
      cb();
    }
  });

  it('should format arguments', function() {
    assert.equal(app.logger._format('%s', 'foo'), 'foo');
  });

  it('should format empty arguments', function() {
    assert.equal(app.logger._format([]), '');
  });

  it('should format and write to stdout', function() {
    var restore = capture(process.stdout);
    app.logger.write('foo');

    var output = restore(true);
    assert.equal(output, 'foo');
  });

  it('should format and write empty string to stdout', function() {
    var restore = capture(process.stdout);
    app.logger.write('');

    var output = restore(true);
    assert.equal(output, '');
  });

  it('should format and writeln to stdout', function() {
    var restore = capture(process.stdout);
    app.logger.writeln('foo');

    var output = restore(true);
    assert.equal(output, 'foo\n');
  });

  it('should format and writeln empty string to stdout', function() {
    var restore = capture(process.stdout);
    app.logger.writeln('');

    var output = restore(true);
    assert.equal(output, '\n');
  });

  it('should stylize a message', function() {
    assert.equal(app.logger.stylize('red', 'red message'), '\u001b[31mred message\u001b[39m');
  });

  it('should not stylize a message when style is not found', function() {
    assert.equal(app.logger.stylize('zebra', 'zebra message'), 'zebra message');
  });

  it('should strip colors from a message when strip color is `true`', function() {
    app.logger.options.stripColor = true;
    assert.equal(app.logger.stylize('red', '\u001b[31mred message\u001b[39m'), 'red message');
  });

  it('should add a separator in string', function() {
    var restore = capture(process.stdout);
    app.logger.writeln('%s %s %s', 'before', app.logger.sep(), 'after');

    var output = restore(true);
    assert.equal(output, 'before \u001b[90m · \u001b[39m after\n');
  });

  it('should add a custom separator in string', function() {
    var restore = capture(process.stdout);
    app.logger.writeln('%s %s %s', 'before', app.logger.sep(' - '), 'after');

    var output = restore(true);
    assert.equal(output, 'before \u001b[90m - \u001b[39m after\n');
  });

  it('should handle a stats object and write formatted output', function() {
    var restore = capture(process.stdout);
    app.logger.info('info message');
    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n');
  });

  it('should handle multiple stats objects with different modes', function() {
    var restore = capture(process.stdout);
    app.logger.info('info message')
      .verbose.error('error message')
      .not.verbose.warn('warn message');

    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n');
  });

  it('should handle multiple stats objects with different modes when verbose is `true`', function() {
    var restore = capture(process.stdout);
    app.logger.options.verbose = true;
    app.logger.info('info message')
      .verbose.error('error message')
      .not.verbose.warn('warn message');

    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n\u001b[31merror message\u001b[39m\n');
  });

  it('should handle multiple stats objects with different modes when verbose is `false`', function() {
    var restore = capture(process.stdout);
    app.logger.options.verbose = false;
    app.logger.info('info message')
      .verbose.error('error message')
      .not.verbose.warn('warn message');

    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n\u001b[33mwarn message\u001b[39m\n');
  });

  it('should handle default styles from styles plugin', function() {
    var restore = capture(process.stdout);
    var time = new Date().toLocaleTimeString();
    app.logger.log('log message');
    app.logger.subhead('subhead message');
    app.logger.time('time message');
    app.logger.timestamp('timestamp message');
    app.logger.inform('inform message');
    app.logger.info('info message');
    app.logger.warn('warn message');
    app.logger.error('error message');
    app.logger.success('success message');

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
    app.logger.use(require('../lib/plugins/rainbow')());
    app.logger.rainbow('rainbow message');

    var output = restore(true);
    assert.equal(output, '\u001b[31mr\u001b[39m\u001b[33ma\u001b[39m\u001b[32mi\u001b[39m\u001b[34mn\u001b[39m\u001b[36mb\u001b[39m\u001b[35mo\u001b[39m\u001b[1mw\u001b[22m \u001b[31mm\u001b[39m\u001b[33me\u001b[39m\u001b[32ms\u001b[39m\u001b[34ms\u001b[39m\u001b[36ma\u001b[39m\u001b[35mg\u001b[39m\u001b[1me\u001b[22m\n');
  });

  it('should disable the default listener', function() {
    app = new App();
    app.use(logger({defaultListener: false}));
    var restore = capture(process.stdout);

    app.logger.error('nothing');
    var output = restore(true);
    assert.equal(output, '');
  });

  it('should be able to log a message directly with the `logger` property', function() {
    var restore = capture(process.stdout);
    app.logger('message');
    var output = restore(true);
    assert.equal(output, '\u001b[1mmessage\u001b[22m\n');
  });

  it('should be able to use logger methods directly on the app to log a message', function() {
    var restore = capture(process.stdout);
    app.info('info message');
    var output = restore(true);
    assert.equal(output, '\u001b[36minfo message\u001b[39m\n');
  });
});
