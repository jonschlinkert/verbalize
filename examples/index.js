'use strict';

var Verbalize = require('../');
var logger = new Verbalize();
logger.on('*', function(name, stats) {
  this.format(stats);
});

logger.use(function(app) {
  app.style('codify', function(msg) {
    var re = /\[([^\]]*\[?[^\]]*\]?[^[]*)\]/g;
    return msg.replace(re, function(str, code) {
      return this.red('`' + code + '`');
    }.bind(this));
  });

  app.emitter('help', function(help) {
    var msg = '\n';
    msg += this.bold('Usage: ') + this.cyan(help.usage) + '\n\n';
    help.commands.forEach(function(command) {
      msg += this.bold(command.name.substr(0, 1).toUpperCase() +
                       command.name.substr(1) + ': ');
      msg += this.bold(command.description) + '\n\n';
    }.bind(this));

    if (help.examples && help.examples.length) {
      msg += this.bold('Examples:\n\n');
      help.examples.forEach(function(example) {
        msg += ' ' + this.gray('# ' + example.description) + '\n';
        msg += ' ' + this.white('$ ' + example.command) + '\n\n';
      }.bind(this));
    }

    if (help.options && help.options.length) {
      msg += this.bold('Options:\n\n');
      help.options.forEach(function(option) {
        msg += ' ' + (option.flag ? this.bold(option.flag) : '  ');
        msg += ' ' + this.bold(option.name);
        msg += ' ' + this.bold(this.codify(option.description)) + '\n';
      }.bind(this));
    }
    return msg;
  });
});

logger.help({
  usage: 'node <example> [options]',
  commands: [
    { name: 'example', description: 'Run the example script' }
  ],
  examples: [
    {
      description: 'run basic example',
      command: 'node examples/example'
    },
    {
      description: 'run verbalize example',
      command: 'node examples/verbalize'
    },
    {
      description: 'run verbalize-extensive example',
      command: 'node examples/verbalize-extensive'
    },
    {
      description: 'run plugin example',
      command: 'node examples/plugin'
    },
    {
      description: 'run plugin-extensive example',
      command: 'node examples/plugin-extensive'
    },
  ],
  options: [
    {
      flag: '-v',
      name: '--verbose  ',
      description: 'Set [options.verbose] to [true] or [false]'
    },
    {
      flag: '-d',
      name: '--debug    ',
      description: 'Set [options.debug] to [true] or [false]'
    },
    {
      flag: '-l',
      name: '--level    ',
      description: 'Set [options.loglevel] to [0, 1, 2, 3, 4 or 5]'
    },
  ]
});
