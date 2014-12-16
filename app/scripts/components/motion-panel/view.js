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

  var MotionPanelComponentView = Lateralus.Component.View.extend({
    template: template

    ,events: {
      'click .add-curve': 'onClickAddCurve'
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);
      this.addSubview(CurveSelectorComponent.View, {
        el: this.$curveSelector
        ,onlyShowCustomCurves: true
      });
    }

    ,onClickAddCurve: function () {
      this.emit('userRequestedNewCurve');
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
  });

  return MotionPanelComponentView;
});
