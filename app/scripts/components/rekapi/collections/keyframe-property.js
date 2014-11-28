define([

  'backbone'

  ,'../models/keyframe-property'

], function (

  Backbone

  ,KeyframePropertyModel

) {
  'use strict';

  var KeyframePropertyCollection = Backbone.Collection.extend({
    model: KeyframePropertyModel
  });

  return KeyframePropertyCollection;
});
