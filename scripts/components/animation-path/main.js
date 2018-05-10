import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const AnimationPathComponent = Base.extend({
  name: 'stylie-animation-path',
  View,
  template,
});

export default AnimationPathComponent;
