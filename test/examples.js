var _ = require('lodash');
var Verbalize = require('../');
var logger = new Verbalize({verbose: false, sep: ' :: '});

var keys = _.methods(logger);

logger.set('runner', {
  name: 'Verbalize',
  url: 'https://github.com/jonschlinkert/verbalize'
});

console.log(logger.get('runner'));


// console.log(logger)
// logger.mode('verbose');

// logger.run('foo');
// logger.success('foo');
logger.error('foo');

logger.stripColor = false;
logger.disable('stripColor');
// logger.enable('stripColor');
logger.info('foo');
logger.info('foo');

var msg = [
  'one',
  'two',
  'three'
].join('\n');
// logger.warn('foo', msg, logger.sep());


var colors = [
  'bgBlack',
  'bgBlue',
  'bgCyan',
  'bgGreen',
  'bgMagenta',
  'bgRed',
  'bgWhite',
  'bgYellow',
  'black',
  'blue',
  'bold',
  'cyan',
  'gray',
  'green',
  'grey',
  'inverse',
  'italic',
  'magenta',
  'red',
  'reset',
  'strikethrough',
  'underline',
  'white',
  'yellow'
];


var exclude = [
  '_colors',
  '_addRunner',
  '_format',
  '_formatStyles',
  '_mode',
  '_write',
  '_writeln',
  'fatal',
  'format',
  'get',
  'keys',
  'mode',
  'omit',
  'options',
  'sep',
  'set',
  'verbose'
];

var styles = _.difference(keys, colors, exclude);

_.forEach(styles, function (style) {
  logger[style]('This is style: ' + style);
});


// _.forEach(colors, function (color) {
//   console.log('This is color:', logger[color](color));
// });


// if (logger._mode === 'verbose') {
//   _.forEach(colors, function (color) {
//     console.log('This is color:', logger.verbose[color](color), 'in verbose mode.');
//   });

//   _.forEach(styles, function (style) {
//     console.log('This is style:', logger.verbose[style](style), 'in verbose mode.');
//   });
// }
