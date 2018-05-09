import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var AnimationPathComponent = Base.extend({
  name: 'stylie-animation-path',
  View: View,
  template: template,
});

export default AnimationPathComponent;
