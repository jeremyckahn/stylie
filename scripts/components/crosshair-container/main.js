import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

const Base = Lateralus.Component;

const CrosshairContainerComponent = Base.extend({
  name: 'stylie-crosshair-container',
  View,
  template,
});

export default CrosshairContainerComponent;
