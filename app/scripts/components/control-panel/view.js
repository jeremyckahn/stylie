define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'lateralus.component.tabs'
  ,'stylie.component.hidable'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,template

  ,TabsComponent
  ,HidableComponent

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
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

      this.tabsComponent = this.addSubview(TabsComponent.View, {
        $tabsContainer: this.$tabsContainer,
        $tabsContentContainer: this.$tabsContentContainer
      });

      this.hidableView = this.addSubview(HidableComponent.View, {
        el: this.el
      });

      this.selectTabFromLocalStorage();
      this.listenTo(this.tabsComponent, 'tabShown', this.onTabShown.bind(this));

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
     * @param {jQuery} $shownTab
     */
    ,onTabShown: function ($shownTab) {
      this.lateralus.setUi(
        'focusedControlPanelTab', $shownTab.data('tabName'));
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

    ,selectTabFromLocalStorage: function () {
      var focusedTabName = this.lateralus.getUi('focusedControlPanelTab');

      if (focusedTabName) {
        var $focusedTab = this.$tabsContainer.children()
          .filter('[data-tab-name="' + focusedTabName + '"]');

        this.tabsComponent.selectTab($focusedTab);
      }
    }
  });

  return ControlPanelComponentView;
});
