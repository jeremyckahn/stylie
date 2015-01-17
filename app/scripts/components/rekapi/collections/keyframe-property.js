define([

  'lateralus'

  ,'../models/keyframe-property'

], function (

  Lateralus

  ,KeyframePropertyModel

) {
  'use strict';

  var Base = Lateralus.Component.Collection;

  var KeyframePropertyCollection = Base.extend({
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
