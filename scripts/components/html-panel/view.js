import Lateralus from 'lateralus';
import template from 'text!./template.mustache';

var Base = Lateralus.Component.View;
var baseProto = Base.prototype;

var HtmlPanelComponentView = Base.extend({
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
