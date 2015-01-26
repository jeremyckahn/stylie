define([

  'lateralus'

  ,'text!./template.mustache'

  ,'stylie.component.hidable'

  ,'../../constant'

], function (

  Lateralus

  ,template

  ,HidableComponent

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var HelpComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      userRequestToggleHelpModal: function () {
        this.hidableView.toggle();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.hidableView = this.addSubview(HidableComponent.View, {
        el: this.el
        ,startHidden: true
        ,targetShowOpacity: constant.MODAL_OPACITY
      });
    }
  });

  return HelpComponentView;
});
