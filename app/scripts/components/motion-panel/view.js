define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'stylie.component.curve-selector'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,CurveSelectorComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var MotionPanelComponentView = Base.extend({
    template: template

    ,events: {
      'click .add-curve': function () {
        this.emit('userRequestedNewCurve');
      }

      ,'change .center-to-path': function () {
        this.emit('updateCenteringSetting', this.$centerToPath.is(':checked'));
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.addSubview(CurveSelectorComponent.View, {
        el: this.$curveSelector
        ,onlyShowCustomCurves: true
      });
    }

    /**
     * @param {string} curveName
     */
    ,selectCurve: function (curveName) {
      this.$curveSelector.val(curveName);
      var curveFn = Tweenable.prototype.formula[curveName];
      this.component.bezierizerComponent.model.set(
          _.pick(curveFn, 'x1', 'y1', 'x2', 'y2'));
    }

    /**
     * @return {boolean|undefined}
     */
    ,getIterations: function () {
      var iterationValue = +this.$iterations.val();
      return isNaN(iterationValue) ? undefined : iterationValue;
    }

    /**
     * @return {{
     *   isCentered: boolean,
     *   iterations: boolean|undefined
     * }}
     */
    ,toJSON: function () {
      return {
        isCentered: this.$centerToPath.is(':checked')
        ,iterations: this.getIterations()
      };
    }
  });

  return MotionPanelComponentView;
});
