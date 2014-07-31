# API

```js
var log = new Verbalize({verbose: true});
```

Colors


```js
console.log(log.red('Foo'));
```

Verbose


```js
log.verbose = true;

console.log(log.verbose.red('Foo'));
```


## Levels

 * `silent` (**0**): do not log any messages.
 * `fatal` (**10**): log fatal errors that prevent jsdoc from running
 * `error` (**20**): log all errors, including errors from which jsdoc can recover.
 * `warn` (**30**): log `warn` and `error` messages
 * `info` (**40**): log `info`, `warn` and `error` messages
 * `debug` (**50**): log `debug`, `info`, `warn` and `error` messages
 * `verbose` (**100**): log all messages
