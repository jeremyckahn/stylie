import Lateralus from 'lateralus';
import template from 'text!./template.mustache';

var Base = Lateralus.Component.View;
var baseProto = Base.prototype;

var TooSmallMessageComponentView = Base.extend({
  template: template,

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);
  },
});

export default TooSmallMessageComponentView;
