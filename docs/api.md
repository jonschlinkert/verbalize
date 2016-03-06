## Usage

```js
var logger = new Verbalize();
```

### Write

```js
logger.write('foo');
logger.writeln('bar');
```

### Colors

```js
logger.writeln(logger.red('foo'));
```

### Styles

```js
logger.writeln(logger.underline('foo'));
```

### Emitters

```js
logger.info('foo');
```

### Modes

```js
logger.options.verbose = true;
logger.verbose.info('foo');
```

```js
logger.options.verbose = false;
logger.not.verbose.error('foo');
```

### Levels

 * `silent` (**0**): do not log any messages.
 * `fatal` (**1**): log fatal errors that prevent the application from running
 * `error` (**2**): log all errors, including errors from which the application can recover.
 * `warn` (**3**): log `warn` and `error` messages
 * `info` (**4**): log `info`, `warn` and `error` messages
 * `debug` (**5**): log `debug`, `info`, `warn` and `error` messages
 * `verbose` (**>5**): log all messages
