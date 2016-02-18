app
  .verbose.underline.not.error
  .verbose.bold.warn('some message')
  .not.verbose.info('extra info')
  .not.verbose.success('extra info');

function isVerbose(app, obj) {

}

app.on('*', function(name, obj) {
  // should this log?
  if (obj.log) {
    console.log('foo');
  }
})

app.on('warn', function(obj) {
  // should this log?
  if (obj.log) {
    console.log('warn');
  }
})

app.on('level:1', function(obj) {
  // should this log?
  if (obj.log) {
    console.log('warn');
  }
})

[
  {
    mode: 'verbose',
    style: ['underline', 'not.error'],
    name: 'error',
    args: ['some message'],
    level: 1,
    template: '<%= foo %>'
  },
  {
    mode: 'verbose',
    style: ['bold', 'warn'],
    name: 'warn',
    level: 2,
    args: ['some message']
  }
]

[
  {
    mode: 'notverbose',
    style: ['info'],
    name: 'info',
    level: 3,
    args: ['extra info']
  }
]


function Logger() {}

function Level() {}
