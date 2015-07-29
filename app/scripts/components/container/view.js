define([

  'lateralus'

  ,'text!./template.mustache'

], function (

  Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ContainerComponentView = Base.extend({
    template: template

    ,events: {
      /**
       * Force a range input "drag" to trigger a "change" event.
       * @param {jQuery.Event} evt
       */
      'mousemove input[type=range]': function (evt) {
        $(evt.target).change();
      }

      /**
       * Force a number input "hold" to trigger a "change" event.
       * @param {jQuery.Event} evt
       */
      ,'keydown input[type=number]': function (evt) {
        $(evt.target).change();
      }

      /**
       * @param {jQuery.Event} evt
       */
      ,'mousewheel input[type=number]': function (evt) {
        $(evt.target).change();
      }

      ,'click .mode-toggles .rotation': function () {
        this.emit('userRequestToggleRotationEditMode');
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.$el.addClass('loading');
    }

    ,deferredInitialize: function () {
      this.$el.removeClass('loading');
    }
  });

  return ContainerComponentView;
});
