import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var CrosshairComponent = Base.extend({
  name: 'stylie-crosshair',
  View: View,
  template: template,
});

export default CrosshairComponent;
