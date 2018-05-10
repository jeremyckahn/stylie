import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';
import HeaderComponent from '../header/main';
import HelpComponent from '../help/main';
import TooSmallMessageComponent from '../too-small-message/main';
import ControlPanelComponent from '../control-panel/main';
import PreviewComponent from '../preview/main';

const Base = Lateralus.Component;

const ContainerComponent = Base.extend({
  name: 'stylie-container',
  View: View,
  template: template,

  initialize: function() {
    if (!this.lateralus.model.get('isEmbedded')) {
      this.headerComponent = this.addComponent(HeaderComponent, {
        el: this.view.$header[0],
      });

      this.helpComponent = this.addComponent(HelpComponent, {
        el: this.view.$help[0],
      });

      this.tooSmallMessageComponent = this.addComponent(
        TooSmallMessageComponent,
        {
          el: this.view.$tooSmallMessage[0],
        }
      );
    }

    this.controlPanelComponent = this.addComponent(ControlPanelComponent, {
      el: this.view.$controlPanel[0],
    });

    this.previewComponent = this.addComponent(PreviewComponent, {
      el: this.view.$preview[0],
    });
  },
});

export default ContainerComponent;
