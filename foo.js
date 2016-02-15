'use strict';

var Verbalize = require('./');
var logger = require('./plugins/event-logger');
var app = new Verbalize();
app.use(logger());

// app.verbose = false;

// app.write('red');
// app.write('blue');
// app.writeln('blue');
// app._formatStyle('red', 'bar');

// logger modes
app.log.modes(['always', 'verbose', 'notverbose']);

// logger operators
app.log.operator('or', function() {
  return this;
});

// log methods
app.log.create('info');
app.log.create('warn');
app.log.create('error');
app.log.create('success');
app.log.create('write');
app.log.create('writeln');

app.options.verbose = true;

// actual logging examples
app.info('this is info');
app.success('this is success');
app.warn('this is warn');
app.error('this is error');
app.write('this is write\n');
app.writeln('this is writeln');

app.info.writeln('this is info');
app.success.writeln('this is success');
app.warn.writeln('this is warn');
app.error.writeln('this is error');

app.verbose.info('this is info');
app.verbose.warn('this is warn');
app.verbose.error('this is error');
app.verbose.write('this is write');
app.verbose.writeln('this is writeln');

app.verbose.warn('this is warn');
app.verbose.error('this is error');
app.verbose.write('this is write');
app.verbose.writeln('this is writeln');

app.verbose.info('this is info').or.notverbose.info('this is not verbose');
app.options.verbose = false;
app.verbose.info('this is info').or.notverbose.info('this is not verbose');
