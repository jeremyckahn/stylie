define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'../../constant'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,constant

) {
  'use strict';

  var CurveSelectorComponentView = Lateralus.Component.View.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     * @param {boolean=} [options.onlyShowCustomCurves]
     */
    ,initialize: function () {
      this._super('initialize', arguments);
      this.listenFor(
        'tweenableCurveCreated'
        ,this.onTweenableCurveCreated.bind(this)
      );
    }

    ,onTweenableCurveCreated: function () {
      this.render();
    }

    ,render: function () {
      var currentValue = this.$el.val();
      this.renderTemplate();
      this.$el.val(currentValue);
    }

    ,getTemplateRenderData: function () {
      var renderData = this._super('getTemplateRenderData', arguments);

      _.extend(renderData, {
        curves: this.getCurveList()
      });

      return renderData;
    }

    /**
     * @param {Array.<string>}
     */
    ,getCurveList: function () {
      var fullList = Object.keys(Tweenable.prototype.formula);
      return this.onlyShowCustomCurves ?
        fullList.filter(function (curve) {
          return curve.match(constant.CUSTOM_CURVE_PREFIX);
        }) : fullList;
    }
  });

  return CurveSelectorComponentView;
});
