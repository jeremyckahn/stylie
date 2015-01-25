define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'../../constant'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component;

  var ShiftyComponent = Base.extend({
    name: 'shifty'

    ,lateralusEvents: {
      userRequestedNewCurve: function () {
        this.addNewCurve();
      }

      /**
       * @param {{
       *   name: string,
       *   x1: number,
       *   y1: number,
       *   x1: number,
       *   y1: number
       * }} curveObject
       */
      ,setCustomCurve: function (curveObject) {
        this.setCurve(
          curveObject.name
          ,curveObject.x1
          ,curveObject.y1
          ,curveObject.x2
          ,curveObject.y2
        );
      }
      ,userRequestResetAnimation: function () {
        this.resetCustomCurves();
      }
    }

    ,addNewCurve: function () {
      var newCurveName =
        constant.CUSTOM_CURVE_PREFIX + (this.getCustomCurveCount() + 1);
      Tweenable.setBezierFunction(
        newCurveName
        ,0.25
        ,0.5
        ,0.75
        ,0.5
      );

      this.emit('tweenableCurveCreated', newCurveName);
    }

    /**
     * @param {string} name
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     */
    ,setCurve: function (name) {
      Tweenable.setBezierFunction.apply(Tweenable, arguments);
      this.emit('tweenableCurveCreated', name);
    }

    ,resetCustomCurves: function () {
      var customCurveNames = this.getCustomCurveNameList();

      customCurveNames.forEach(function (curveName) {
        Tweenable.unsetBezierFunction(curveName);
        this.emit('unsetBezierFunction', curveName);
      }, this);

      this.addNewCurve();
    }

    /**
     * @return {Array.<string>}
     */
    ,getCustomCurveNameList: function () {
      var curveNames = _.map(Tweenable.prototype.formula,
          function (curve, curveName) {
        return curveName;
      });

      return curveNames.filter(function (curveName) {
        return curveName.match('^custom');
      });
    }

    /**
     * @return {Array.<Function>}
     */
    ,getCustomCurves: function () {
      return _.filter(Tweenable.prototype.formula,
          function (curve, curveName) {
        return curveName.match('^custom');
      });
    }

    /**
     * @return {number}
     */
    ,getCustomCurveCount: function () {
      return this.getCustomCurves().length;
    }
  });

  return ShiftyComponent;
});
