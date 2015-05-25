define([

  'underscore'
  ,'lateralus'

  ,'./view'
  ,'text!./template.mustache'

  ,'stylie.component.keyframes-panel'
  ,'stylie.component.motion-panel'
  ,'stylie.component.export-panel'
  ,'stylie.component.html-panel'
  ,'stylie.component.management-panel'

], function (

  _
  ,Lateralus

  ,View
  ,template

  ,KeyframePanelComponent
  ,MotionPanelComponent
  ,ExportPanelComponent
  ,HtmlPanelComponent
  ,ManagementPanelComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var ControlPanelComponent = Base.extend({
    name: 'control-panel'
    ,View: View
    ,template: template

    ,provide: {
      /**
       * @return {{
       *   name: string,
       *   fps: number,
       *   vendors: Array.<string>,
       *   isCentered: boolean,
       *   iterations: boolean|undefined
       * }}
       */
      cssConfigObject: function () {
        var motionPanelJson = this.motionPanelComponent.toJSON();
        var exportPanelJson = this.exportPanelComponent.toJSON();

        return _.extend(motionPanelJson, exportPanelJson);
      }
    }

    ,initialize: function () {
      this.addComponent(KeyframePanelComponent, {
        el: this.view.$keyframesPanel
      });

      this.motionPanelComponent = this.addComponent(MotionPanelComponent, {
        el: this.view.$motionPanel
      });

      this.exportPanelComponent = this.addComponent(ExportPanelComponent, {
        el: this.view.$exportPanel
      });

      this.htmlPanelComponent = this.addComponent(HtmlPanelComponent, {
        el: this.view.$htmlPanel
      });

      this.managementPanelComponent =
          this.addComponent(ManagementPanelComponent, {
        el: this.view.$managementPanel
      });
    }
  });

  return ControlPanelComponent;
});
