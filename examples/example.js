'use strict';

var Verbalize = require('../');
var rainbow = require('../plugins/rainbow');
var logger = new Verbalize();
logger.use(rainbow());
logger.verbose = false;

logger.on('*', function(stats) {
  this.handle(stats);
});

logger.write('red');
logger.write('blue');
logger.writeln('blue');
logger.rainbow('rainbow');
// logger._formatStyle('red', 'bar');

logger.log('foo bar')
