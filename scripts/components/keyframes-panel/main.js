import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var KeyframesPanelComponent = Base.extend({
  name: 'stylie-keyframes-panel',
  View: View,
  template: template,
});

export default KeyframesPanelComponent;
