define([

  'lateralus'
  ,'./mixins/local-storage-model'

], function (

  Lateralus
  ,localStorageMixin

) {
  'use strict';

  var StylieModel = Lateralus.Model.extend({
    localStorageId: 'stylieData'

    ,initialize: function () {
      // TODO: It would be nice if the localStorageMixin methods were mixed in
      // directly onto StylieModel's prototype.
      this.mixin(localStorageMixin);

      if (!this.keys().length) {
        this.setInitialState();
      }
    }

    ,setInitialState: function () {
      // Call .set() directly instead of leveraging Backbone.Model#defaults to
      // prevent shared prototype references.
      this.set({
        savedAnimations: {}
        ,ui: {
          exportOrientation: 'first-keyframe'
          ,focusedControlPanelTab: ''
        }
      });
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
