'use strict';

var Verbalize = require('../');
var logger = new Verbalize();
logger.on('*', function(name, stats) {
  this.format(stats);
});

// use a custom plugin to add "help text" styles and emitters
logger.use(helpPlugin());

// log the help text object contained in a separate file
logger.help(require('./help-text'));

/**
 * This plugin adds styles and emitters to make it
 * easier to log out help text
 */

function helpPlugin() {
  return function(app) {

    // style to turn `[ ]` strings into
    // colored strings with backticks
    app.style('codify', function(msg) {
      var re = /\[([^\]]*\[?[^\]]*\]?[^[]*)\]/g;
      return msg.replace(re, function(str, code) {
        return this.red('`' + code + '`');
      }.bind(this));
    });

    // style and format a single help command
    app.style('helpCommand', function(command) {
      var msg = '';
      msg += this.bold(command.name.substr(0, 1).toUpperCase() +
                       command.name.substr(1) + ': ');
      msg += this.bold(command.description);
      return msg;
    });

    // style and format an array of help commands
    app.style('helpCommands', function(commands) {
      return commands
        .map(this.helpCommand)
        .join('\n\n');
    });

    // style and format a single example
    app.style('helpExample', function(example) {
      var msg = '';
      msg += ' ' + this.gray('# ' + example.description) + '\n';
      msg += ' ' + this.white('$ ' + example.command);
      return msg;
    });

    // style and format an array of examples
    app.style('helpExamples', function(examples) {
      return examples
        .map(this.helpExample)
        .join('\n\n');
    });

    // style and format a single option
    app.style('helpOption', function(option) {
      var msg = '';
      msg += ' ' + (option.flag ? this.bold(option.flag) : '  ');
      msg += ' ' + this.bold(option.name);
      msg += ' ' + this.bold(this.codify(option.description));
      return msg;
    });

    // style and format an array of options
    app.style('helpOptions', function(options) {
      return options
        .map(this.helpOption)
        .join('\n');
    });

    // style and formation a help text object using
    // other styles to break up responibilities
    app.emitter('help', function(help) {
      var msg = '\n';
      msg += this.bold('Usage: ') + this.cyan(help.usage) + '\n\n';
      msg += this.helpCommands(help.commands);

      if (help.examples && help.examples.length) {
        msg += this.bold('Examples:\n\n');
        msg += this.helpExamples(help.examples);
      }

      if (help.options && help.options.length) {
        msg += this.bold('Options:\n\n');
        msg += this.helpOptions(help.options);
      }
      return msg + '\n';
    });
  };
}
