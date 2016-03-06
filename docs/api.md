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

 * `silent` (**-1**): do not log any messages.
 * `fatal` (**0**): log fatal errors that prevent the application from running
 * `error` (**1**): log all errors, including errors from which the application can recover.
 * `success` (**2**): log all `success` and `error` messages
 * `warn` (**3**): log `success`, `warn` and `error` messages
 * `inform` (**4**): log `success`, `inform`, `info`, `warn` and `error` messages
 * `info` (**4**): log `success`, `inform`, `info`, `warn` and `error` messages
 * `debug` (**5**): log `success`, `inform`, `debug`, `info`, `warn` and `error` messages
 * `verbose` (**>5**): log all messages
