define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.bezierizer'

], function (

  Lateralus

  ,View
  ,template

  ,BezierizerComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var MotionPanelComponent = Base.extend({
    name: 'motion-panel'
    ,View: View
    ,template: template

    ,initialize: function () {
      this.bezierizerComponent = this.addComponent(BezierizerComponent, {
        el: this.view.$bezierizer
      });

      this.listenFor(
        'tweenableCurveCreated'
        ,this.onTweenableCurveCreated.bind(this)
      );
    }

    /**
     * @param {string} curveName
     */
    ,onTweenableCurveCreated: function (curveName) {
      this.view.selectCurve(curveName);
    }

    /**
     * @return {{
     *   isCentered: boolean,
     *   iterations: boolean|undefined
     * }}
     */
    ,toJSON: function () {
      return this.view.toJSON();
    }
  });

  return MotionPanelComponent;
});
