'use strict';

var assert = require('assert');
var Verbalize = require('..');
var logger;

describe('verbalize', function() {
  beforeEach(function() {
    logger = new Verbalize();
  });

  // it('should get and set values.', function() {
  //   logger.set('a', 'b');
  //   assert.equal(logger.get('a'), 'b');
  // });

  it('should .', function() {
    logger.options.stripColor = true;
    logger.info('foo');
    logger.options.stripColor = false;
    logger.info('foo');
  });
});
