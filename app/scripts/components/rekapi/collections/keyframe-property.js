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

    ,lateralusEvents: {
      /**
       * @param {boolean} isCentered
       */
      userRequestUpdateCenteringSetting: function (isCentered) {
        this.setCenteringRules(isCentered);
      }
    }

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
      this.component.beginBulkKeyframeOperation();
      this.invoke('set', 'isCentered', isCentered);
      this.component.endBulkKeyframeOperation();
    }
  });

  return KeyframePropertyCollection;
});
