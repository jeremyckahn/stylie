define([

  'lateralus'
  ,'shifty'

  ,'../../constant'

], function (

  Lateralus
  ,Tweenable

  ,constant

) {
  'use strict';

  var ShiftyComponent = Lateralus.Component.extend({
    name: 'shifty'

    ,initialize: function () {
      this.customCurveCount = 0;

      this.listenFor(
        'userRequestedNewCurve', this.onUserRequestedNewCurve.bind(this));
    }

    ,onUserRequestedNewCurve: function () {
      this.createNewCurve();
    }

    ,createNewCurve: function () {
      var newCurveName =
        constant.CUSTOM_CURVE_PREFIX + (++this.customCurveCount);
      Tweenable.setBezierFunction(
        newCurveName
        ,0.25
        ,0.5
        ,0.75
        ,0.6
      );

      this.emit('tweenableCurveCreated', newCurveName);
    }
  });

  return ShiftyComponent;
});
