define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'aenima.component.control-panel'
  ,'stylie.component.hidable'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,template

  ,AEnimaControlPanelComponent
  ,HidableComponent

  ,constant

) {
  'use strict';

  var Base = AEnimaControlPanelComponent.View;
  var baseProto = Base.prototype;

  var ControlPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      userRequestToggleControlPanel: function () {
        this.hidableView.toggle();
      }
    }

    ,events: {
      dragEnd: function () {
        this.orientToRight();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);

      this.hidableView = this.addSubview(HidableComponent.View, {
        el: this.el
      });

      this.$el.dragon({
        handle: this.$tabsContainer
        ,within: this.$el.parent()
      });
    }

    ,deferredInitialize: function () {
      var width = this.$el.outerWidth(true);
      var parentWidth = this.$el.parent().width();
      var left = (
        parentWidth - width - constant.CONTROL_PANEL_PADDING_FROM_CORNER);

      this.$el.css({
        top: constant.CONTROL_PANEL_PADDING_FROM_CORNER
        ,left: left
      });

      this.orientToRight();
    }

    /**
     * Orient the control panel (which is absolutely positioned) to the right
     * of the parent, rather than the left (which is how $.dragon works).  This
     * prevents the control panel from falling off the screen if the user makes
     * their browser window smaller.
     */
    ,orientToRight: function () {
      var left = parseInt(this.$el.css('left'), 10);
      var width = this.$el.outerWidth(true);
      var parentWidth = this.$el.parent().width();
      var right = parentWidth - left - width;

      this.$el.css({
        left: ''
        ,right: right
      });
    }
  });

  return ControlPanelComponentView;
});
