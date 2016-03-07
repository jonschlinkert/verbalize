'use strict';

/**
 * Help text object that's used in the `examples/index.js`
 * so show help for running the other examples.
 */

module.exports = {
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
};
