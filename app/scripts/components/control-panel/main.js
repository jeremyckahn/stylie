define([

  'underscore'

  ,'./view'
  ,'text!./template.mustache'

  ,'aenima/components/control-panel/main'

  ,'../keyframes-panel/main'
  ,'aenima/components/motion-panel/main'
  ,'aenima/components/export-panel/main'
  ,'../html-panel/main'
  ,'aenima/components/management-panel/main'
  ,'aenima/components/user-panel/main'

], function (

  _

  ,View
  ,template

  ,AEnimaControlPanelComponent

  ,KeyframePanelComponent
  ,MotionPanelComponent
  ,ExportPanelComponent
  ,HtmlPanelComponent
  ,ManagementPanelComponent
  ,UserPanelComponent

) {
  'use strict';

  var Base = AEnimaControlPanelComponent;

  var ControlPanelComponent = Base.extend({
    name: 'stylie-control-panel'
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
        var exportPanelJson = this.exportPanelComponent ?
          this.exportPanelComponent.toJSON()
          : {};

        return _.extend(motionPanelJson, exportPanelJson);
      }
    }

    ,initialize: function () {
      this.addComponent(KeyframePanelComponent, {
        el: this.view.$keyframesPanel
      });

      this.motionPanelComponent = this.addComponent(MotionPanelComponent, {
        el: this.view.$motionPanel
      }, {
        modelAttributes: {
          enableOnionSkinToggle: false
        }
      });

      if (this.view.$exportPanel) {
        this.exportPanelComponent = this.addComponent(ExportPanelComponent, {
          el: this.view.$exportPanel
        }, {
          modelAttributes: {
            cssExportClass: 'stylie'
            ,analyticsUrl:
              'https://ga-beacon.appspot.com/UA-42910121-1/stylie?pixel'
          }
        });
      }

      if (this.view.$htmlPanel) {
        this.htmlPanelComponent = this.addComponent(HtmlPanelComponent, {
          el: this.view.$htmlPanel
        });
      }

      this.managementPanelComponent =
          this.addComponent(ManagementPanelComponent, {
        el: this.view.$managementPanel
      });

      if (this.view.$userPanel) {
        this.userPanelComponent =
            this.addComponent(UserPanelComponent, {
          el: this.view.$userPanel
        });
      }
    }
  });

  return ControlPanelComponent;
});
