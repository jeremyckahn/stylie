require(['src/css-gen', 'src/ease'], function () {
  // Fancy schmancy way of getting global scope.
  var global;
  (function () { global = this; } (null));

  global.app = {};
});
