'use strict';

var utils = require('../lib/utils');

describe('utils', function() {
  it.skip('should ', function() {
    console.log(utils.toBold('**foo**'));
    console.log(utils.toBold('a/**foo**/b'));
    console.log(utils.toBold('a **foo** b'));
    console.log(utils.toBold('a **foo* b'));
    console.log(utils.toBold('a *foo** b'));
    console.log(utils.toBold('a *foo* b'));
    console.log(utils.toBold('aa*foo*bb'));
    console.log(utils.toBold('*aa*foo*bb*'));
    console.log(utils.toBold('* aa*foo*bb *'));

    console.log(utils.toUnderline('__foo__'));
    console.log(utils.toUnderline('a/__foo__/b'));
    console.log(utils.toUnderline('a __foo_ b'));
    console.log(utils.toUnderline('a __foo__ b'));
    console.log(utils.toUnderline('a _foo_ b'));
    console.log(utils.toUnderline('aa_foo_bb'));


    console.log(utils.toBold(utils.toUnderline('a *_foo_* b')));
    console.log(utils.toBold(utils.toUnderline('a _*foo*_ b')));
  });
});
