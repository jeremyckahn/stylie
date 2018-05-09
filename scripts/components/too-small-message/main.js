import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var TooSmallMessageComponent = Base.extend({
  name: 'stylie-too-small-message',
  View: View,
  template: template,
});

export default TooSmallMessageComponent;
