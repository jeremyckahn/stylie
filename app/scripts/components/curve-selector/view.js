define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

) {
  'use strict';

  var CurveSelectorComponentView = Lateralus.Component.View.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);
    }

    ,getTemplateRenderData: function () {
      var renderData = this._super('getTemplateRenderData', arguments);

      _.extend(renderData, {
        curves: Object.keys(Tweenable.prototype.formula)
      });

      return renderData;
    }
  });

  return CurveSelectorComponentView;
});
