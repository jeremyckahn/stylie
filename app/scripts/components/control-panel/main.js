define([

  'underscore'
  ,'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.keyframes-panel'
  ,'stylie.component.motion-panel'
  ,'stylie.component.css-panel'

], function (

  _
  ,Lateralus

  ,View
  ,template

  ,KeyframePanelComponent
  ,MotionPanelComponent
  ,CssPanelComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ControlPanelComponent = Base.extend({
    name: 'control-panel'
    ,View: View
    ,template: template

    ,initialize: function () {
      this.addComponent(KeyframePanelComponent, {
        el: this.view.$keyframesPanel
      });

      this.motionPanelComponent = this.addComponent(MotionPanelComponent, {
        el: this.view.$motionPanel
      });

      this.cssPanelComponent = this.addComponent(CssPanelComponent, {
        el: this.view.$cssPanel
      });
    }

    /**
     * @return {{
     *   name: string,
     *   fps: number,
     *   vendors: Array.<string>,
     *   isCentered: boolean,
     *   iterations: boolean|undefined
     * }}
     */
    ,getCssConfigObject: function () {
      var motionPanelJson = this.motionPanelComponent.toJSON();
      var cssPanelJson = this.cssPanelComponent.toJSON();

      return _.extend(motionPanelJson, cssPanelJson);
    }
  });

  return ControlPanelComponent;
});
