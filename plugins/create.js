
module.exports = function(options) {
  return function(app) {
    this.define('create', function(name, keys) {
      if (typeof keys === 'string') {
        keys = keys.split('.');
      }
      var fn = function(msg) {
        var len = keys.length;
        var idx = -1;
        while (++idx < len) {
          var key = keys[idx];
          msg = addStyle(this[key].style, msg);
        }
        return msg;
      }.bind(this);

      this[name] = fn;
      return fn;
    });
  };
};

styles.create('yeller', 'bold.yellow');
console.log(styles.yeller('foofoofo'))
