define([

  'backbone'
  ,'lateralus'

  ,'aenima/components/rekapi/main'

  ,'../models/keyframe-property'

], function (

  Backbone
  ,Lateralus

  ,AEnimaRekapiComponent

  ,KeyframePropertyModel

) {
  'use strict';

  var Base = AEnimaRekapiComponent.KeyframePropertyCollection;
  var baseProto = Base.prototype;

  var KeyframePropertyCollection = Base.extend({
    model: KeyframePropertyModel

    ,lateralusEvents: {
      /**
       * @param {boolean} isCentered
       */
      userRequestUpdateCenteringSetting: function (isCentered) {
        this.setCenteringRules(isCentered);
      }
    }

    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.setCenteringRules(this.lateralus.model.getUi('centerToPath'));
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
