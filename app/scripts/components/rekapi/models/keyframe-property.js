define([

  'backbone'
  ,'mustache'

  ,'text!../templates/transform-string.mustache'

], function (

  Backbone
  ,Mustache

  ,transformStringTemplate

) {
  'use strict';

  var KeyframePropertyModel = Backbone.Model.extend({
    defaults: {
      millisecond: 0
      ,x: 0
      ,y: 0
      ,scale: 1
      ,rotationX: 0
      ,rotationY: 0
      ,rotationZ: 0
    }

    ,toString: function () {
      return Mustache.render(
        // Strip out any newlines
        transformStringTemplate.replace(/\n/g,''), this.toJSON());
    }
  });

  return KeyframePropertyModel;
});
