define([

  'lateralus'

  ,'text!./template.mustache'

  ,'lateralus.component.tabs'
  ,'stylie.component.keyframes-panel'
  ,'stylie.component.motion-panel'

], function (

  Lateralus

  ,template

  ,TabsComponent
  ,KeyframePanelComponent
  ,MotionPanelComponent

) {
  'use strict';

  var ControlPanelComponentView = Lateralus.Component.View.extend({
    template: template

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      this._super('initialize', arguments);

      this.addSubview(TabsComponent.View, {
        $tabsContainer: this.$tabsContainer,
        $tabsContentContainer: this.$tabsContentContainer
      });

      this.addComponent(KeyframePanelComponent, {
        el: this.$keyframesPanel
      });

      this.addComponent(MotionPanelComponent, {
        el: this.$motionPanel
      });
    }
  });

  return ControlPanelComponentView;
});
