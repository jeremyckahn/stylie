import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var KeyframeFormComponent = Base.extend({
  name: 'stylie-keyframe-form',
  View: View,
  template: template,
});

export default KeyframeFormComponent;
