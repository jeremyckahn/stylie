define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'aenima/components/control-panel/main'
  ,'aenima/components/hidable/main'

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
      this.$el.addClass('control-panel-view');

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
     * @override
     */
    ,getTemplateRenderData: function () {
      var isEmbedded = this.lateralus.model.get('isEmbedded');

      return _.extend({
        showExportPanel: !isEmbedded
        ,showHtmlPanel: !isEmbedded
        ,showUserPanel: this.lateralus.model.get('hasApi')
      }, baseProto.getTemplateRenderData.apply(this, arguments));
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
