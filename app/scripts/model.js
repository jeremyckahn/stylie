define([

  'underscore'
  ,'lateralus'
  ,'./mixins/local-storage-model'

], function (

  _
  ,Lateralus
  ,localStorageMixin

) {
  'use strict';

  var INITIAL_STATE = {
      savedAnimations: {}
      ,isRotationModeEnabled: false
      ,ui: {
        exportOrientation: 'first-keyframe'
        ,focusedControlPanelTab: ''
        ,showPath: true
        ,centerToPath: true
        ,cssSize: 30
        ,selectedVendors: ['w3']
      }
    };

  var StylieModel = Lateralus.Model.extend({
    localStorageId: 'stylieData'

    ,initialize: function () {
      // TODO: It would be nice if the localStorageMixin methods were mixed in
      // directly onto StylieModel's prototype.
      this.mixin(localStorageMixin);

      // Override whatever is in localStorage for this property, it's weird to
      // start with Rotation Mode enabled
      this.set('isRotationModeEnabled', false);

      if (this.keys().length) {
        this.retrofitUiData();
      } else {
        this.setInitialState();
      }
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

    /**
     * @param {string} name
     * @return {*}
     */
    ,getUi: function (name) {
      return this.get('ui')[name];
    }

    /**
     * @param {string} name
     * @param {*} value
     */
    ,setUi: function (name, value) {
      this.attributes.ui[name] = value;

      // Persist app state to localStorage.
      this.trigger('change');
    }
  });

  return StylieModel;
});
