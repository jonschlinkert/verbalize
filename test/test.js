/*!
 * verbalize <https://github.com/jonschlinkert/verbalize>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

var should = require('should');
var Verbalize = require('../');

describe('verbalize:', function () {
  var logger;
  beforeEach(function() {
    logger = new Verbalize();
  });

  it('should get and set values.', function () {
    logger.set('a', 'b');
    expect(logger.get('a')).to.eql('b');
  });

  it('should .', function () {
    // logger.enable('stripColor');
    // logger.info('foo');
    // logger.disable('stripColor');
    // logger.info('foo');
    // expect(logger.option('a')).to.eql('b');
  });
});