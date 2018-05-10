import _ from 'underscore';
import Lateralus from 'lateralus';
import template from 'text!./template.mustache';
import AEnimaControlPanelComponent from 'aenima/components/control-panel/main';
import HidableComponent from 'aenima/components/hidable/main';
import constant from '../../constant';

const Base = AEnimaControlPanelComponent.View;
const baseProto = Base.prototype;

const ControlPanelComponentView = Base.extend({
  template,

  lateralusEvents: {
    userRequestToggleControlPanel() {
      this.hidableView.toggle();
    },
  },

  events: {
    dragEnd() {
      this.orientToRight();
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize() {
    baseProto.initialize.apply(this, arguments);
    this.$el.addClass('control-panel-view');

    this.hidableView = this.addSubview(HidableComponent.View, {
      el: this.el,
    });

    this.$el.dragon({
      handle: this.$tabsContainer,
      within: this.$el.parent(),
    });
  },

  deferredInitialize() {
    const width = this.$el.outerWidth(true);
    const parentWidth = this.$el.parent().width();
    const left = parentWidth - width - constant.CONTROL_PANEL_PADDING_FROM_CORNER;

    this.$el.css({
      top: constant.CONTROL_PANEL_PADDING_FROM_CORNER,
      left,
    });

    this.orientToRight();
  },

  /**
   * @override
   */
  getTemplateRenderData() {
    const isEmbedded = this.lateralus.model.get('isEmbedded');

    return _.extend(
      {
        showExportPanel: !isEmbedded,
        showHtmlPanel: !isEmbedded,
        showUserPanel: this.lateralus.model.get('hasApi'),
      },
      baseProto.getTemplateRenderData.apply(this, arguments)
    );
  },

  /**
   * Orient the control panel (which is absolutely positioned) to the right
   * of the parent, rather than the left (which is how $.dragon works).  This
   * prevents the control panel from falling off the screen if the user makes
   * their browser window smaller.
   */
  orientToRight() {
    const left = parseInt(this.$el.css('left'), 10);
    const width = this.$el.outerWidth(true);
    const parentWidth = this.$el.parent().width();
    const right = parentWidth - left - width;

    this.$el.css({
      left: '',
      right,
    });
  },
});

export default ControlPanelComponentView;
