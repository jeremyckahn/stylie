define(function () {

  var utils = {};

  utils.init = function (app) {

    app.util.pxToNumber = function (px) {
      return +(px.replace('px', ''));
    };

    app.util.trimString = function (str) {
      return str.replace(/^\s*|\s*$/g, '');
    };

    app.util.moveLastKeyframe = function (actor, toMillisecond) {
      var toMillisecond = +toMillisecond;
      var trackNames = actor.getTrackNames();
      var lastFrameIndex = actor.getTrackLength(trackNames[0]) - 1;

      _.each(trackNames, function (trackName) {
        actor.modifyKeyframeProperty(trackName, lastFrameIndex, {
            'millisecond': toMillisecond
          });
      });

      actor.kapi._recalculateAnimationLength();
      app.config.animationDuration = toMillisecond;
    };

    app.util.getFormulaFromEasingFunc = function (fn) {
      var fnString = fn.toString().replace('\n', ''); // An effin' string
      var deprefixed = fnString.replace(/.*return\s*/g, '');
      var desuffixed = deprefixed.replace(/\}|;\s*}$/g, '');
      return desuffixed;
    };

  };

  return utils;

});
