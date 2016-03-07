'use strict';

var Base = require('base');
var option = require('base-option');

var logger = require('base-logger');
var base = new Base(null, {logger: true});

base.use(option());
base.use(logger());

// base.option('verbose', true);

base.logger('logger: foo');
base.verbose('verbose: foo');
base.logger.verbose('logger.verbose: foo');

base.logger.info('logger.info: foo');
base.logger.success('logger.success: foo');
base.logger.error('logger.error: foo');
base.logger.warn('logger.warn: foo');

base.verbose.info('verbose.info: foo');
base.verbose.success('verbose.success: foo');
base.verbose.error('verbose.error: foo');
base.verbose.warn('verbose.warn: foo');

base.logger.verbose.info('logger.verbose.info: foo');
base.logger.verbose.success('logger.verbose.success: foo');
base.logger.verbose.error('logger.verbose.error: foo');
base.logger.verbose.warn('logger.verbose.warn: foo');

base.logger.not.verbose('logger.not.verbose: foo');
base.logger.not.verbose.info('logger.not.verbose.info: foo');
base.logger.not.verbose.success('logger.not.verbose.success: foo');
base.logger.not.verbose.error('logger.not.verbose.error: foo');
base.logger.not.verbose.warn('logger.not.verbose.warn: foo');
