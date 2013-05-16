define(function () {

  var utils = {};

  utils.init = function (app) {

    app.util.pxToNumber = function (px) {
      return parseInt(px, 10);
    };

    app.util.trimString = function (str) {
      return str.replace(/^\s*|\s*$/g, '');
    };

    app.util.getQueryParams = function () {
      var queryString = window.location.search.slice(1);
      var pairs = queryString.split('&');
      var params = {};

      _.each(pairs, function (pair) {
        var splitPair = pair.split('=');
        params[splitPair[0]] = splitPair[1];
      });

      return params;
    };

    app.util.getRotation = function ($el) {
      // Need to read the style attribute here, not the CSS transform property.
      // $.fn.css returns the transform info in matrix format, which is harder to
      // work with.
      return parseFloat($el.attr('style').match(/rotate\((-*\d+)deg\)/)[1]);
    };

    app.util.moveLastKeyframe = function (actor, toMillisecond) {
      toMillisecond = +toMillisecond;
      var trackNames = actor.getTrackNames();
      var lastFrameIndex = actor.getTrackLength(trackNames[0]) - 1;

      _.each(trackNames, function (trackName) {
        actor.modifyKeyframeProperty(trackName, lastFrameIndex, {
            'millisecond': toMillisecond
          });
      });

      app.config.animationDuration = toMillisecond;
    };

    app.util.getFormulaFromEasingFunc = function (fn) {
      var fnString = fn.toString().replace('\n', ''); // An effin' string
      var deprefixed = fnString.replace(/.*return\s*/g, '');
      var desuffixed = deprefixed.replace(/\}|;\s*\}$/g, '');
      return desuffixed;
    };

  };

  return utils;

});
