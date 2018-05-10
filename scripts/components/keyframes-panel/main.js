import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const KeyframesPanelComponent = Base.extend({
  name: 'stylie-keyframes-panel',
  View: View,
  template: template,
});

export default KeyframesPanelComponent;
