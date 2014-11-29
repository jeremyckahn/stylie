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

  var PROPERTY_RENDER_LIST = [
      { name: 'x', displayName: 'x' }
      ,{ name: 'y', displayName: 'y' }
      ,{ name: 'scale', displayName: 's' }
      ,{ name: 'rotationX', displayName: 'rX' }
      ,{ name: 'rotationY', displayName: 'rY' }
      ,{ name: 'rotationZ', displayName: 'rZ' }
    ];

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
        properties: PROPERTY_RENDER_LIST.map(function (propertyObject) {
            var name = propertyObject.name;

            return {
              name: name
              ,value: renderData[name]
              ,displayName: propertyObject.displayName
            };
          })
        ,curves: Object.keys(Tweenable.prototype.formula)

        ,canChangeEasingCurve: this.model.get('millisecond') !== 0
      });
    }
  });

  return KeyframeFormComponentView;
});
