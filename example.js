'use strict';

var Verbalize = require('./');
var rainbow = require('./plugins/rainbow');
var logger = new Verbalize();
logger.use(rainbow());

logger.verbose = false;

logger.write('red');
logger.write('blue');
logger.writeln('blue');
logger.rainbow('blue');
// logger._formatStyle('red', 'bar');

