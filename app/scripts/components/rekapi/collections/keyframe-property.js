define([

  'backbone'
  ,'lateralus'

  ,'../models/keyframe-property'

], function (

  Backbone
  ,Lateralus

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
     * @override
     * @param {string} methodName
     */
    ,invoke: function (methodName) {
      var isSet = methodName === 'set';

      if (isSet) {
        this.component.beginBulkKeyframeOperation();
      }

      Backbone.Collection.prototype.invoke.apply(this, arguments);

      if (isSet) {
        this.component.endBulkKeyframeOperation();
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
