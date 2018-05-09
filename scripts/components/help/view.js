import _ from 'underscore';
import Lateralus from 'lateralus';
import template from 'text!./template.mustache';
import ModalComponent from 'aenima/components/modal/main';
import aenimaUtils from 'aenima/utils';

var Base = ModalComponent.View;
var baseProto = Base.prototype;

var HelpComponentView = Base.extend({
  template: template,

  lateralusEvents: _.extend(
    {
      userRequestToggleHelpModal: function() {
        if (!this.lateralus.model.get('isEmbedded')) {
          this.hidableView.toggle();
        }
      },
    },
    baseProto.lateralusEvents
  ),

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);
  },

  /**
   * @override
   */
  getTemplateRenderData: function() {
    return _.extend(baseProto.getTemplateRenderData.apply(this, arguments), {
      metaKey: aenimaUtils.isMac() ? '⌘' : 'Ctrl',
    });
  },
});

export default HelpComponentView;
