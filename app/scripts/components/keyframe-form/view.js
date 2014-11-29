define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,template

) {
  'use strict';

  var KeyframeFormComponentView = Lateralus.Component.View.extend({
    template: template

    ,tagName: 'li'

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);
    }

    ,getTemplateRenderData: function () {
      var renderData = this._super('getTemplateRenderData', arguments);

      return _.extend({
        properties: [
            'x'
            ,'y'
            ,'scale'
            ,'rotationX'
            ,'rotationY'
            ,'rotationZ'
          ].map(function (field) {
            return { name: field, value: renderData[field] };
          })
      });
    }
  });

  return KeyframeFormComponentView;
});
