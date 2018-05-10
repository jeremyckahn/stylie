import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const CrosshairComponent = Base.extend({
  name: 'stylie-crosshair',
  View: View,
  template: template,
});

export default CrosshairComponent;
