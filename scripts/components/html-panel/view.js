import Lateralus from 'lateralus';
import template from 'text!./template.mustache';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const HtmlPanelComponentView = Base.extend({
  template: template,

  events: {
    'keyup textarea': function() {
      this.emit('userRequestUpdateActorHtml', this.$html.val());
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);
  },

  deferredInitialize: function() {
    this.$html.html(this.collectOne('actorHtml'));
  },
});

export default HtmlPanelComponentView;
