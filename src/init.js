require(['src/ease'], function (ease) {
  // Fancy schmancy way of getting global scope.
  var global;
  (function () { global = this; } (null));

  global.app = {};
});
