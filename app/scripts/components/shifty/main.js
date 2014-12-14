define([

  'lateralus'
  ,'shifty'

], function (

  Lateralus
  ,Tweenable

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
      var newCurveName = 'customCurve' + (++this.customCurveCount);
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
