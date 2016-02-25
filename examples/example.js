'use strict';

var Verbalize = require('../');
var rainbow = require('../lib/plugins').rainbow;
var logger = new Verbalize();
logger.use(rainbow());

logger.on('*', function(name, stats) {
  this.handle(stats);
});

logger.write('red');
logger.write('blue');
logger.writeln('blue');
logger.rainbow('rainbow');
// logger._formatStyle('red', 'bar');

logger.log('foo bar')
