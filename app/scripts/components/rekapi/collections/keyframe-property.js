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

    ,comparator: 'millisecond'

    ,initialize: function () {
      this.on('change', this.onChange, this);
    }

    /**
     * @param {KeyframePropertyModel} model
     */
    ,onChange: function (model) {
      if ('millisecond' in model.changed) {
        this.sort();
      }
    }

    /**
     * @param {boolean} isCentered
     */
    ,setCenteringRules: function (isCentered) {
      this.invoke('set', 'isCentered', isCentered);
    }
  });

  return KeyframePropertyCollection;
});
