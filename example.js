'use strict';

var logger = require('./plugins/base-logger');
var Base = require('base');
var base = new Base();

base.use(logger());

base.log('foo');
base.verbose('foo');
base.log.verbose('foo');

base.log.info('foo');
base.log.success('foo');
base.log.error('foo');
base.log.warn('foo');

base.verbose.info('foo');
base.verbose.success('foo');
base.verbose.error('foo');
base.verbose.warn('foo');

base.log.verbose.info('foo');
base.log.verbose.success('foo');
base.log.verbose.error('foo');
base.log.verbose.warn('foo');
