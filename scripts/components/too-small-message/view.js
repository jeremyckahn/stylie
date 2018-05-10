import Lateralus from 'lateralus';
import template from 'text!./template.mustache';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const TooSmallMessageComponentView = Base.extend({
  template: template,

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize: function() {
    baseProto.initialize.apply(this, arguments);
  },
});

export default TooSmallMessageComponentView;
