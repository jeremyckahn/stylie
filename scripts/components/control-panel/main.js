import _ from 'underscore';
import View from './view';
import template from 'text!./template.mustache';
import AEnimaControlPanelComponent from 'aenima/components/control-panel/main';
import KeyframePanelComponent from '../keyframes-panel/main';
import MotionPanelComponent from 'aenima/components/motion-panel/main';
import ExportPanelComponent from 'aenima/components/export-panel/main';
import HtmlPanelComponent from '../html-panel/main';
import ManagementPanelComponent from 'aenima/components/management-panel/main';
import UserPanelComponent from 'aenima/components/user-panel/main';

const Base = AEnimaControlPanelComponent;

const ControlPanelComponent = Base.extend({
  name: 'stylie-control-panel',
  View,
  template,

  provide: {
    /**
     * @return {{
     *   name: string,
     *   fps: number,
     *   vendors: Array.<string>,
     *   isCentered: boolean,
     *   iterations: boolean|undefined
     * }}
     */
    cssConfigObject() {
      const motionPanelJson = this.motionPanelComponent.toJSON();
      const exportPanelJson = this.exportPanelComponent
        ? this.exportPanelComponent.toJSON()
        : {};

      return _.extend(motionPanelJson, exportPanelJson);
    },
  },

  initialize() {
    this.addComponent(KeyframePanelComponent, {
      el: this.view.$keyframesPanel,
    });

    this.motionPanelComponent = this.addComponent(
      MotionPanelComponent,
      {
        el: this.view.$motionPanel,
      },
      {
        modelAttributes: {
          enableOnionSkinToggle: false,
        },
      }
    );

    if (this.view.$exportPanel) {
      this.exportPanelComponent = this.addComponent(
        ExportPanelComponent,
        {
          el: this.view.$exportPanel,
        },
        {
          modelAttributes: {
            cssExportClass: 'stylie',
            analyticsUrl:
              'https://ga-beacon.appspot.com/UA-42910121-1/stylie?pixel',
          },
        }
      );
    }

    if (this.view.$htmlPanel) {
      this.htmlPanelComponent = this.addComponent(HtmlPanelComponent, {
        el: this.view.$htmlPanel,
      });
    }

    this.managementPanelComponent = this.addComponent(
      ManagementPanelComponent,
      {
        el: this.view.$managementPanel,
      }
    );

    if (this.view.$userPanel) {
      this.userPanelComponent = this.addComponent(UserPanelComponent, {
        el: this.view.$userPanel,
      });
    }
  },
});

export default ControlPanelComponent;
