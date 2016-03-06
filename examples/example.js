'use strict';

var Verbalize = require('../');
var rainbow = require('../lib/plugins').rainbow;
var logger = new Verbalize();
logger.use(rainbow());

logger.on('*', function(name, stats) {
  this.handle(stats);
});

logger.write(logger.red('red'));
logger.write(logger.blue('blue'));
logger.writeln(logger.blue('blue'));
logger.writeln(logger.rainbow('rainbow'));
// logger._formatStyle('red', 'bar');

logger.log('foo bar')
