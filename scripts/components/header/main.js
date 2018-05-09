import Lateralus from 'lateralus';
import View from './view';
import template from 'text!./template.mustache';

var Base = Lateralus.Component;

var HeaderComponent = Base.extend({
  name: 'stylie-header',
  View: View,
  template: template,
});

export default HeaderComponent;
