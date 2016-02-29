# verbalize [![NPM version](https://img.shields.io/npm/v/verbalize.svg)](https://www.npmjs.com/package/verbalize) [![Build Status](https://img.shields.io/travis/jonschlinkert/verbalize.svg)](https://travis-ci.org/jonschlinkert/verbalize)

> A pluggable logging utility with built-in colors, styles, and modes.

## TOC
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Related projects](#related-projects)
- [Contributing](#contributing)
- [Building docs](#building-docs)
- [Running tests](#running-tests)
- [Author](#author)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## Install
Install with [npm](https://www.npmjs.com/):

```sh
$ npm install verbalize --save
```

## Usage

```js
var Verbalize = require('verbalize');
```

## API

### [Verbalize](index.js#L30)
Create an instance of `Verbalize` with the given `options`.

**Params**

* `options` **{Object}**    

**Example**

```js
var logger = new Verbalize({verbose: true});
```

### [._format](index.js#L67)

Base formatting.

* `returns` **{String}** `msg`  

### [._write](index.js#L83)

Write to the console.

* `returns` **{String}** `msg`  

### [._writeln](index.js#L96)

Write to the console followed by a newline. A blank
line is returned if no value is passed.

* `returns` **{String}** `msg`  

### [.write](index.js#L107)

Write formatted output.

* `returns` **{String}**  

### [.writeln](index.js#L118)

Write formatted output followed by a newline.

* `returns` **{String}**  

### [.sep](index.js#L129)

Style a basic separator.

* `returns` **{String}**  

### [.stylize](index.js#L142)

Stylize the given `msg` with the specified `color`.

**Params**

* `color` **{String}**: The name of the color to use    
* `msg` **{String}**: The args to stylize.    
* `returns` **{String}**  

### [.style](index.js#L185)
Add a style logger.

**Params**

* `name` **{String}**: Name of style logger method to be added to the logger.    
* `options` **{Object}**: Options to control style logger method.    
* `fn` **{Function}**: Optional function to do the styling.    
* `returns` **{Object}** `this`: for chaining.  

**Example**

```js
logger.style('red', function() {
  return this.stylize('red', arguments);
});
```

### [.define](index.js#L203)

Define non-enumerable property `key` with the given value.

**Params**

* `key` **{String}**    
* `value` **{any}**    
* `returns` **{String}**  

### [Verbalize.create](index.js#L230)
Static method to create a new constructor. This is useful in tests and places where the original prototype should not be updated.

**Example**

```js
var MyLogger = Verbalize.create();
var logger = new MyLogger();
```

## Related projects

* [base](https://www.npmjs.com/package/base): base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting… [more](https://www.npmjs.com/package/base) | [homepage](https://github.com/node-base/base)
* [base-logger](https://www.npmjs.com/package/base-logger): Add a verbalize logger to your base application. | [homepage](https://github.com/node-base/base-logger)
* [log-events](https://www.npmjs.com/package/log-events): Create custom, chainable logging methods that emit log events when called. | [homepage](https://github.com/doowb/log-events)

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/verbalize/issues/new).

## Building docs
Generate readme and API documentation with [verb][]:

```sh
$ npm install verb && npm run docs
```

Or, if [verb][] is installed globally:

```sh
$ verb
```

## Running tests
Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author
**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright © 2016 [Jon Schlinkert](https://github.com/jonschlinkert)
Released under the [MIT license](https://github.com/jonschlinkert/verbalize/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on February 29, 2016._

[strip-ansi]: https://github.com/chalk/strip-ansi

