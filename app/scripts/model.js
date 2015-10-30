define([

  'underscore'
  ,'lateralus'

  ,'aenima.model/persisted-model'

], function (

  _
  ,Lateralus

  ,PersistedModel

) {
  'use strict';

  var Base = PersistedModel;
  var baseProto = Base.prototype;

  var INITIAL_STATE = {
      savedAnimations: {}
      ,isRotationModeEnabled: false
      ,isLoadingTimeline: false
      ,ui: {
        exportOrientation: 'first-keyframe'
        ,focusedControlPanelTab: ''
        ,showPath: true
        ,centerToPath: true
        ,cssSize: 30
        ,selectedVendors: ['w3']
      }
    };

  var StylieModel = Base.extend({
    localStorageId: 'stylieData'

    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      if (this.keys().length) {
        this.retrofitUiData();
      } else {
        this.setInitialState();
      }

      // Override whatever is in localStorage for this property, it's weird to
      // start with Rotation Mode enabled
      this.set('isRotationModeEnabled', false);
    }

    ,setInitialState: function () {
      // Call .set() directly instead of leveraging Backbone.Model#defaults to
      // prevent shared prototype references.
      this.set(INITIAL_STATE);
    }

    /**
     * Some ui keys were added at different times in project history, so ui
     * data must be partially, retroactively re-initialized to prevent corrupt
     * UI state.
     */
    ,retrofitUiData: function () {
      _.defaults(this.attributes.ui, INITIAL_STATE.ui);
    }
  });

  return StylieModel;
});
