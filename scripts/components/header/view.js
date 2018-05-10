import Lateralus from 'lateralus';
import template from 'text!./template.mustache';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const HeaderComponentView = Base.extend({
  template: template,

  events: {
    'click .help': function() {
      this.$help.blur();
      this.emit('userRequestToggleHelpModal');
    },

    'click .reset': function() {
      this.emit('userRequestResetAnimation');
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);
  },
});

export default HeaderComponentView;
