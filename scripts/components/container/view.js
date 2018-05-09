define([
  'jquery',
  'underscore',
  'lateralus',
  'text!./template.mustache',
], function($, _, Lateralus, template) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ContainerComponentView = Base.extend({
    template: template,

    className: 'aenima',

    events: {
      /**
       * Force a range input "drag" to trigger a "change" event.
       * @param {jQuery.Event} evt
       */
      'mousemove input[type=range]': function(evt) {
        $(evt.target).change();
      },

      /**
       * Force a number input "hold" to trigger a "change" event.
       * @param {jQuery.Event} evt
       */
      'keydown input[type=number]': function(evt) {
        $(evt.target).change();
      },

      /**
       * @param {jQuery.Event} evt
       */
      'mousewheel input[type=number]': function(evt) {
        $(evt.target).change();
      },

      'click .sidebar-controls .reset': function() {
        this.emit('userRequestResetAnimation');
      },

      'click .sidebar-controls .rotation': function() {
        this.emit('userRequestToggleRotationEditMode');
      },

      'focus input': function() {
        this.emit('userRequestDisableKeyframeSelection');
      },
    },

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    initialize: function() {
      baseProto.initialize.apply(this, arguments);
      this.$el
        .addClass('loading')
        .addClass(
          this.lateralus.model.get('isEmbedded') ? 'embedded' : 'standalone'
        );
    },

    deferredInitialize: function() {
      this.$el.removeClass('loading');
    },

    /**
     * @override
     */
    getTemplateRenderData: function() {
      return _.extend(baseProto.getTemplateRenderData.apply(this, arguments), {
        isEmbedded: this.lateralus.model.get('isEmbedded'),
      });
    },
  });

  return ContainerComponentView;
});
