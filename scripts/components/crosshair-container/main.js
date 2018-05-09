import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var CrosshairContainerComponent = Base.extend({
  name: 'stylie-crosshair-container',
  View: View,
  template: template,
});

export default CrosshairContainerComponent;
