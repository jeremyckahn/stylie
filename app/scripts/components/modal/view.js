define([

  'jquery'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.hidable'

  ,'../../constant'

], function (

  $
  ,Lateralus

  ,template

  ,HidableComponent

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ModalComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      userRequestCloseModal: function () {
        this.hidableView.hide();
      }
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt
       */
      'mousedown': function (evt) {
        if (evt.target !== this.el) {
          return;
        }

        this.hidableView.hide();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.$el.addClass('modal-view');

      this.hidableView = this.addSubview(HidableComponent.View, {
        el: this.el
        ,startHidden: true
        ,targetShowOpacity: constant.MODAL_OPACITY
      });
    }

    ,toggle: function () {
      this.hidableView.toggle();
      var isShowing = this.hidableView.isShowing();

      if (isShowing) {
        // Whatever triggered the modal to be shown is now in the background,
        // so blur it.
        $(document.activeElement).blur();
      }
    }
  });

  return ModalComponentView;
});
